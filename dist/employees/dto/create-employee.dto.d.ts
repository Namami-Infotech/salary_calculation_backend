import { EmploymentType, EmploymentStatus } from '../../database/models/Employee.model';
export declare class CreateEmployeeDto {
    employeeCode: string;
    firstName: string;
    lastName: string;
    age?: number;
    email: string;
    phone?: string;
    department?: string;
    designation?: string;
    joiningDate: string;
    monthlySalary?: number;
    employmentType?: EmploymentType;
    employmentStatus?: EmploymentStatus;
    probationPeriodDays?: number;
    bankDetails?: Record<string, any>;
    emergencyContact?: Record<string, any>;
}
