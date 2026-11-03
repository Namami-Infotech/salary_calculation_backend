import { Model } from 'sequelize-typescript';
import { User } from './User.model';
import { EmployeeSalaryAssignment } from './EmployeeSalaryAssignment.model';
import { LeaveRequest } from './LeaveRequest.model';
export declare enum EmploymentStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum EmploymentType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERN = "INTERN"
}
export declare class Employee extends Model {
    id: string;
    companyId: string;
    userId: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    phone: string;
    photoUrl: string;
    address: string;
    department: string;
    designation: string;
    managerId: string;
    employmentType: EmploymentType;
    joiningDate: string;
    probationPeriodDays: number;
    employmentStatus: EmploymentStatus;
    monthlySalary: number;
    bankDetails: {
        accountHolderName?: string;
        accountNumber?: string;
        bankName?: string;
        ifscCode?: string;
        branchName?: string;
    };
    emergencyContact: {
        name?: string;
        relationship?: string;
        phone?: string;
    };
    user: User;
    manager: Employee;
    salaryAssignments: EmployeeSalaryAssignment[];
    leaveRequests: LeaveRequest[];
}
