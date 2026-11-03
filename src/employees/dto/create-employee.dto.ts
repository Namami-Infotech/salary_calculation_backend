import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { EmploymentType, EmploymentStatus } from '../../database/models/Employee.model';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'EMP004' })
  @IsNotEmpty()
  @IsString()
  employeeCode: string;

  @ApiProperty({ example: 'Vikram' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Singh' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({ example: 'vikram.singh@acmeglobal.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+91 98765 44444' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Engineering' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Senior Software Engineer' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: '2026-03-01' })
  @IsNotEmpty()
  joiningDate: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @IsNumber()
  monthlySalary?: number;

  @ApiPropertyOptional({ enum: EmploymentType, default: EmploymentType.FULL_TIME })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ enum: EmploymentStatus, default: EmploymentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus;

  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @IsNumber()
  probationPeriodDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  bankDetails?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  emergencyContact?: Record<string, any>;
}
