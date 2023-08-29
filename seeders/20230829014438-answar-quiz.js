'use strict';

const data = require("../data/answerQuiz.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("AnswerQuizzes", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("AnswerQuizzes", null, {});
  }
};
