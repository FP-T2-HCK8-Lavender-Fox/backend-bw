'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnswerQuiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AnswerQuiz.belongsTo(models.User, { foreignKey: 'UserId' });
      AnswerQuiz.belongsTo(models.Checkpoint, { foreignKey: 'CheckpointId' });
    }
  }
  AnswerQuiz.init({
    trueOrFalse: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    CheckpointId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AnswerQuiz',
  });
  return AnswerQuiz;
};