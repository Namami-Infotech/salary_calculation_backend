import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User.model';

@Table({ tableName: 'audit_logs', timestamps: true, updatedAt: false })
export class AuditLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING(64), allowNull: true })
  companyId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  userId: string;

  @Column({ type: DataType.STRING(64), allowNull: false })
  action: string; // e.g. 'PAYROLL_PROCESSED', 'LEAVE_APPROVED', 'EMPLOYEE_UPDATED'

  @Column({ type: DataType.STRING(64), allowNull: false })
  entityName: string; // 'Employee', 'PayrollBatch', 'LeaveRequest'

  @Column({ type: DataType.UUID, allowNull: true })
  entityId: string;

  @Column({ type: DataType.JSON, allowNull: true })
  oldValues: any;

  @Column({ type: DataType.JSON, allowNull: true })
  newValues: any;

  @Column({ type: DataType.STRING(45), allowNull: true })
  ipAddress: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  userAgent: string;

  @BelongsTo(() => User)
  user: User;
}
