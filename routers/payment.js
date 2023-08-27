const express = require('express');
const paymentController = require('../controllers/payment');
const usersAuth = require('../middlewares/usersAuth');
const payment = express.Router();

payment
  .post('/payment-token', usersAuth, paymentController.generateToken)
  .patch('/amount/:id', usersAuth, paymentController.addAmmountEvent);

module.exports = payment;