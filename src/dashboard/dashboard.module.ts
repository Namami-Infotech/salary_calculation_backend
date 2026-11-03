import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Employee } from '../database/models/Employee.model';
import { LeaveRequest } from '../database/models/LeaveRequest.model';
import { PayrollBatch } from '../database/models/PayrollBatch.model';

@Module({
  imports: [SequelizeModule.forFeature([Employee, LeaveRequest, PayrollBatch])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}

