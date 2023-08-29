'use strict';

const data = require("../data/leaderboards.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Leaderboards", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Leaderboards", null, {});
  }
};
