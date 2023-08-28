const { Leaderboard, Event, User } = require("../models");

module.exports = class leaderboardController {
  static getAllLeaderboards = async (req, res, next) => {
    try {
      const dataLeaderboards = await Leaderboard.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          },
          {
            model: Event
          },
        ]
      });
      res.status(200).json(dataLeaderboards);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getAllLeaderboardById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dataLeaderboard = await Leaderboard.findByPk(id,
        {
          include: [
            {
              model: User,
              attributes: { exclude: ['password'] }
            },
            {
              model: Event
            },
          ]
        });
      if (!dataLeaderboard) throw ({ name: "Data not found!" })
      res.status(200).json(dataLeaderboard);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static postLeaderboard = async (req, res, next) => {
    try {
      const { eventId } = req.params;
      const { UserId, position } = req.body;
      //!admin post leaderboard by event id
      //!data position and user on body

      if (!UserId) throw ({ name: "UserId is required!" })
      const dataLeaderboard = await Leaderboard.create({
        EventId: eventId,
        UserId,
        position
      });
      res.status(200).json({ message: `success post user with id: ${dataLeaderboard.UserId} to leaderboard` });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static deleteLeaderboard = async (req, res, next) => {
    try {
      const { id } = req.params;
      const leaderboard = await Leaderboard.findByPk(id);
      console.log(leaderboard);
      if (!leaderboard) throw ({ name: "Data not found!" })

      await Leaderboard.destroy({
        where: { id }
      });
      res.status(200).json({ message: "leaderboard successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};