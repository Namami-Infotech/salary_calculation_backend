import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeaveRequest, LeaveRequestStatus } from '../database/models/LeaveRequest.model';
import { Employee } from '../database/models/Employee.model';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(LeaveRequest) private leaveRequestModel: typeof LeaveRequest,
    @InjectModel(Employee) private employeeModel: typeof Employee,
  ) {}

  async getLeaveTypes() {
    return [
      { id: 'casual', name: 'Casual Leave (CL)', code: 'CL' },
      { id: 'sick', name: 'Sick Leave (SL)', code: 'SL' },
      { id: 'earned', name: 'Earned Leave (EL)', code: 'EL' },
      { id: 'maternity', name: 'Maternity / Paternity Leave', code: 'ML' },
      { id: 'unpaid', name: 'Leave Without Pay (LWP)', code: 'LWP' },
    ];
  }

  async findAllRequests(companyId?: string) {
    const employeeWhere: any = {};
    if (companyId) {
      employeeWhere[Op.or] = [{ companyId }, { companyId: null }];
    }

    return this.leaveRequestModel.findAll({
      include: [
        {
          model: Employee,
          as: 'employee',
          where: Object.keys(employeeWhere).length ? employeeWhere : undefined,
          required: false,
          attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async applyLeave(companyId: string, employeeIdOrUserId: string, dto: CreateLeaveRequestDto) {
    const targetId = dto.employeeId || employeeIdOrUserId;

    if (!targetId) {
      throw new BadRequestException('Please provide a valid employee ID.');
    }

    // 1. Resolve employee
    let employee = await this.employeeModel.findByPk(targetId);
    if (!employee) {
      // Check if ID is a userId
      employee = await this.employeeModel.findOne({ where: { userId: targetId } });
    }

    if (!employee) {
      throw new NotFoundException(`Employee not found with ID "${targetId}". Please select a registered active employee.`);
    }

    const employeeId = employee.id;

    // 2. Validate dates
    const startDate = dto.startDate;
    const endDate = dto.endDate || dto.startDate;
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('Start date cannot be after end date.');
    }

    // 3. Check for overlapping requests
    const overlapping = await this.leaveRequestModel.findOne({
      where: {
        employeeId,
        status: { [Op.in]: [LeaveRequestStatus.PENDING, LeaveRequestStatus.APPROVED] },
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: startDate },
      },
    });

    if (overlapping) {
      throw new ConflictException('You already have a pending or approved leave request during these dates.');
    }

    // 4. Create request
    const request = await this.leaveRequestModel.create({
      employeeId,
      leaveType: dto.leaveType || 'Casual Leave (CL)',
      startDate,
      endDate,
      totalDays: Number(dto.totalDays) > 0 ? Number(dto.totalDays) : 1,
      isHalfDay: Boolean(dto.isHalfDay),
      reason: dto.reason,
      status: LeaveRequestStatus.PENDING,
    });

    return this.leaveRequestModel.findByPk(request.id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
        },
      ],
    });
  }

  async approveLeave(companyId: string, requestId: string, actionedById: string, comments?: string) {
    const request = await this.leaveRequestModel.findByPk(requestId);
    if (!request || request.status !== LeaveRequestStatus.PENDING) {
      throw new NotFoundException('Leave request not found or not in pending status.');
    }

    // Resolve actionedBy to a valid employee ID or null to avoid foreign key errors with user IDs
    let resolvedActionedBy: string | null = null;
    if (actionedById) {
      const emp = await this.employeeModel.findByPk(actionedById);
      if (emp) {
        resolvedActionedBy = emp.id;
      } else {
        const empByUser = await this.employeeModel.findOne({ where: { userId: actionedById } });
        if (empByUser) {
          resolvedActionedBy = empByUser.id;
        }
      }
    }

    await request.update({
      status: LeaveRequestStatus.APPROVED,
      actionedBy: resolvedActionedBy,
      actionComments: comments || 'Approved by Admin',
      actionedAt: new Date(),
    });

    return this.leaveRequestModel.findByPk(request.id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
        },
      ],
    });
  }

  async rejectLeave(companyId: string, requestId: string, actionedById: string, comments?: string) {
    const request = await this.leaveRequestModel.findByPk(requestId);
    if (!request || request.status !== LeaveRequestStatus.PENDING) {
      throw new NotFoundException('Leave request not found or not in pending status.');
    }

    // Resolve actionedBy to a valid employee ID or null to avoid foreign key errors with user IDs
    let resolvedActionedBy: string | null = null;
    if (actionedById) {
      const emp = await this.employeeModel.findByPk(actionedById);
      if (emp) {
        resolvedActionedBy = emp.id;
      } else {
        const empByUser = await this.employeeModel.findOne({ where: { userId: actionedById } });
        if (empByUser) {
          resolvedActionedBy = empByUser.id;
        }
      }
    }

    await request.update({
      status: LeaveRequestStatus.REJECTED,
      actionedBy: resolvedActionedBy,
      actionComments: comments || 'Rejected by Admin',
      actionedAt: new Date(),
    });

    return this.leaveRequestModel.findByPk(request.id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
        },
      ],
    });
  }
}
