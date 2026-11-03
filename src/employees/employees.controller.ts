import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../database/models/Role.model';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List employees with pagination, search and filters' })
  async findAll(@CurrentUser() user: AuthenticatedUser, @Query() paginationDto: PaginationDto) {
    return this.employeesService.findAll(user.companyId, paginationDto);
  }

  @Post()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create employee profile with standard & dynamic custom fields ' })
  @ApiResponse({ status: 201, description: 'Employee onboarded successfully' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() createDto: CreateEmployeeDto) {
    return this.employeesService.create(user.companyId, createDto);
  }

  @Get('next-code')
  @ApiOperation({ summary: 'Get next auto-generated employee code in sequence' })
  async getNextCode(@CurrentUser() user: AuthenticatedUser) {
    return this.employeesService.getNextCode(user?.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee profile with dynamic fields and associations' })
  async findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.employeesService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @Put(':id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update employee profile and dynamic field values ' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateEmployeeDto>,
  ) {
    return this.employeesService.update(user.companyId, id, updateDto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Soft-delete an employee (Admin only)' })
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.employeesService.remove(user.companyId, id);
  }
}

