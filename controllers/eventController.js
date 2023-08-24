const { Event } = require("../models");

module.exports = class eventController {
  static getAllEvents = async (req, res, next) => {
    try {
      const dataEvents = await Event.findAll();
      res.status(200).json(dataEvents);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getEventById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dataEvent = await Event.findByPk(id);
      res.status(200).json(dataEvent);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static postEvent = async (req, res, next) => {
    try {
      const {
        name, startDate, endDate, active, description, amount, address, lat,
        long, pics, CategoryId
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
      await Event.create({
        name, startDate, endDate, active, description, amount, address, lat,
        long, pics, CategoryId, AdminId: req.user.id
      });
      res.status(201).json({
        message: `event successfully created`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static editEvent = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name, startDate, endDate, active, description, amount, address, lat,
        long, pics, CategoryId
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
      await Event.update({
        name, startDate, endDate, active, description, amount, address, lat,
        long, pics, CategoryId, AdminId: req.user.id
      }, { where: { id } });
      res.status(201).json({
        message: `event successfully edited`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static deleteEvent = async (req, res, next) => {
    try {
      const { id } = req.params;
      await Event.destroy({
        where: { id }
      });
      res.status(200).json({ message: "event successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

};