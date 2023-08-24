const express = require('express');
const user = express.Router();
const usersController = require('../controllers/usersController');

user
  .get('/users', usersController.getAllUsers)
  .post('/users/register', usersController.register)
  .post('/users/login', usersController.login);




module.exports = user;