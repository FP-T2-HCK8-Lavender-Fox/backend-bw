const { verifPassword, signToken } = require("../helpers/helper");
const { Admin } = require("../models");

module.exports = class adminController {
  static getAllAdmin = async (req, res, next) => {
    try {
      const dataAdmins = await Admin.findAll();
      res.status(200).json(dataAdmins);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getAdminById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dataAdmin = await Admin.findByPk(id);
      res.status(200).json(dataAdmin);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static registerAdmin = async (req, res, next) => {
    try {
      const {
        username, name, email, password
      } = req.body;
      if (!username) throw { name: "username is required!" };
      if (!name) throw { name: "name is required!" };
      if (!email) throw { name: "email is required!" };
      if (!password) throw { name: "password is required!" };
      const dataAdmin = await Admin.create({
        username, name, email, password
      });
      res.status(201).json({
        message: `${dataAdmin.username} successfully registered`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static loginAdmin = async (req, res, next) => {
    try {
      const { username, password, } = req.body;
      if (!password) throw { name: "password is required!" };
      if (!username) throw { name: "username is required!" };

      const checkAdmin = await Admin.findOne({
        where: { username }
      });
      if (!checkAdmin) throw { name: "invalid username/password" };
      const checkPassword = verifPassword(password, checkAdmin.password);
      if (!checkPassword) throw { name: "invalid username/password" };
      const access_token = signToken({
        id: checkAdmin.id,
        username: checkAdmin.username,
        email: checkAdmin.email
      });
      res.status(200).json({ access_token });

    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static deleteAdmin = async (req, res, next) => {
    try {
      const { id } = req.params;
      await Admin.destroy({
        where: { id }
      });
      res.status(200).json({ message: "admin successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static updateAdmin = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        username, name, email
      } = req.body;
      if (!username) throw { name: "username is required!" };
      if (!name) throw { name: "name is required!" };
      if (!email) throw { name: "email is required!" };
      await Admin.update({
        username, name, email
      }, { where: { id } });

      res.status(201).json({
        message: `admin data successfully edited`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};