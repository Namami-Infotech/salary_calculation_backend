import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    getLeaveTypes(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
    findAllRequests(user: AuthenticatedUser): Promise<import("../database/models/LeaveRequest.model").LeaveRequest[]>;
    applyLeave(user: AuthenticatedUser, dto: CreateLeaveRequestDto): Promise<import("../database/models/LeaveRequest.model").LeaveRequest>;
    approveLeave(user: AuthenticatedUser, id: string, comments?: string): Promise<import("../database/models/LeaveRequest.model").LeaveRequest>;
    rejectLeave(user: AuthenticatedUser, id: string, comments?: string): Promise<import("../database/models/LeaveRequest.model").LeaveRequest>;
}
