const { Friendship, User } = require("../models");
const { Op } = require("sequelize");

module.exports = class friendshipController {
  static addFriend = async (req, res, next) => {
    try {
      const { id: FriendId } = req.params;
      const { id: UserId } = req.user;

      const dataUser = User.findByPk(req.params.id);
      if (!dataUser) throw ({ name: "Data not found!" });

      // cek apakah pertemanan udah ada?

      const existingFriendship = await Friendship.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [{ UserId: UserId }, { UserId: FriendId }],
            },
            {
              [Op.or]: [{ FriendId: UserId }, { FriendId: FriendId }],
            },
            { [Op.or]: [{ status: "accepted" }, { status: "pending" }] },
          ],
        },
      });

      if (existingFriendship) {
        return res.status(400).json({ message: "You are already friends." });
      }

      // kalo gak da create hubungan pertemanan
      await Friendship.create({
        UserId,
        FriendId,
        status: "pending",
      });

      res.status(201).json({ message: "Friend request sent." });
    } catch (error) {
      console.error("Error adding friend:", error);
      next(error);
    }
  };
  static acceptFriend = async (req, res, next) => {
    try {
      const { id: UserId } = req.user; // Ambil UserId dari req.user
      const { id: FriendId } = req.params; // Ambil FriendId dari params

      // buat status pertemanan menjadi accepted ..
      await Friendship.update(
        { status: "accepted" },
        { where: { UserId: FriendId, FriendId: UserId } } // Tukar UserId dan FriendId
      );

      res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      next(error);
    }
  };

  static getFriendLists = async (req, res, next) => {
    try {
      const { id: UserId } = req.user;

      // Ambil data pertemanan yang sudah diterima (status: accepted)
      //harus pake OP biar bisa 2 sisi get friend nya bukan cuma yang add atau yg acc doang
      const friendships = await Friendship.findAll({
        where: {
          [Op.or]: [
            { UserId: UserId, status: "accepted" },
            { FriendId: UserId, status: "accepted" },
          ],
        },
      });

      const friendIds = friendships.map((friendship) => {
        if (friendship.UserId === UserId) {
          return friendship.FriendId;
        } else {
          return friendship.UserId;
        }
      });

      // Ambil data teman-temannya berdasarkan ID-nya
      const friends = await User.findAll({
        where: {
          id: friendIds,
        },
      });

      res.status(200).json({ friends });
    } catch (error) {
      console.error("Error getting friend list:", error);
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
          status: "pending",
        },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.status(200).json({ pendingFriendships });
    } catch (error) {
      console.error("Error getting pending friend requests:", error);
      next(error);
    }
  };

  static pendingFriendships = async (req, res, next) => {
    try {
      const { id: UserId } = req.user;

      // Ambil data pertemanan yang statusnya 'pending' ato (menunggu persetujuan)
      const existingFriendship = await Friendship.findAll({
        where: {
          [Op.or]: [
            {
              [Op.or]: [{ UserId: UserId }, { FriendId: UserId }],
            },
            { [Op.or]: [{ status: "accepted" }, { status: "pending" }] },
          ],
        },
      });

      const friendIds = existingFriendship.map((friendship) => {
        if (friendship.UserId === UserId) {
          return friendship.FriendId;
        } else {
          return friendship.UserId;
        }
      });

      const friends = await User.findAll({
        where: {
          id: friendIds,
        },
        attributes: {
          exclude: ["password"],
        },
      });

      res.status(200).json({ pendingFriendships: friends });
    } catch (error) {
      console.error("Error getting pending friend requests:", error);
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
          status: "pending",
        },
      });

      res.status(200).json({ message: "Friend request declined and removed." });
    } catch (error) {
      console.error("Error declining friend request:", error);
      next(error);
    }
  };
};
