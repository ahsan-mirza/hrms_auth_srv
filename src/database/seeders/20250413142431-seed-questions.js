'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Dynamically import nanoid
    const { nanoid } = await import('nanoid'); // Use dynamic import

    const now = new Date();
    const saltRounds = 10;

    // 1. Insert Roles
    const roles = [
      { name: 'Admin', created_at: now, updated_at: now },
      { name: 'SuperAdmin', created_at: now, updated_at: now },
      { name: 'Employee', created_at: now, updated_at: now },
    ];

    await queryInterface.bulkInsert('roles', roles, {});

    // Fetch inserted role IDs (you can also hardcode if IDs are predictable)
    const [insertedRoles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM role`
    );

    const superAdminRole = insertedRoles.find((role) => role.name === 'SuperAdmin');

    // 2. Insert Users
    const superAdminPassword = await bcrypt.hash('SuperSecure123!', saltRounds);
    const superAdminUser = {
      firstName: 'Ahsan',
      lastName: 'Mirza',
      userName: 'super.ahsan',
      email: 'ahsan.khalil047@gmail.com',
      password: 'Test@123',
      phone: '1234567890',
      city: 'Lahore',
      country: 'Pakistan',
      designation: 'CTO',
      kyc_profile_url: 'https://example.com/kyc/superadmin',
      referralCode: nanoid(10), // Generating referral code
      dateOfBirth: new Date('1985-01-01'),
      status: 'active',
      created_at: now,
      updated_at: now,
    };

    await queryInterface.bulkInsert('users', [superAdminUser], {});

    // Get inserted user's ID
    const [insertedUsers] = await queryInterface.sequelize.query(
      `SELECT id, email FROM user WHERE email = 'ahsan.khalil047@gmail.com'`
    );

    const superAdminUserId = insertedUsers[0]?.id;

    // 3. Assign Role to User via UserRoles table
    if (superAdminUserId && superAdminRole?.id) {
      await queryInterface.bulkInsert('user_roles', [
        {
          user_id: superAdminUserId,
          role_id: superAdminRole.id,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('users', { email: 'ahsan.khalil047@gmail.com' });
    await queryInterface.bulkDelete('roles', {
      name: ['Admin', 'SuperAdmin', 'Employee'],
    });
  },
};
