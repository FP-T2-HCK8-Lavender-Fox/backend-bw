const express = require('express');
const admin = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require("../middlewares/adminAuth");


admin
  .get('/admin', adminAuth, adminController.getAllAdmin)
  .get('/admin/:id', adminAuth, adminController.getAdminById)
  .post('/admin/register', adminAuth, adminController.registerAdmin)
  .post('/admin/login', adminAuth, adminController.loginAdmin)
  .delete('/admin/:id', adminAuth, adminController.deleteAdmin)
  .put('/admin/:id', adminAuth, adminController.updateAdmin);




module.exports = admin;