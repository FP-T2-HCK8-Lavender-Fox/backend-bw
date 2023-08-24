const express = require('express');
const admin = express.Router();
const adminController = require('../controllers/adminController');

admin
  .get('/admin', adminController.getAllAdmin)
  .get('/admin/:id', adminController.getAdminById)
  .post('/admin/register', adminController.registerAdmin)
  .post('/admin/login', adminController.loginAdmin)
  .delete('/admin/:id', adminController.deleteAdmin)
  .put('/admin/:id', adminController.updateAdmin);




module.exports = admin;