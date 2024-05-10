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

    await queryInterface.renameColumn('users', 'is_active', 'status');
    await queryInterface.changeColumn('users', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2, // specify the column after which the new column should be added
    });

    // Returning a Promise to ensure asynchronous behavior
    return Promise.resolve();
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.renameColumn('users', 'status', 'is_active');
    await queryInterface.changeColumn('users', 'is_active', {
      type: Sequelize.BOOLEAN, // Revert back to the original data type
      allowNull: false, // Revert back to the original null constraint
      defaultValue: true, // Specify the column after which the column was added in the 'up' function
    });
    // Returning a Promise to ensure asynchronous behavior
    return Promise.resolve();
  },
};
