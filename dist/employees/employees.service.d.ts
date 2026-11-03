import { Sequelize } from 'sequelize-typescript';
import { Employee } from '../database/models/Employee.model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class EmployeesService {
    private employeeModel;
    private sequelize;
    constructor(employeeModel: typeof Employee, sequelize: Sequelize);
    findAll(companyId: string, paginationDto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        data: any[];
    }>;
    getNextCode(companyId?: string): Promise<{
        nextCode: string;
    }>;
    findOne(companyId: string, id: string): Promise<any>;
    create(companyId: string, createDto: CreateEmployeeDto): Promise<Employee>;
    update(companyId: string, id: string, updateDto: Partial<CreateEmployeeDto>): Promise<any>;
    remove(companyId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
