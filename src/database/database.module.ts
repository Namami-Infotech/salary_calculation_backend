import { Module, OnModuleInit } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Role } from './models/Role.model';
import { User } from './models/User.model';
import { RefreshToken } from './models/RefreshToken.model';
import { Employee } from './models/Employee.model';
import { SalaryStructure } from './models/SalaryStructure.model';
import { SalaryComponent } from './models/SalaryComponent.model';
import { EmployeeSalaryAssignment } from './models/EmployeeSalaryAssignment.model';
import { PayrollBatch } from './models/PayrollBatch.model';
import { LeaveRequest } from './models/LeaveRequest.model';
import { AuditLog } from './models/AuditLog.model';
import { DatabaseSeederService } from './database-seeder.service';

export const ALL_MODELS = [
  Role,
  User,
  RefreshToken,
  Employee,
  SalaryStructure,
  SalaryComponent,
  EmployeeSalaryAssignment,
  PayrollBatch,
  LeaveRequest,
  AuditLog,
];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', 'rootpassword'),
        database: config.get<string>('DB_NAME', 'hrms_db'),
        models: ALL_MODELS,
        autoLoadModels: true,
        synchronize: true, // Auto-create tables for all registered models if they don't exist
        sync: {
          force: false,
          alter: false,
        },
        logging: false,
        pool: {
          max: 15,
          min: 2,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          underscored: true,
          timestamps: true,
        },
      }),
    }),
    SequelizeModule.forFeature([Role, User]),
  ],
  providers: [DatabaseSeederService],
  exports: [SequelizeModule, DatabaseSeederService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly seeder: DatabaseSeederService) {}

  async onModuleInit() {
    await this.seeder.seedRolesAndAdmin();
  }
}

