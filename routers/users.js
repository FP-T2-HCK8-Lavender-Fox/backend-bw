const express = require('express');
const user = express.Router();
const usersController = require('../controllers/usersController');
const adminAuth = require('../middlewares/adminAuth');
const usersAuth = require('../middlewares/usersAuth');


user
  .post('/users/register', usersController.registerUser)
  .post('/users/login', usersController.loginUser)
  .get('/users', adminAuth, usersController.getAllUsers)
  .get('/users/:id', usersAuth, usersController.getUserById)
  .delete('/users/detail', adminAuth, usersController.deleteUser)
  .put('/users/:id', usersController.updateUser);





module.exports = user;