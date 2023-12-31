'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leaderboard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Leaderboard.belongsTo(models.User, { foreignKey: 'UserId' });
      Leaderboard.belongsTo(models.Event, { foreignKey: 'EventId' });
    }
  }
  Leaderboard.init({
    EventId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    position: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Leaderboard',
  });
  return Leaderboard;
};