const imagekit = require("../config/imagekit");
const {
  User,
  Event,
  Admin,
  Category,
  User_Event,
  sequelize,
  Checkpoint,
} = require("../models");

module.exports = class eventController {
  static getAllEvents = async (req, res, next) => {
    try {
      const dataEvents = await Event.findAll({
        include: [
          {
            model: Admin,
            attributes: { exclude: ["password"] },
          },
          {
            model: Category,
          },
        ],
      });
      res.status(200).json(dataEvents);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getEventById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dataEvent = await Event.findByPk(id, {
        include: [
          {
            model: Admin,
            attributes: { exclude: ["password"] },
          },
          {
            model: Category,
          },
        ],
      });
      if (!dataEvent) throw ({ name: "Data not found!" })
      const dataUsers = await User_Event.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      }, { where: { EventId: id } });
      res.status(200).json({ dataEvent, dataUsers });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static postEvent = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const {
        name,
        startDate,
        endDate,
        active,
        description,
        amount,
        address,
        lat,
        long,
        CategoryId,
        checkpoints,
      } = req.body;
      if (!name) throw { name: "name is required!" };
      if (!startDate) throw { name: "startDate is required!" };
      if (!endDate) throw { name: "startDate is required!" };
      if (!active) throw { name: "active status is required!" };
      if (!description) throw { name: "description is required!" };
      if (!amount) throw { name: "amount is required!" };
      if (!address) throw { name: "address is required!" };
      if (!lat) throw { name: "lattitude is required!" };
      if (!long) throw { name: "longtitude is required!" };
      if (!CategoryId) throw { name: "CategoryId is required!" };
      if (!req.file) throw { name: "pictures is required!" };
      if (!checkpoints) throw { name: "Checkpoints is required!" };
      const fileBuffer = Buffer.from(req.file.buffer).toString("base64");

      const { url } = await imagekit.upload({
        file: fileBuffer,
        fileName: new Date().getTime() + "-" + req.file.originalname,
      });

      const dataEvent = await Event.create(
        {
          name,
          startDate,
          endDate,
          active,
          description,
          amount,
          address,
          lat,
          long,
          pics: url,
          CategoryId,
          AdminId: req.user.id,
        },
        { transaction: t }
      );
      const newCheckpointArray = await JSON.parse(checkpoints);
      if (newCheckpointArray.length !== 3) throw { name: "Checkpoints must 3!" };
      const flagEventId = await newCheckpointArray.map((e) => {
        e.EventId = dataEvent.id;
        return e;
      });
      await Checkpoint.bulkCreate(flagEventId, { transaction: t });

      await t.commit();
      res.status(201).json({
        message: `event and checkpoints successfully created`,
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  };

  static editEvent = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        startDate,
        endDate,
        active,
        description,
        amount,
        address,
        lat,
        long,
        pics,
        CategoryId,
      } = req.body;
      if (!name) throw { name: "name is required!" };
      if (!startDate) throw { name: "startDate is required!" };
      if (!endDate) throw { name: "startDate is required!" };
      if (!active) throw { name: "active status is required!" };
      if (!description) throw { name: "description is required!" };
      if (!amount) throw { name: "amount is required!" };
      if (!address) throw { name: "address is required!" };
      if (!lat) throw { name: "lattitude is required!" };
      if (!long) throw { name: "longtitude is required!" };
      if (!CategoryId) throw { name: "CategoryId is required!" };
      if (!pics) throw { name: "pictures is required!" };
      await Event.update(
        {
          name,
          startDate,
          endDate,
          active,
          description,
          amount,
          address,
          lat,
          long,
          pics,
          CategoryId,
          AdminId: req.user.id,
        },
        { where: { id } }
      );
      res.status(201).json({
        message: `event successfully edited`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static deleteEvent = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      await Checkpoint.destroy({
        where: { EventId: id }
      }, { transaction: t });

      await Event.destroy({
        where: { id },
      }, { transaction: t });
      await t.commit();
      res.status(200).json({ message: "event successfully deleted" });
    } catch (error) {
      await t.rollback();
      console.log(error);
      next(error);
    }
  };
};
