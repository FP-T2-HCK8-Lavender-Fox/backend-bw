'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/helper');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Event, { through: models.User_Event, foreignKey: 'UserId' });
      User.hasMany(models.Leaderboard, { foreignKey: 'UserId' });
      User.hasMany(models.AnswerQuiz, { foreignKey: 'UserId' });
      User.belongsToMany(models.User, {
        through: 'Friendship',
        as: 'Friends',
        foreignKey: 'UserId',
        otherKey: 'FriendId'
      });
    }
  }
  User.init({
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
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "gender is required!"
        },
        notEmpty: {
          msg: "gender is required!"
        }
      }
    },
    birthDate: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notEmpty: {
      //     msg: "birthdate is required!"
      //   },
      //   notEmpty: {
      //     msg: "birthdate is required!"
      //   }
      // }
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
    },
    phoneNumber: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notEmpty: {
      //     msg: "phone number is required!"
      //   },
      //   notEmpty: {
      //     msg: "phone number is required!"
      //   }
      // }
    },
    address: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notEmpty: {
      //     msg: "address is required!"
      //   },
      //   notEmpty: {
      //     msg: "address is required!"
      //   }
      // }
    },
    ktpId: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notEmpty: {
      //     msg: "ktp id is required!"
      //   },
      //   notEmpty: {
      //     msg: "ktp id is required!"
      //   }
      // }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeCreate', (i) => {
    i.password = hashPassword(i.password);
  });

  return User;
};