import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { SalaryStructure } from '../database/models/SalaryStructure.model';
import { SalaryComponent } from '../database/models/SalaryComponent.model';
import { EmployeeSalaryAssignment } from '../database/models/EmployeeSalaryAssignment.model';
import { PayrollBatch } from '../database/models/PayrollBatch.model';
import { Employee } from '../database/models/Employee.model';
import { LeaveRequest } from '../database/models/LeaveRequest.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SalaryStructure,
      SalaryComponent,
      EmployeeSalaryAssignment,
      PayrollBatch,
      Employee,
      LeaveRequest,
    ]),
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
  exports: [SalaryService],
})
export class SalaryModule {}
