'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('websites', { id: Sequelize.INTEGER });
     */

    return queryInterface.createTable('websites', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      application: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      base_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      client_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_secret_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('websites');
     */
    return queryInterface.dropTable('websites');
  },
};
