const express = require('express');
const router = express.Router();
const userRouter = require('./users');
const adminRouter = require('./admin');
const categoryRouter = require('./category');
const imagesRouter = require('./images');
const eventRouter = require('./event');

router
  .use(userRouter)
  .use(adminRouter)
  .use(categoryRouter)
  .use(imagesRouter)
  .use(eventRouter);

module.exports = router



