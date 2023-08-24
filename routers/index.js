const express = require('express');
const router = express.Router();
const userRouter = require('./users');
const adminRouter = require('./admin');
const categoryRouter = require('./category');
const imagesRouter = require('./images');

router
  .use(userRouter)
  .use(adminRouter)
  .use(categoryRouter)
  .use(imagesRouter);

module.exports = router



