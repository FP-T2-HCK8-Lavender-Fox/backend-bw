const express = require('express');
const adminAuth = require('../middlewares/adminAuth');
const leaderboardController = require('../controllers/leaderboardController');
const leaderboard = express.Router();

leaderboard
  .get('/leaderboards', adminAuth, leaderboardController.getAllLeaderboards)
  .get('/leaderboards/:id', adminAuth, leaderboardController.getAllLeaderboardById)
  .post('/leaderboards/:eventId', adminAuth, leaderboardController.postLeaderboard)
  .delete('/leaderboards/:id', adminAuth, leaderboardController.deleteLeaderboard);

module.exports = leaderboard;