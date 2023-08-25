const express = require('express');
const imageController = require('../controllers/imagesController');
const adminAuth = require('../middlewares/adminAuth');
const usersAuth = require('../middlewares/usersAuth');
const images = express.Router();

images
  .get('/images', imageController.getAllImage)
  .get('/images/:id', imageController.getByImageId)
  .post('/images/:event_id', usersAuth, imageController.postImage)
  .delete('/images/:id', adminAuth, imageController.deleteImage);

module.exports = images;