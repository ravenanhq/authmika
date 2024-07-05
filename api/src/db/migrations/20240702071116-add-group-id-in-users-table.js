'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'group_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'role', // Adds the column after the 'role' column
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'group_id'); // Drops the 'group_id' column
  },
};
