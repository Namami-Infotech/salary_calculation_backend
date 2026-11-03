import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Role, RoleType } from './models/Role.model';
import { User } from './models/User.model';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger('DatabaseSeeder');

  constructor(
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(User) private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async onModuleInit() {
    await this.ensureSchemaUpdates();
    await this.seedRolesAndAdmin();
    await this.cleanConstraints();
  }

  async ensureSchemaUpdates() {
    try {
      await this.sequelize.query(`ALTER TABLE payroll_batches ADD COLUMN records JSON NULL;`);
      this.logger.log('✅ Added "records" JSON column to payroll_batches table.');
    } catch (err: any) {
      // Column already exists, safe to ignore
    }
  }

  async cleanConstraints() {
    try {
      await this.sequelize.query(`ALTER TABLE leave_requests DROP FOREIGN KEY leave_requests_ibfk_2;`);
    } catch (e) {}
    try {
      await this.sequelize.query(`ALTER TABLE leave_requests DROP FOREIGN KEY leave_requests_ibfk_3;`);
    } catch (e) {}
  }

  async seedRolesAndAdmin() {
    try {
      this.logger.log('Checking database roles and default admin user...');

      // 1. Ensure ADMIN role
      const adminRoleId = '11111111-1111-1111-1111-111111111111';
      let adminRole = await this.roleModel.findByPk(adminRoleId);
      if (!adminRole) {
        adminRole = await this.roleModel.findOne({ where: { name: RoleType.ADMIN } });
      }
      if (!adminRole) {
        adminRole = await this.roleModel.create({
          id: adminRoleId,
          name: RoleType.ADMIN,
          description: 'Complete administrative, HR, payroll, and management access',
        });
        this.logger.log('✅ ADMIN role created successfully.');
      }

      // 2. Ensure EMPLOYEE role
      const employeeRoleId = '22222222-2222-2222-2222-222222222222';
      let employeeRole = await this.roleModel.findByPk(employeeRoleId);
      if (!employeeRole) {
        employeeRole = await this.roleModel.findOne({ where: { name: RoleType.EMPLOYEE } });
      }
      if (!employeeRole) {
        await this.roleModel.create({
          id: employeeRoleId,
          name: RoleType.EMPLOYEE,
          description: 'Self-service portal access',
        });
        this.logger.log('✅ EMPLOYEE role created successfully.');
      }

      // 3. Ensure Default Admin User
      const email = 'admin@hrms.com';
      const plainPassword = '123456';
      const adminUserId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const companyId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

      let adminUser = await this.userModel.findOne({ where: { email } });
      if (!adminUser) {
        const passwordHash = await bcrypt.hash(plainPassword, 12);
        await this.userModel.create({
          id: adminUserId,
          companyId,
          email,
          passwordHash,
          roleId: adminRole.id,
          isActive: true,
        });
        this.logger.log(`✅ Default Admin User auto-created: ${email} (Password: ${plainPassword})`);
      } else {
        if (!adminUser.isActive || adminUser.roleId !== adminRole.id) {
          await adminUser.update({
            isActive: true,
            roleId: adminRole.id,
          });
          this.logger.log(`✅ Admin user verified & updated: ${email}`);
        } else {
          this.logger.log(`ℹ️ Default Admin User already exists & active: ${email}`);
        }
      }
    } catch (err) {
      this.logger.error('Failed to auto-seed database:', err);
    }
  }
}
