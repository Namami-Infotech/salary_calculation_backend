'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const companyId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    const now = new Date();

    // 1. Seed Roles (Only ADMIN and EMPLOYEE)
    const adminRoleId = '11111111-1111-1111-1111-111111111111';
    const employeeRoleId = '22222222-2222-2222-2222-222222222222';

    await queryInterface.bulkInsert('roles', [
      { id: adminRoleId, name: 'ADMIN', description: 'Complete administrative, HR, payroll, and management access', created_at: now, updated_at: now },
      { id: employeeRoleId, name: 'EMPLOYEE', description: 'Self-service portal, profile viewing, payslip downloads, and leave requests', created_at: now, updated_at: now },
    ]);

    // 2. Seed Admin User
    const passwordHash = await bcrypt.hash('123456', 12);
    const adminUserId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    await queryInterface.bulkInsert('users', [
      {
        id: adminUserId,
        company_id: companyId,
        email: 'admin@hrms.com',
        password_hash: passwordHash,
        role_id: adminRoleId,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 3. Seed Standard Leave Types
    await queryInterface.bulkInsert('leave_types', [
      {
        id: uuidv4(),
        company_id: companyId,
        name: 'Casual Leave',
        code: 'CL',
        description: 'For personal affairs or emergency short leave',
        default_days_per_year: 12,
        is_paid: true,
        allow_half_day: true,
        allow_carry_forward: false,
        max_carry_forward_days: 0,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        company_id: companyId,
        name: 'Sick Leave',
        code: 'SL',
        description: 'For medical care and recuperation',
        default_days_per_year: 10,
        is_paid: true,
        allow_half_day: true,
        allow_carry_forward: true,
        max_carry_forward_days: 5,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        company_id: companyId,
        name: 'Earned Leave',
        code: 'EL',
        description: 'Annual vacation privilege leave',
        default_days_per_year: 15,
        is_paid: true,
        allow_half_day: false,
        allow_carry_forward: true,
        max_carry_forward_days: 15,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        company_id: companyId,
        name: 'Leave Without Pay',
        code: 'LWP',
        description: 'Unpaid extended absence',
        default_days_per_year: 365,
        is_paid: false,
        allow_half_day: true,
        allow_carry_forward: false,
        max_carry_forward_days: 0,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('leave_types', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  },
};
