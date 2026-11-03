'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Drop foreign key leave_requests_ibfk_2 if present
    try {
      await queryInterface.removeConstraint('leave_requests', 'leave_requests_ibfk_2');
    } catch (e) {
      try {
        await queryInterface.sequelize.query(`ALTER TABLE leave_requests DROP FOREIGN KEY leave_requests_ibfk_2;`);
      } catch (err) {}
    }

    // 2. Drop foreign key leave_requests_ibfk_3 (actioned_by -> employees.id) so admins from users table can approve/reject
    try {
      await queryInterface.removeConstraint('leave_requests', 'leave_requests_ibfk_3');
    } catch (e) {
      try {
        await queryInterface.sequelize.query(`ALTER TABLE leave_requests DROP FOREIGN KEY leave_requests_ibfk_3;`);
      } catch (err) {}
    }

    // 3. Make leave_type_id nullable
    try {
      await queryInterface.sequelize.query(`ALTER TABLE leave_requests MODIFY COLUMN leave_type_id CHAR(36) NULL;`);
    } catch (e) {}

    // 4. Make actioned_by nullable CHAR(36)
    try {
      await queryInterface.sequelize.query(`ALTER TABLE leave_requests MODIFY COLUMN actioned_by CHAR(36) NULL;`);
    } catch (e) {}

    // 5. Add leave_type VARCHAR(100) column if it doesn't exist
    try {
      const tableInfo = await queryInterface.describeTable('leave_requests');
      if (!tableInfo.leave_type) {
        await queryInterface.addColumn('leave_requests', 'leave_type', {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: 'Casual Leave',
        });
      }
    } catch (e) {
      try {
        await queryInterface.sequelize.query(`
          ALTER TABLE leave_requests 
          ADD COLUMN leave_type VARCHAR(100) NOT NULL DEFAULT 'Casual Leave' AFTER employee_id;
        `);
      } catch (err) {}
    }

    // 6. Seed leave_types if empty
    try {
      const [rows] = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM leave_types;`);
      const count = rows[0]?.count || 0;
      if (count === 0) {
        const companyId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
        const now = new Date();
        await queryInterface.bulkInsert('leave_types', [
          {
            id: '33333333-3333-3333-3333-333333333331',
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
            id: '33333333-3333-3333-3333-333333333332',
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
            id: '33333333-3333-3333-3333-333333333333',
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
            id: '33333333-3333-3333-3333-333333333334',
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
      }
    } catch (e) {}
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('leave_requests', 'leave_type');
    } catch (e) {}
  },
};

