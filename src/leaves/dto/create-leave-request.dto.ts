import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateLeaveRequestDto {
  @ApiPropertyOptional({ description: 'ID of Employee applying for leave (optional if applying for self)' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: 'Casual Leave' })
  @IsNotEmpty()
  @IsString()
  leaveType: string;

  @ApiProperty({ example: '2026-11-04' })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({ example: '2026-11-05' })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  totalDays: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;

  @ApiProperty({ example: 'Family function in hometown' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}
