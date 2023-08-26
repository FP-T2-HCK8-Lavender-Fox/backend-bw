'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/helper');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin.hasMany(models.Event, { foreignKey: 'AdminId' });

    }
  }
  Admin.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "username is required!"
        },
        notEmpty: {
          msg: "username is required!"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "name is required!"
        },
        notEmpty: {
          msg: "name is required!"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "email is required!"
        },
        notEmpty: {
          msg: "email is required!"
        },
        isEmail: {
          msg: "Invalid email format!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "password is required!"
        },
        notEmpty: {
          msg: "password is required!"
        },
        len: {
          args: [7, Infinity],
          msg: 'minimum password length is 7!'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Admin',
  });

  Admin.addHook('beforeCreate', (i) => {
    i.password = hashPassword(i.password);
  });
  return Admin;
};