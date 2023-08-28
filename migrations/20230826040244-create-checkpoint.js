'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Checkpoints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lat: {
        type: Sequelize.DECIMAL(9, 6),
      },
      long: {
        type: Sequelize.DECIMAL(9, 6),
      },
      question: {
        type: Sequelize.STRING
      },
      trueAnswer: {
        type: Sequelize.STRING
      },
      wrongAnswerOne: {
        type: Sequelize.STRING
      },
      wrongAnswerTwo: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      EventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Events',
          key: 'id',
          onDelete: "CASCADE",
          onUpdate: 'CASCADE'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Checkpoints');
  }
};