const express = require('express');
const router = express.Router();
const userRouter = require('./users');
const adminRouter = require('./admin');
const categoryRouter = require('./category');
const imagesRouter = require('./images');
const eventRouter = require('./event');
const leaderboardRouter = require('./leaderboard');
const userEventRouter = require('./user_event');

router
  .use(userRouter)
  .use(adminRouter)
  .use(categoryRouter)
  .use(imagesRouter)
  .use(eventRouter)
  .use(leaderboardRouter)
  .use(userEventRouter);

module.exports = router



