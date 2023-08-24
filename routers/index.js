const express = require('express');
const router = express.Router();
const userRouter = require('./users');
const adminRouter = require('./admin');
const categoryRouter = require('./category');

router
  .use(userRouter)
  .use(adminRouter)
  .use(categoryRouter);

module.exports = router



