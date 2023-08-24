const express = require('express');
const admin = express.Router();
const adminController = require('../controllers/adminController');

admin
  .get('/admin', adminController.getAllAdmin)
  .get('/admin/:id', adminController.getAdminById)
  .post('/admin/register', adminController.register)
  .post('/admin/login', adminController.login)
  .delete('/admin/:id', adminController.delete)
  .put('/admin/:id', adminController.update);




module.exports = admin;