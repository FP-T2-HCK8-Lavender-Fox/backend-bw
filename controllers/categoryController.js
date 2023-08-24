const { Category } = require("../models");

module.exports = class categoryController {
  static getAllCategory = async (req, res, next) => {
    try {
      const dataUsers = await Category.findAll();
      res.status(200).json(dataUsers);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getCategoryById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dataCategory = await Category.findByPk(id);
      res.status(200).json(dataCategory);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static postCategory = async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) throw { name: "name is required!" };
      const newCategory = await Category.create({ name });
      res.status(201).json({
        message: `${newCategory.name} successfully created`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static deleteCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      await Category.destroy({
        where: { id }
      });
      res.status(200).json({ message: "category successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static updateCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) throw { name: "name is required!" };
      await Category.update({ name }, { where: { id } });
      res.status(201).json({
        message: `category successfully edited`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };


};