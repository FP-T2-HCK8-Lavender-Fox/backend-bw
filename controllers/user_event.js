const {
  User_Event,
  User, Event,
  Category,
  Admin,
  Checkpoint,
  AnswerQuiz,
  sequelize } = require("../models");

module.exports = class userEventController {
  static getAllEvents = async (req, res, next) => {
    try {
      const dataEvents = await User_Event.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          },
          {
            model: Event,
            include: [
              {
                model: Category,
              },
              {
                model: Admin,
                attributes: { exclude: ['password'] }
              }
            ]
          }
        ]
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
            attributes: { exclude: ['password'] }
          },
          {
            model: Event,
            include: [
              {
                model: Category,
              },
              {
                model: Admin,
                attributes: { exclude: ['password'] }
              }
            ]
          }
        ]
      });

      const dataCheckpoint = await Checkpoint.findAll({ where: { EventId: id } });
      res.status(200).json({ dataEvent, dataCheckpoint });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };


  static addEvent = async (req, res, next) => {
    //!create 3 answer

    const t = await sequelize.transaction();
    try {
      const { event_id } = req.params;

      const checkEvent = await User_Event.findOne({
        where: {
          UserId: req.user.id,
          EventId: event_id
        }
      });
      if (!checkEvent) {
        const checkpointsData = await Checkpoint.findAll({ where: { EventId: event_id } });
        const answerData = await checkpointsData.map(e => {
          return {
            UserId: req.user.id,
            CheckpointId: e.id
          };
        });
        await AnswerQuiz.bulkCreate(answerData, { transaction: t });
        await User_Event.create({
          UserId: req.user.id,
          EventId: event_id
        }, { transaction: t });

        const data = await Event.findByPk(event_id, { transaction: t });
        const finalAddAmmount = data.amount + 100000;
        await Event.update({ amount: finalAddAmmount }, {
          where: {
            id: event_id
          },
        }, { transaction: t });

        await t.commit();
        res.status(201).json({
          message: `event successfully added`
        });
      }
      else {
        res.status(403).json({
          message: `event already added`
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
      await User_Event.destroy({
        where: { id }
      });
      res.status(200).json({ message: "event successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };



  static getEventByUSersId = async (req, res, next) => {
    try {
      const dataEvents = await User_Event.findOne({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          },
          {
            model: Event,
            include: [
              {
                model: Category,
              },
              {
                model: Admin,
                attributes: { exclude: ['password'] }
              }
            ]
          }
        ]
      }, { where: { UserId: req.user.id } });
      const checkpointData = await Checkpoint.findAll({
        where: { EventId: dataEvents.EventId }
      });
      const answerQuizData = await AnswerQuiz.findAll({
        where: { UserId: req.user.id }
      });
      res.status(200).json({ dataEvents, checkpointData, answerQuizData });
    } catch (error) {
      console.log(error);
      next(error);
      //check
    }
  };
};