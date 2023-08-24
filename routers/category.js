const express = require('express');
const categoryController = require('../controllers/categoryController');
const category = express.Router();

category
  .get('/categories', categoryController.getAllCategory)
  .get('/categories/:id', categoryController.getCategoryById)
  .post('/categories/', categoryController.postCategory)
  .delete('/categories/:id', categoryController.deleteCategory)
  .put('/categories/:id', categoryController.updateCategory);





module.exports = category;