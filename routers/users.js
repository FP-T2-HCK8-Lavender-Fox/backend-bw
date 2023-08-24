const express = require('express');
const user = express.Router();
const usersController = require('../controllers/usersController');
const usersAuth = require('../middlewares/usersAuth');
const adminAuth = require('../middlewares/adminAuth');


user
  .post('/users/register', usersController.registerUser)
  .post('/users/login', usersController.loginUser)
  .post('/users/event/:id', usersAuth, usersController.addEvent)
  .get('/users', adminAuth, usersController.getAllUsers)
  .get('/users/:id', adminAuth, usersController.getUserById)
  .delete('/users/:id', adminAuth, usersController.deleteUser)
  .put('/users/:id', adminAuth, usersController.updateUser);





module.exports = user;