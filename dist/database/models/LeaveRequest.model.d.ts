import { Model } from 'sequelize-typescript';
import { Employee } from './Employee.model';
export declare enum LeaveRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class LeaveRequest extends Model {
    id: string;
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    isHalfDay: boolean;
    reason: string;
    attachmentUrl: string;
    status: LeaveRequestStatus;
    actionedBy: string;
    actionComments: string;
    actionedAt: Date;
    employee: Employee;
}
