'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add custom_fields column with JSON type
    await queryInterface.addColumn('users', 'custom_fields', {
      type: Sequelize.JSON, // Use JSON if JSONB is not supported
      allowNull: true, // Adjust based on your needs
    });
  },

  async down(queryInterface) {
    // Remove custom_fields column
    await queryInterface.removeColumn('users', 'custom_fields');
  },
};
