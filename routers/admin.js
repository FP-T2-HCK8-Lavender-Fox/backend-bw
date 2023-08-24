const express = require('express');
const admin = express.Router();
const adminController = require('../controllers/adminController');

admin
  .get('/admin', adminController.getAllAdmin)
  .post('/admin/register', adminController.register)
  .post('/admin/login', adminController.login);




module.exports = admin;