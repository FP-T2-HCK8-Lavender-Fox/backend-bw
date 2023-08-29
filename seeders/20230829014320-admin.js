'use strict';

const data = require("../data/admins.json");
const { hashPassword } = require("../helpers/helper");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    data.forEach((el) => {
      el.password = hashPassword(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Admins", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", null, {});
  }
};
