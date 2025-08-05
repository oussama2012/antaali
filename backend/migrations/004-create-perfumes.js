'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Perfumes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      size30ml: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      size50ml: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      size100ml: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      price30ml: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      price50ml: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      price100ml: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Perfumes', ['name']);
    await queryInterface.addIndex('Perfumes', ['brand']);
    await queryInterface.addIndex('Perfumes', ['isActive']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Perfumes');
  }
};
