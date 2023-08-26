const { verifPassword, signToken } = require("../helpers/helper");
const { User, User_Event } = require("../models");

module.exports = class usersController {
  static getAllUsers = async (req, res, next) => {
    try {
      const dataUsers = await User.findAll();
      res.status(200).json(dataUsers);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dataUser = await User.findByPk(id);
      res.status(200).json(dataUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static registerUser = async (req, res, next) => {
    try {
      const {
        name, gender, email, password,
      } = req.body;
      if (!name) throw { name: "name is required!" };
      if (!gender) throw { name: "gender is required!" };
      if (!email) throw { name: "email is required!" };
      if (!password) throw { name: "password is required!" };
      const dataUsers = await User.create({
        name, gender, email, password,
      });
      res.status(201).json({
        message: `${dataUsers.email} successfully registered`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static loginUser = async (req, res, next) => {
    try {
      const { email, password, } = req.body;
      if (!email) throw { name: "email is required!" };
      if (!password) throw { name: "password is required!" };
      const checkUser = await User.findOne({
        where: { email }
      });
      if (!checkUser) throw { name: "invalid email/password" };
      const checkPassword = verifPassword(password, checkUser.password);
      if (!checkPassword) throw { name: "invalid email/password" };
      const access_token = signToken({
        id: checkUser.id,
        email: checkUser.email
      });
      res.status(200).json({ access_token, name: checkUser.name });

    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      await User.destroy({
        where: { id }
      });
      res.status(200).json({ message: "users successfully deleted" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name, gender, birthDate, email, phoneNumber, address, ktpId
      } = req.body;
      if (!name) throw { name: "name is required!" };
      if (!gender) throw { name: "gender is required!" };
      if (!birthDate) throw { name: "birthdate is required!" };
      if (!email) throw { name: "email is required!" };
      if (!phoneNumber) throw { name: "phone number is required!" };
      if (!address) throw { name: "address is required!" };
      if (!ktpId) throw { name: "ktp id is required!" };
      await User.update({
        name, gender, birthDate, email, phoneNumber, address, ktpId
      }, { where: { id } });

      res.status(201).json({
        message: `user data successfully edited`
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};