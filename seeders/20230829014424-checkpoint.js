'use strict';

const data = require("../data/checkpoints.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Checkpoints", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Checkpoints", null, {});
  }
};
