import { Model } from 'sequelize-typescript';
import { Employee } from './Employee.model';
import { SalaryStructure } from './SalaryStructure.model';
export declare class EmployeeSalaryAssignment extends Model {
    id: string;
    employeeId: string;
    structureId: string;
    baseSalary: number;
    grossSalary: number;
    netSalary: number;
    effectiveFrom: string;
    effectiveTo: string;
    isActive: boolean;
    employee: Employee;
    structure: SalaryStructure;
}
