import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../database/models/Role.model';

@ApiTags('Leave Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get('types')
  @ApiOperation({ summary: 'Get active leave types' })
  async getLeaveTypes() {
    return this.leavesService.getLeaveTypes();
  }

  @Get('requests')
  @ApiOperation({ summary: 'List all leave requests' })
  async findAllRequests(@CurrentUser() user: AuthenticatedUser) {
    return this.leavesService.findAllRequests(user.companyId);
  }

  @Post('requests')
  @ApiOperation({ summary: 'Apply for leave' })
  async applyLeave(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateLeaveRequestDto) {
    const targetEmployeeId = dto.employeeId || user.userId;
    return this.leavesService.applyLeave(user.companyId, targetEmployeeId, dto);
  }

  @Post('requests/:id/approve')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Approve leave request (Admin only)' })
  async approveLeave(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body('comments') comments?: string,
  ) {
    return this.leavesService.approveLeave(user.companyId, id, user.userId, comments);
  }

  @Post('requests/:id/reject')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Reject leave request (Admin only)' })
  async rejectLeave(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body('comments') comments?: string,
  ) {
    return this.leavesService.rejectLeave(user.companyId, id, user.userId, comments);
  }
}
