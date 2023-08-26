const express = require('express');
const admin = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require("../middlewares/adminAuth");


admin
  .post('/admin/register', adminController.registerAdmin)
  .post('/admin/login', adminController.loginAdmin)
  .get('/admin', adminAuth, adminController.getAllAdmin)
  .get('/admin/:id', adminAuth, adminController.getAdminById)
  .delete('/admin/:id', adminAuth, adminController.deleteAdmin)
  .put('/admin/:id', adminAuth, adminController.updateAdmin);




module.exports = admin;