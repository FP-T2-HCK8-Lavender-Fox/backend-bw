const express = require('express');
const checkpointController = require('../controllers/checkpointController');
const usersAuth = require('../middlewares/usersAuth');
const checkpoint = express.Router();

checkpoint
  .get('/checkpoints', checkpointController.getAllCheckpoint)
  .get('/checkpoints/:eventId', checkpointController.getAllCheckpointByEventId)
  .post('/answers/:CheckpointId', usersAuth, checkpointController.answerCheckpoint);

module.exports = checkpoint;