export declare class CreateLeaveRequestDto {
    employeeId?: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    isHalfDay?: boolean;
    reason: string;
}
