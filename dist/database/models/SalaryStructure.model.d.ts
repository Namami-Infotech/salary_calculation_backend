import { Model } from 'sequelize-typescript';
import { SalaryComponent } from './SalaryComponent.model';
import { EmployeeSalaryAssignment } from './EmployeeSalaryAssignment.model';
export declare class SalaryStructure extends Model {
    id: string;
    companyId: string;
    title: string;
    description: string;
    isActive: boolean;
    components: SalaryComponent[];
    assignments: EmployeeSalaryAssignment[];
}
