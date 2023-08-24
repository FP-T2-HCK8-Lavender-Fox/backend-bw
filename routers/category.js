const express = require('express');
const categoryController = require('../controllers/categoryController');
const category = express.Router();
const adminAuth = require("../middlewares/adminAuth");

category
  .get('/categories', adminAuth, categoryController.getAllCategory)
  .get('/categories/:id', adminAuth, categoryController.getCategoryById)
  .post('/categories/', adminAuth, categoryController.postCategory)
  .delete('/categories/:id', adminAuth, categoryController.deleteCategory)
  .put('/categories/:id', adminAuth, categoryController.updateCategory);





module.exports = category;