'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checkpoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Checkpoint.belongsTo(models.Event, { foreignKey: 'EventId' });
    }
  }
  Checkpoint.init({
    lat: DataTypes.STRING,
    long: DataTypes.STRING,
    question: DataTypes.STRING,
    trueAnswer: DataTypes.STRING,
    wrongAnswerOne: DataTypes.STRING,
    wrongAnswerTwo: DataTypes.STRING,
    name: DataTypes.STRING,
    EventId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Checkpoint',
  });
  return Checkpoint;
};