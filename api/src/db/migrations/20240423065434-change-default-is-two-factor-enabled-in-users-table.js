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
    await queryInterface.changeColumn('users', 'is_two_factor_enabled', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // specify the column after which the new column should be added
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('users', 'is_two_factor_enabled', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // specify the column after which the new column should be added
    });
  },
};
