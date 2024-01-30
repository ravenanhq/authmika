'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('client_details', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('client_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      client_secret_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      client_secret_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      redirect_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('client_details');
     */
    return queryInterface.dropTable('client_details');
  },
};
