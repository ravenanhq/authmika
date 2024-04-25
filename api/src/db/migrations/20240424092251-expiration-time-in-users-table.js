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
    await queryInterface.addColumn('users', 'otp_expiration', {
      type: Sequelize.BIGINT,
      allowNull: true,
      after: 'otp', // specify the column after which the new column should be added
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
    await queryInterface.removeColumn('users', 'otp_expiration');

    // Returning a Promise to ensure asynchronous behavior
    return Promise.resolve();
  },
};
