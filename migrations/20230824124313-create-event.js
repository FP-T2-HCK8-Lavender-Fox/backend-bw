'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lat: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false,
      },
      long: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false,
      },
      pics: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
      },
      AdminId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Admins',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
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
    await queryInterface.dropTable('Events');
  }
};