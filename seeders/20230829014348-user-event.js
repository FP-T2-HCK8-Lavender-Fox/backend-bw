'use strict';

const data = require("../data/user-event.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("User_Events", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User_Events", null, {});
  }
};
