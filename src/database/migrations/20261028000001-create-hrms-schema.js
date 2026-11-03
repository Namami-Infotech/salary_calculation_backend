'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. roles
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.ENUM('ADMIN', 'EMPLOYEE'), unique: true, allowNull: false },
      description: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 2. users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      email: { type: Sequelize.STRING(120), unique: true, allowNull: false },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'RESTRICT',
      },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 3. refresh_tokens
    await queryInterface.createTable('refresh_tokens', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      token_hash: { type: Sequelize.STRING(500), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      is_revoked: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 4. employees
    await queryInterface.createTable('employees', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      employee_code: { type: Sequelize.STRING(32), allowNull: false },
      first_name: { type: Sequelize.STRING(64), allowNull: false },
      last_name: { type: Sequelize.STRING(64), allowNull: false },
      age: { type: Sequelize.INTEGER, allowNull: true },
      email: { type: Sequelize.STRING(120), allowNull: false },
      phone: { type: Sequelize.STRING(32), allowNull: true },
      photo_url: { type: Sequelize.STRING(255), allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      department: { type: Sequelize.STRING(100), allowNull: true },
      designation: { type: Sequelize.STRING(100), allowNull: true },
      manager_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'employees', key: 'id' },
        onDelete: 'SET NULL',
      },
      employment_type: {
        type: Sequelize.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'),
        defaultValue: 'FULL_TIME',
      },
      joining_date: { type: Sequelize.DATEONLY, allowNull: false },
      probation_period_days: { type: Sequelize.INTEGER, defaultValue: 90 },
      employment_status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
      },
      bank_details: { type: Sequelize.JSON, allowNull: true },
      emergency_contact: { type: Sequelize.JSON, allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('employees', {
      fields: ['employee_code'],
      type: 'unique',
      name: 'unique_employee_code',
    });
    await queryInterface.addConstraint('employees', {
      fields: ['email'],
      type: 'unique',
      name: 'unique_employee_email',
    });

    // 5. salary_structures
    await queryInterface.createTable('salary_structures', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 6. salary_components
    await queryInterface.createTable('salary_components', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      structure_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'salary_structures', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.ENUM('EARNING', 'DEDUCTION'), allowNull: false },
      calculation_type: {
        type: Sequelize.ENUM('FLAT', 'PERCENTAGE_OF_BASIC', 'FORMULA'),
        defaultValue: 'FLAT',
      },
      value: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.0 },
      is_taxable: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 7. employee_salary_assignments
    await queryInterface.createTable('employee_salary_assignments', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onDelete: 'CASCADE',
      },
      structure_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'salary_structures', key: 'id' },
        onDelete: 'RESTRICT',
      },
      base_salary: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      gross_salary: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      net_salary: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      effective_from: { type: Sequelize.DATEONLY, allowNull: false },
      effective_to: { type: Sequelize.DATEONLY, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 8. payroll_batches
    await queryInterface.createTable('payroll_batches', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      year: { type: Sequelize.INTEGER, allowNull: false },
      month: { type: Sequelize.INTEGER, allowNull: false },
      total_gross_pay: { type: Sequelize.DECIMAL(14, 2), defaultValue: 0.0 },
      total_deductions: { type: Sequelize.DECIMAL(14, 2), defaultValue: 0.0 },
      total_net_pay: { type: Sequelize.DECIMAL(14, 2), defaultValue: 0.0 },
      status: {
        type: Sequelize.ENUM('DRAFT', 'PREVIEW', 'APPROVED', 'PROCESSED', 'PAID'),
        defaultValue: 'DRAFT',
      },
      approved_by: { type: Sequelize.UUID, allowNull: true },
      approved_at: { type: Sequelize.DATE, allowNull: true },
      processed_by: { type: Sequelize.UUID, allowNull: true },
      processed_at: { type: Sequelize.DATE, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 9. payroll_records
    await queryInterface.createTable('payroll_records', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      batch_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'payroll_batches', key: 'id' },
        onDelete: 'CASCADE',
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onDelete: 'RESTRICT',
      },
      total_days_in_month: { type: Sequelize.INTEGER, defaultValue: 30 },
      paid_days: { type: Sequelize.FLOAT, defaultValue: 30.0 },
      unpaid_days: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      basic_salary: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.0 },
      gross_earnings: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.0 },
      total_deductions: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.0 },
      net_pay: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.0 },
      payment_status: {
        type: Sequelize.ENUM('PENDING', 'PAID', 'FAILED'),
        defaultValue: 'PENDING',
      },
      payment_method: { type: Sequelize.STRING(64), allowNull: true },
      transaction_reference: { type: Sequelize.STRING(128), allowNull: true },
      paid_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('payroll_records', {
      fields: ['batch_id', 'employee_id'],
      type: 'unique',
      name: 'unique_employee_payroll_per_batch',
    });

    // 10. payroll_line_items
    await queryInterface.createTable('payroll_line_items', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      payroll_record_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'payroll_records', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.ENUM('EARNING', 'DEDUCTION'), allowNull: false },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 11. payslips
    await queryInterface.createTable('payslips', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      payroll_record_id: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        references: { model: 'payroll_records', key: 'id' },
        onDelete: 'CASCADE',
      },
      payslip_number: { type: Sequelize.STRING(64), unique: true, allowNull: false },
      pdf_url: { type: Sequelize.STRING(500), allowNull: true },
      generated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 12. leave_types
    await queryInterface.createTable('leave_types', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      name: { type: Sequelize.STRING(64), allowNull: false },
      code: { type: Sequelize.STRING(16), unique: true, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      default_days_per_year: { type: Sequelize.FLOAT, defaultValue: 12 },
      is_paid: { type: Sequelize.BOOLEAN, defaultValue: true },
      allow_half_day: { type: Sequelize.BOOLEAN, defaultValue: false },
      allow_carry_forward: { type: Sequelize.BOOLEAN, defaultValue: false },
      max_carry_forward_days: { type: Sequelize.FLOAT, defaultValue: 0 },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 13. leave_policies
    await queryInterface.createTable('leave_policies', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      leave_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'leave_types', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING(128), allowNull: false },
      annual_quota: { type: Sequelize.FLOAT, allowNull: false },
      accrual_frequency: {
        type: Sequelize.ENUM('MONTHLY', 'QUARTERLY', 'ANNUAL'),
        defaultValue: 'ANNUAL',
      },
      min_service_days_required: { type: Sequelize.INTEGER, defaultValue: 0 },
      consecutive_days_limit: { type: Sequelize.INTEGER, defaultValue: 3 },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 14. employee_leave_balances
    await queryInterface.createTable('employee_leave_balances', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onDelete: 'CASCADE',
      },
      leave_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'leave_types', key: 'id' },
        onDelete: 'CASCADE',
      },
      year: { type: Sequelize.INTEGER, allowNull: false },
      allocated_days: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      used_days: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      pending_days: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      remaining_days: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('employee_leave_balances', {
      fields: ['employee_id', 'leave_type_id', 'year'],
      type: 'unique',
      name: 'unique_employee_leave_balance_per_year',
    });

    // 15. leave_requests
    await queryInterface.createTable('leave_requests', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onDelete: 'CASCADE',
      },
      leave_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'leave_types', key: 'id' },
        onDelete: 'RESTRICT',
      },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY, allowNull: false },
      total_days: { type: Sequelize.FLOAT, allowNull: false },
      is_half_day: { type: Sequelize.BOOLEAN, defaultValue: false },
      reason: { type: Sequelize.TEXT, allowNull: false },
      attachment_url: { type: Sequelize.STRING(500), allowNull: true },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'),
        defaultValue: 'PENDING',
      },
      actioned_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'employees', key: 'id' },
        onDelete: 'SET NULL',
      },
      action_comments: { type: Sequelize.TEXT, allowNull: true },
      actioned_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 16. leave_balance_transactions
    await queryInterface.createTable('leave_balance_transactions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      balance_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'employee_leave_balances', key: 'id' },
        onDelete: 'CASCADE',
      },
      leave_request_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'leave_requests', key: 'id' },
        onDelete: 'SET NULL',
      },
      transaction_type: {
        type: Sequelize.ENUM('ACCRUAL', 'USAGE', 'CANCELLATION_REVERSAL', 'MANUAL_ADJUSTMENT'),
        allowNull: false,
      },
      days: { type: Sequelize.FLOAT, allowNull: false },
      balance_after: { type: Sequelize.FLOAT, allowNull: false },
      remarks: { type: Sequelize.STRING(255), allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 17. holidays
    await queryInterface.createTable('holidays', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      name: { type: Sequelize.STRING(128), allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      is_optional: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });

    // 18. audit_logs
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      company_id: { type: Sequelize.STRING(64), allowNull: true },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      action: { type: Sequelize.STRING(64), allowNull: false },
      entity_name: { type: Sequelize.STRING(64), allowNull: false },
      entity_id: { type: Sequelize.UUID, allowNull: true },
      old_values: { type: Sequelize.JSON, allowNull: true },
      new_values: { type: Sequelize.JSON, allowNull: true },
      ip_address: { type: Sequelize.STRING(45), allowNull: true },
      user_agent: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  down: async (queryInterface) => {
    // Drop in reverse order
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('holidays');
    await queryInterface.dropTable('leave_balance_transactions');
    await queryInterface.dropTable('leave_requests');
    await queryInterface.dropTable('employee_leave_balances');
    await queryInterface.dropTable('leave_policies');
    await queryInterface.dropTable('leave_types');
    await queryInterface.dropTable('payslips');
    await queryInterface.dropTable('payroll_line_items');
    await queryInterface.dropTable('payroll_records');
    await queryInterface.dropTable('payroll_batches');
    await queryInterface.dropTable('employee_salary_assignments');
    await queryInterface.dropTable('salary_components');
    await queryInterface.dropTable('salary_structures');
    await queryInterface.dropTable('employees');
    await queryInterface.dropTable('refresh_tokens');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
  },
};
