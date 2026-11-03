import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Employee, EmploymentStatus } from '../database/models/Employee.model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee) private employeeModel: typeof Employee,
    private sequelize: Sequelize,
  ) {}

  async findAll(companyId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', status } = paginationDto;
    const offset = (page - 1) * limit;

    const where: any = companyId ? { [Op.or]: [{ companyId }, { companyId: null }] } : {};
    if (search) {
      const searchCondition = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { employeeCode: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
      if (where[Op.or]) {
        where[Op.and] = [
          { [Op.or]: where[Op.or] },
          { [Op.or]: searchCondition },
        ];
        delete where[Op.or];
      } else {
        where[Op.or] = searchCondition;
      }
    }

    const statusParam = (status || (paginationDto as any)?.status)?.toString().toUpperCase();
    if (statusParam && statusParam !== 'ALL') {
      if (statusParam === 'ACTIVE') {
        where.employmentStatus = {
          [Op.in]: ['ACTIVE', 'PROBATION', 'CONFIRMED'],
        };
      } else {
        where.employmentStatus = statusParam;
      }
    }

    const { count, rows } = await this.employeeModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const normalizedData = rows.map((emp) => {
      const data = typeof emp.toJSON === 'function' ? emp.toJSON() : emp;
      if (data.employmentStatus !== 'INACTIVE') {
        data.employmentStatus = 'ACTIVE';
      }
      return data;
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: normalizedData,
    };
  }

  async getNextCode(companyId?: string) {
    const where: any = companyId ? { companyId } : {};
    const employees = await this.employeeModel.findAll({
      where,
      attributes: ['employeeCode'],
    });

    const numbers = employees
      .map((emp) => {
        const match = (emp.employeeCode || '').match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextCode = `EMP${String(maxNum + 1).padStart(3, '0')}`;
    return { nextCode };
  }

  async findOne(companyId: string, id: string) {
    const where: any = { id };
    if (companyId) {
      where.companyId = companyId;
    }
    let employee = await this.employeeModel.findOne({
      where,
    });

    if (!employee && companyId) {
      // In case employee was registered with null or different companyId
      employee = await this.employeeModel.findOne({ where: { id } });
    }

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }
    const data = typeof employee.toJSON === 'function' ? employee.toJSON() : employee;
    if (data.employmentStatus !== 'INACTIVE') {
      data.employmentStatus = 'ACTIVE';
    }
    return data;
  }

  async create(companyId: string, createDto: CreateEmployeeDto) {
    // Check for existing employee code or email
    const whereCheck: any = {
      [Op.or]: [{ employeeCode: createDto.employeeCode }, { email: createDto.email }],
    };
    if (companyId) {
      whereCheck.companyId = companyId;
    }
    const existing = await this.employeeModel.findOne({
      where: whereCheck,
    });

    if (existing) {
      throw new ConflictException('Employee with this code or email already exists.');
    }

    return this.employeeModel.create({
      ...createDto,
      employmentStatus: createDto.employmentStatus || EmploymentStatus.ACTIVE,
      companyId,
    });
  }

  async update(companyId: string, id: string, updateDto: Partial<CreateEmployeeDto>) {
    const employee = await this.findOne(companyId, id);

    // If changing employeeCode or email, ensure no collision with other records
    if (updateDto.employeeCode || updateDto.email) {
      const collisions = await this.employeeModel.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            ...(updateDto.employeeCode ? [{ employeeCode: updateDto.employeeCode }] : []),
            ...(updateDto.email ? [{ email: updateDto.email }] : []),
          ],
        },
      });
      if (collisions) {
        throw new ConflictException('Another employee with this code or email already exists.');
      }
    }

    await employee.update(updateDto);
    return this.findOne(companyId, id);
  }

  async remove(companyId: string, id: string) {
    const employee = await this.findOne(companyId, id);
    await employee.destroy(); // Soft delete via paranoid
    return { success: true, message: `Employee ${employee.employeeCode} soft-deleted successfully.` };
  }
}
