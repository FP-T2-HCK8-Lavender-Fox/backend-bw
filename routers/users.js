const express = require('express');
const user = express.Router();
const usersController = require('../controllers/usersController');

user
  .get('/users', usersController.getAllUsers)
  .get('/users/:id', usersController.getUsersById)
  .post('/users/register', usersController.register)
  .post('/users/login', usersController.login)
  .delete('/users/:id', usersController.delete)
  .put('/users/:id', usersController.update);





module.exports = user;