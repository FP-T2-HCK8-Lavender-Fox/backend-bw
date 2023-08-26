'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Admin, { foreignKey: 'AdminId' });
      Event.belongsTo(models.Category, { foreignKey: 'CategoryId' });
      Event.belongsToMany(models.User, { through: models.User_Event, foreignKey: 'EventId' });
      Event.hasMany(models.Leaderboard, { foreignKey: 'EventId' });
      Event.hasMany(models.Checkpoint, { foreignKey: 'EventId' });
    }
  }
  Event.init({
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    amount: DataTypes.INTEGER,
    address: DataTypes.STRING,
    lat: DataTypes.STRING,
    long: DataTypes.STRING,
    pics: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    AdminId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};