'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Migration to rename the 'name' column in the 'Roles' table to 'roleName'.
    await queryInterface.renameColumn('role', 'name', 'role');
  },

  down: async (queryInterface) => {
    // Revert the migration by renaming the 'roleName' column back to 'name'.
    await queryInterface.renameColumn('role', 'role', 'name');
  },
};
