import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { LeaveRequest } from '../database/models/LeaveRequest.model';
import { Employee } from '../database/models/Employee.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      LeaveRequest,
      Employee,
    ]),
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [LeavesService],
})
export class LeavesModule {}
