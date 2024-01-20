'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

	return queryInterface.createTable('users', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			autoIncrement: true,
			unique: true,
			primaryKey: true,
		},
		user_name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		display_name: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email_verified_at: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		mobile: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		role: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		is_two_factor_enabled: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		two_factor_recovery_codes: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		created_by: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		updated_by: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		email_verification_token: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		is_active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		}
	});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('users');
  }
};
