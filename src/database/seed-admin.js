'use strict';
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || 'rootpassword';
  const database = process.env.DB_NAME || 'hrms_db';

  console.log(`Connecting to database ${database} at ${host}:${port}...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
    });

    console.log('Connected to MySQL successfully.');

    // 1. Ensure ADMIN role
    const adminRoleId = '11111111-1111-1111-1111-111111111111';
    await connection.execute(`
      INSERT INTO roles (id, name, description, created_at, updated_at)
      VALUES (?, 'ADMIN', 'Complete administrative, HR, payroll, and management access', NOW(), NOW())
      ON DUPLICATE KEY UPDATE name = 'ADMIN', updated_at = NOW()
    `, [adminRoleId]);

    // 2. Ensure EMPLOYEE role
    const employeeRoleId = '22222222-2222-2222-2222-222222222222';
    await connection.execute(`
      INSERT INTO roles (id, name, description, created_at, updated_at)
      VALUES (?, 'EMPLOYEE', 'Self-service portal access', NOW(), NOW())
      ON DUPLICATE KEY UPDATE name = 'EMPLOYEE', updated_at = NOW()
    `, [employeeRoleId]);

    // 3. Hash password '123456'
    const email = 'admin@hrms.com';
    const plainPassword = '123456';
    const passwordHash = await bcrypt.hash(plainPassword, 12);
    const adminUserId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const companyId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

    // 4. Insert or update admin user
    await connection.execute(`
      INSERT INTO users (id, company_id, email, password_hash, role_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role_id = VALUES(role_id), is_active = 1, updated_at = NOW()
    `, [adminUserId, companyId, email, passwordHash, adminRoleId]);

    console.log(`\n========================================`);
    console.log(` SUCCESS: Default Admin User Synced!`);
    console.log(` Email:    ${email}`);
    console.log(` Password: ${plainPassword}`);
    console.log(` Role:     ADMIN`);
    console.log(`========================================\n`);

    await connection.end();
  } catch (err) {
    console.error('Error seeding admin user details:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
    });
  }
}

seedAdmin();

