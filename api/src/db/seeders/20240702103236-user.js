'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'admin',
          last_name: 'admin',
          email: 'admin@gmail.com',
          password:
            '$2b$10$cmXePjsZqO97VpT09L.z8.tgLUypMvErvFVxRvYgnQkNSutI10p3a',
          mobile: '1234567890',
          role: 'ADMIN',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@gmail.com' }, {});
  },
};
