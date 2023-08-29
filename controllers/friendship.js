const { Friendship, User } = require('../models');

module.exports = class friendshipController {
  static addFriend = async (req, res, next) => {
    try {
      const { id: FriendId } = req.params;
      const { id: UserId } = req.user;

      // cek apakah pertemanan udah ada?
      const existingFriendship = await Friendship.findOne({
        where: {
          UserId,
          FriendId,
          status: 'accepted'
        }
      });

      const existingFriendship1 = await Friendship.findOne({
        where: {
          UserId: FriendId,
          FriendId: UserId,
          status: 'accepted'
        }
      });

      if (existingFriendship || existingFriendship1) {
        return res.status(400).json({ message: 'You are already friends.' });
      }

      // kalo gak da create hubungan pertemanan
      await Friendship.create({
        UserId,
        FriendId,
        status: 'pending'
      });

      res.status(201).json({ message: 'Friend request sent.' });
    } catch (error) {
      console.error('Error adding friend:', error);
      next(error);
    }
  };
  static acceptFriend = async (req, res, next) => {
    try {
      const { id: UserId } = req.user; // Ambil UserId dari req.user
      const { id: FriendId } = req.params; // Ambil FriendId dari params

      // buat status pertemanan menjadi accepted ..
      await Friendship.update(
        { status: 'accepted' },
        { where: { UserId: FriendId, FriendId: UserId } } // Tukar UserId dan FriendId
      );

      res.status(200).json({ message: 'Friend request accepted.' });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      next(error);
    }
  };


  static getFriendLists = async (req, res, next) => {
    try {
      const { id: UserId } = req.user; // Ambil UserId dari req.user

      // Ambil data pertemanan yang sudah diterima (status: accepted)
      const friendships = await Friendship.findAll({
        where: {
          UserId: UserId,
          status: 'accepted'
        }
      });

      const friendIds = friendships.map(friendship => friendship.FriendId);

      // Ambil data teman2nya berdasarkan ID-nya 
      const friends = await User.findAll({
        where: {
          id: friendIds
        }
      });

      res.status(200).json({ friends });
    } catch (error) {
      console.error('Error getting friend list:', error);
      next(error);
    }
  };

  static getFriendsToAcceptLists = async (req, res, next) => {
    try {
      const { id: UserId } = req.user;

      // Ambil data pertemanan yang statusnya 'pending' ato (menunggu persetujuan)
      const pendingFriendships = await Friendship.findAll({
        where: {
          FriendId: UserId,
          status: 'pending'
        },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'email']
          }
        ]
      });

      res.status(200).json({ pendingFriendships });
    } catch (error) {
      console.error('Error getting pending friend requests:', error);
      next(error);
    }
  };

  static ignoreOrDeclineFriend = async (req, res, next) => {
    try {
      const { id: UserId } = req.user;
      const { id: FriendId } = req.params;

      // Hapus data pertemanan yang masih dalam status 'pending'
      await Friendship.destroy({
        where: {
          UserId: FriendId,
          FriendId: UserId,
          status: 'pending'
        }
      });

      res.status(200).json({ message: 'Friend request declined and removed.' });
    } catch (error) {
      console.error('Error declining friend request:', error);
      next(error);
    }
  };
};