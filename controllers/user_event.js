const {
  Leaderboard,
  User_Event,
  User,
  Event,
  Category,
  Admin,
  Checkpoint,
  AnswerQuiz,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const event = require("../routers/event");

module.exports = class userEventController {
  static getAllEvents = async (req, res, next) => {
    try {
      const dataEvents = await User_Event.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
          {
            model: Event,
            include: [
              {
                model: Category,
              },
              {
                model: Admin,
                attributes: { exclude: ["password"] },
              },
            ],
          },
        ],
      });
      res.status(200).json(dataEvents);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getUserEventById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dataEvent = await User_Event.findByPk(id, {
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
          {
            model: Event,
            include: [
              {
                model: Category,
              },
              {
                model: Checkpoint, //! Tambahan !
              },
              {
                model: Admin,
                attributes: { exclude: ["password"] },
              },
            ],
          },
        ],
      });

      if (!dataEvent) throw { name: "Data not found!" };

      const dataCheckpoint = await Checkpoint.findAll({
        where: { EventId: id },
      });
      res.status(200).json({ dataEvent, dataCheckpoint });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getUserEventsByCategoryId = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { catId } = req.query;
      const data = await User_Event.findAll({
        where: {
          UserId: id,
        },
        include: [
          {
            model: Event,
            where: {
              CategoryId: catId,
              active: true,
            },
          },
        ],
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  static getUserEventsByUserId = async (req, res, next) => {
    try {
      const { id } = req.user;
      const eventsOfUser = await User_Event.findAll({
        where: {
          UserId: id,
        },
        include: [
          {
            model: Event,
            where: {
              active: true,
            },
          },
        ],
      });
      res.status(200).json(eventsOfUser);
    } catch (error) {
      next(error);
    }
  };

  static getInactiveUserEventsByUserId = async (req, res, next) => {
    try {
      const { id } = req.user;
      const inactiveUserEvents = await User_Event.findAll({
        where: {
          UserId: id,
        },
        include: [
          {
            model: Event,
            where: {
              active: false,
            },
          },
        ],
      });
      res.status(200).json(inactiveUserEvents);
    } catch (error) {
      next(error);
    }
  };

  static addEvent = async (req, res, next) => {
    //!create 3 answer

    const t = await sequelize.transaction();
    try {
      const { event_id } = req.params;

      const checkEvent = await User_Event.findOne(
        {
          where: {
            UserId: req.user.id,
            EventId: event_id,
          },
        },
        { transaction: t }
      );
      if (!checkEvent) {
        const checkpointsData = await Checkpoint.findAll({
          where: { EventId: event_id },
        });
        const answerData = await checkpointsData.map((e) => {
          return {
            UserId: req.user.id,
            CheckpointId: e.id,
          };
        });
        await AnswerQuiz.bulkCreate(answerData, { transaction: t });
        const user_event = await User_Event.create(
          {
            UserId: req.user.id,
            EventId: event_id,
          },
          { transaction: t }
        );

        const data = await Event.findByPk(event_id, { transaction: t });
        const finalAddAmmount = data.amount + 100000;
        await Event.update(
          { amount: finalAddAmmount },
          {
            where: {
              id: event_id,
            },
          },
          { transaction: t }
        );

        await t.commit();
        res.status(201).json({
          message: `event successfully added`,
          user_event
        });
      } else {
        await t.commit();
        res.status(403).json({
          message: `event already added`,
        });
      }
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  };

  static deleteEvent = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user_event = User_Event.findByPk(id);
      // const user_event = User_Event[id]; ganti line user_event diatas dengan line ini untuk testing
      if (user_event) throw { name: "Data not found!" };
      await User_Event.destroy({
        where: { id },
      });
      res.status(200).json({ message: "event successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // static getEventByUSersId = async (req, res, next) => {
  //   try {
  //     const dataEvents = await User_Event.findOne(
  //       {
  //         include: [
  //           {
  //             model: User,
  //             attributes: { exclude: ["password"] },
  //           },
  //           {
  //             model: Event,
  //             include: [
  //               {
  //                 model: Category,
  //               },
  //               {
  //                 model: Admin,
  //                 attributes: { exclude: ["password"] },
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       { where: { UserId: req.user.id } }
  //     );
  //     const checkpointData = await Checkpoint.findAll({
  //       where: { EventId: dataEvents.EventId },
  //     });
  //     const answerQuizData = await AnswerQuiz.findAll({
  //       where: { UserId: req.user.id },
  //     });
  //     res.status(200).json({ dataEvents, checkpointData, answerQuizData });
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //     //check
  //   }
  // };

  static getEventByEventId = async (req, res, next) => {
    try {
      const findAnswerQuiz = async (checkpointIds) => {
        return Promise.all(
          checkpointIds.map(async (checkpointId) => {
            return await AnswerQuiz.findOne({
              where: { UserId: req.user.id, CheckpointId: checkpointId },
            });
          })
        ).then((quizData) => {
          return quizData;
        });
      };
      const { id } = req.params;
      const dataEvents = await User_Event.findOne(
        {
          include: [
            {
              model: User,
              attributes: { exclude: ["password"] },
            },
            {
              model: Event,
              include: [
                {
                  model: Category,
                },
                {
                  model: Admin,
                  attributes: { exclude: ["password"] },
                },
              ],
            },
          ],
        },
        { where: { EventId: id } }
      );

      if (!dataEvents) throw { name: "Data not found!" };

      const checkpointData = await Checkpoint.findAll({
        where: { EventId: dataEvents.EventId },
      });
      const checkpointIds = checkpointData.map((el) => el.id);
      const answerQuizData = await findAnswerQuiz(checkpointIds);
      const leaderboard = await Leaderboard.findOne({ where: { EventId: id } });
      res
        .status(200)
        .json({ dataEvents, checkpointData, answerQuizData, leaderboard });
    } catch (error) {
      console.log(error);
      next(error);
      //check
    }
  };
};
