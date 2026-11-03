import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Employee } from './Employee.model';

export enum LeaveRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Table({ tableName: 'leave_requests', timestamps: true })
export class LeaveRequest extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  employeeId: string;

  @Column({ type: DataType.STRING(100), allowNull: false, defaultValue: 'Casual Leave' })
  leaveType: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  startDate: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  endDate: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  totalDays: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isHalfDay: boolean;

  @Column({ type: DataType.TEXT, allowNull: false })
  reason: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  attachmentUrl: string;

  @Column({ type: DataType.ENUM(...Object.values(LeaveRequestStatus)), defaultValue: LeaveRequestStatus.PENDING })
  status: LeaveRequestStatus;

  @Column({ type: DataType.UUID, allowNull: true })
  actionedBy: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  actionComments: string;

  @Column({ type: DataType.DATE, allowNull: true })
  actionedAt: Date;

  @BelongsTo(() => Employee, { foreignKey: 'employeeId', as: 'employee' })
  employee: Employee;
}
