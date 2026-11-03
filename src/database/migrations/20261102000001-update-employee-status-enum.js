'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 1. Normalize existing employee records to ACTIVE or INACTIVE
      await queryInterface.sequelize.query(`
        UPDATE employees 
        SET employment_status = CASE 
          WHEN employment_status IN ('RESIGNED', 'TERMINATED', 'SUSPENDED') THEN 'INACTIVE' 
          ELSE 'ACTIVE' 
        END
        WHERE employment_status IS NOT NULL;
      `);
    } catch (e) {
      // Table or column might not exist yet if running migrations from scratch
    }

    try {
      // 2. Alter column to ENUM('ACTIVE', 'INACTIVE') with default 'ACTIVE'
      await queryInterface.sequelize.query(`
        ALTER TABLE employees 
        MODIFY COLUMN employment_status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';
      `);
    } catch (e) {
      // In case dialect doesn't support raw ALTER TABLE MODIFY
      try {
        await queryInterface.changeColumn('employees', 'employment_status', {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          defaultValue: 'ACTIVE',
          allowNull: false,
        });
      } catch (err) {}
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(`
        ALTER TABLE employees 
        MODIFY COLUMN employment_status ENUM('PROBATION', 'CONFIRMED', 'RESIGNED', 'TERMINATED', 'SUSPENDED') NOT NULL DEFAULT 'PROBATION';
      `);
    } catch (e) {
      try {
        await queryInterface.changeColumn('employees', 'employment_status', {
          type: Sequelize.ENUM('PROBATION', 'CONFIRMED', 'RESIGNED', 'TERMINATED', 'SUSPENDED'),
          defaultValue: 'PROBATION',
          allowNull: false,
        });
      } catch (err) {}
    }
  },
};

