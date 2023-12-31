'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Event.belongsTo(models.User, { foreignKey: 'UserId' });
      User_Event.belongsTo(models.Event, { foreignKey: 'EventId' });
    }
  }
  User_Event.init({
    UserId: DataTypes.INTEGER,
    EventId: DataTypes.INTEGER,
    point: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User_Event',
  });
  return User_Event;
};