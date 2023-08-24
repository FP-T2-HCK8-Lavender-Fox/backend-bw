const express = require('express');
const imageController = require('../controllers/imagesController');
const images = express.Router();

images
  .get('/images', imageController.getAllImage)
  .get('/images/:id', imageController.getByImageId)
  .post('/images', imageController.postImage)
  .delete('/images/:id', imageController.deleteImage);

module.exports = images;