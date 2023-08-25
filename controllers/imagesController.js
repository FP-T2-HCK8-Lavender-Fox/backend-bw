const { Image, Event } = require("../models");

module.exports = class imageController {
  static getAllImage = async (req, res, next) => {
    try {
      const images = await Image.findAll({
        include: [
          {
            model: Event,
          },
        ]
      });
      res.status(200).json(images);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getByImageId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const image = await Image.findByPk(id, {
        include: [
          {
            model: Event,
          },
        ]
      });
      res.status(200).json(image);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static postImage = async (req, res, next) => {
    try {
      const { event_id } = req.params;
      const { imageUrl } = req.body;
      if (!imageUrl) throw { name: "imageUrl is required!" };
      await Image.create({
        imageUrl,
        EventId: event_id
      });

      res.status(201).json({
        message: `images successfully posted`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static deleteImage = async (req, res, next) => {
    try {
      const { id } = req.params;
      await Image.destroy({
        where: { id }
      });
      res.status(200).json({ message: "image successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };


};