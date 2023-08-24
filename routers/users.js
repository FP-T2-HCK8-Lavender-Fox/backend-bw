const express = require('express');
const user = express.Router();
const usersController = require('../controllers/usersController');

user
  .get('/users', usersController.getAllUsers)
  .get('/users/:id', usersController.getUserById)
  .post('/users/register', usersController.registerUser)
  .post('/users/login', usersController.loginUser)
  .delete('/users/:id', usersController.deleteUser)
  .put('/users/:id', usersController.updateUser);





module.exports = user;