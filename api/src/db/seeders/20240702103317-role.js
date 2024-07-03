'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'ADMIN',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'MANAGER',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'STAFF',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'roles',
      {
        name: {
          [Sequelize.Op.in]: ['ADMIN', 'MANAGER', 'STAFF'],
        },
      },
      {},
    );
  },
};
