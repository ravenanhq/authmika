'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'two_factor_secret', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'is_two_factor_enabled', // specify the column after which the new column should be added
    });

    // Returning a Promise to ensure asynchronous behavior
    return Promise.resolve();
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'two_factor_secret');

    // Returning a Promise to ensure asynchronous behavior
    return Promise.resolve();
  },
};
