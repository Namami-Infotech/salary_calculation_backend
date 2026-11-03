import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(user: AuthenticatedUser, paginationDto: PaginationDto): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        data: any[];
    }>;
    create(user: AuthenticatedUser, createDto: CreateEmployeeDto): Promise<import("../database/models/Employee.model").Employee>;
    getNextCode(user: AuthenticatedUser): Promise<{
        nextCode: string;
    }>;
    findOne(user: AuthenticatedUser, id: string): Promise<any>;
    update(user: AuthenticatedUser, id: string, updateDto: Partial<CreateEmployeeDto>): Promise<any>;
    remove(user: AuthenticatedUser, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
