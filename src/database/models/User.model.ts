import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';
import { Role } from './Role.model';
import { Employee } from './Employee.model';
import { RefreshToken } from './RefreshToken.model';
import { AuditLog } from './AuditLog.model';

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING(64), allowNull: true })
  companyId: string;

  @Column({ type: DataType.STRING(120), unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  passwordHash: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  roleId: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @BelongsTo(() => Role)
  role: Role;

  @HasOne(() => Employee)
  employee: Employee;

  @HasMany(() => RefreshToken)
  refreshTokens: RefreshToken[];

  @HasMany(() => AuditLog)
  auditLogs: AuditLog[];
}
