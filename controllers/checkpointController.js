const {
  Checkpoint,
  sequelize,
  AnswerQuiz,
  User_Event,
  Event,
} = require("../models");

module.exports = class checkpointController {
  static getAllCheckpoint = async (req, res, next) => {
    try {
      const checkpoints = await Checkpoint.findAll();
      res.status(200).json(checkpoints);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getAllCheckpointByEventId = async (req, res, next) => {
    try {
      const { eventId } = req.params;
      const dataCategory = await Checkpoint.findAll({
        where: {
          EventId: eventId,
        },
      });
      res.status(200).json(dataCategory);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static answerCheckpoint = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { CheckpointId } = req.params;
      const { answer } = req.body;
      const question = await Checkpoint.findByPk(CheckpointId, {
        include: {
          model: Event,
        },
      });
      let eventStartDate = new Date(question.Event.startDate);
      const timeStartDate = new Date(question.Event.startDate).getTime();
      const userEvent = await User_Event.findOne({
        where: {
          EventId: question.EventId,
          UserId: req.user.id,
        },
      });
      if (question.trueAnswer === answer) {
        await AnswerQuiz.update(
          {
            trueOrFalse: true,
          },
          {
            where: {
              CheckpointId: CheckpointId,
              UserId: req.user.id,
            },
            transaction: t,
          }
        );

        const midnightDate = eventStartDate.setUTCHours(0, 0, 0, 0);
        const eventStart = timeStartDate - midnightDate;
        const now = new Date().getTime() - midnightDate;

        const point = Math.floor((eventStart / now) * 1000000);

        await userEvent.update({
          point: null ? point : this.point + point,
        });

        await userEvent.save({ transaction: t });

        await t.commit();
        return res.status(200).json(`User answer is true`);
      } else {
        await AnswerQuiz.update(
          {
            trueOrFalse: false,
          },
          {
            where: {
              CheckpointId: CheckpointId,
              UserId: req.user.id,
            },
            transaction: t,
          }
        );

        await t.commit();
        return res.status(200).json(`User answer is false`);
      }
    } catch (error) {
      await t.rollback();
      next(error);
    }
  };
};
