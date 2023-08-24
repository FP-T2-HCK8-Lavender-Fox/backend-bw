const express = require('express');
const router = express.Router();
const userRouter = require('./users');
const adminRouter = require('./admin');

router
  .use(userRouter)
  .use(adminRouter);

module.exports = router



