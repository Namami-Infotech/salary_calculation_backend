import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalaryService } from './salary.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../database/models/Role.model';

@ApiTags('Salary & Payroll')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get('structures')
  @ApiOperation({ summary: 'Get configured salary structures' })
  async getStructures(@CurrentUser() user: AuthenticatedUser) {
    return this.salaryService.getStructures(user.companyId);
  }

  @Get('batches')
  @ApiOperation({ summary: 'List all monthly payroll batches' })
  async getBatches(@CurrentUser() user: AuthenticatedUser) {
    return this.salaryService.getBatches(user.companyId);
  }

  @Post('batches')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Calculate and generate monthly payroll batch in transaction (Admin only)' })
  async createPayrollBatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body('year') year: number,
    @Body('month') month: number,
  ) {
    return this.salaryService.createPayrollBatch(user.companyId, year, month, user.userId);
  }

  @Get('batches/:id')
  @ApiOperation({ summary: 'Get single payroll batch with full details' })
  async getBatchById(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.salaryService.getBatchById(user.companyId, id);
  }

  @Delete('batches/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete a payroll batch (Admin only)' })
  async deleteBatch(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.salaryService.deleteBatch(user.companyId, id);
  }

  @Post('batches/:id/approve')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Approve payroll batch (Admin only)' })
  async approveBatch(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.salaryService.approveBatch(user.companyId, id, user.userId);
  }

  @Post('batches/:id/pay')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Mark payroll batch as paid (Admin only)' })
  async markBatchAsPaid(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.salaryService.markBatchAsPaid(user.companyId, id, user.userId);
  }
}

