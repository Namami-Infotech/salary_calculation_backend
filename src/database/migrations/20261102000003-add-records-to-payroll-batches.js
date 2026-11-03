'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableInfo = await queryInterface.describeTable('payroll_batches');
      if (!tableInfo.records) {
        await queryInterface.addColumn('payroll_batches', 'records', {
          type: Sequelize.JSON,
          allowNull: true,
        });
      }
    } catch (err) {
      try {
        await queryInterface.sequelize.query(`ALTER TABLE payroll_batches ADD COLUMN records JSON NULL;`);
      } catch (e) {}
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('payroll_batches', 'records');
    } catch (e) {}
  },
};

