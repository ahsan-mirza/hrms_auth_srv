// filepath: /Users/codepadding/Desktop/ai-farm/user-module/src/database/migrations/20250412120317-username-update.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Backfill usernames for existing users
    await queryInterface.sequelize.query(`
      UPDATE "users"
      SET "username" = LOWER(CONCAT("firstName", "lastName", FLOOR(RANDOM() * 9000 + 1000)::int, '', LEFT(MD5(RANDOM()::text), 6)))
      WHERE "username" IS NULL;
    `);

    // Set column as NOT NULL + UNIQUE
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert usernames to NULL
    await queryInterface.sequelize.query(`UPDATE users SET username = NULL`);
  }
};