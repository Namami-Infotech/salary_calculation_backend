import { LeaveRequest } from '../database/models/LeaveRequest.model';
import { Employee } from '../database/models/Employee.model';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
export declare class LeavesService {
    private leaveRequestModel;
    private employeeModel;
    constructor(leaveRequestModel: typeof LeaveRequest, employeeModel: typeof Employee);
    getLeaveTypes(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
    findAllRequests(companyId?: string): Promise<LeaveRequest[]>;
    applyLeave(companyId: string, employeeIdOrUserId: string, dto: CreateLeaveRequestDto): Promise<LeaveRequest>;
    approveLeave(companyId: string, requestId: string, actionedById: string, comments?: string): Promise<LeaveRequest>;
    rejectLeave(companyId: string, requestId: string, actionedById: string, comments?: string): Promise<LeaveRequest>;
}
