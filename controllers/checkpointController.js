const { Checkpoint, sequelize, AnswerQuiz } = require("../models");
const QRCode = require('qrcode');

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
          EventId: eventId
        }
      });
      if (dataCategory.length === 0) throw ({ name: "Data not found!" })
      res.status(200).json(dataCategory);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static answerCheckpoint = async (req, res, next) => {
    try {
      const { CheckpointId } = req.params;
      const { answer } = req.body;
      if (!CheckpointId) throw ({ name: "CheckpointId is required!" })
      await AnswerQuiz.create({
        trueOrFalse: answer,
        CheckpointId,
        UserId: req.user.id
      });

      res.status(201).json({ message: "success post answer data" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};