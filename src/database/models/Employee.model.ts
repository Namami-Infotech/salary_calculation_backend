import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './User.model';
import { EmployeeSalaryAssignment } from './EmployeeSalaryAssignment.model';
import { LeaveRequest } from './LeaveRequest.model';

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
}

@Table({
  tableName: 'employees',
  timestamps: true,
  paranoid: true,
  indexes: [
    { unique: true, fields: ['employee_code'] },
    { unique: true, fields: ['email'] },
  ],
})
export class Employee extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING(64), allowNull: true })
  companyId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  userId: string;

  @Column({ type: DataType.STRING(32), allowNull: false })
  employeeCode: string;

  @Column({ type: DataType.STRING(64), allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING(64), allowNull: false })
  lastName: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  age: number;

  @Column({ type: DataType.STRING(120), allowNull: false })
  email: string;

  @Column({ type: DataType.STRING(32), allowNull: true })
  phone: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  photoUrl: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  address: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  department: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  designation: string;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: true })
  managerId: string;

  @Column({ type: DataType.ENUM(...Object.values(EmploymentType)), defaultValue: EmploymentType.FULL_TIME })
  employmentType: EmploymentType;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  joiningDate: string;

  @Column({ type: DataType.INTEGER, defaultValue: 90 }) // Probation days
  probationPeriodDays: number;

  @Column({ type: DataType.ENUM(...Object.values(EmploymentStatus)), defaultValue: EmploymentStatus.ACTIVE })
  employmentStatus: EmploymentStatus;

  @Column({ type: DataType.DECIMAL(12, 2), defaultValue: 45000.0 })
  monthlySalary: number;

  // Bank Details stored in JSON for security & structured retrieval
  @Column({ type: DataType.JSON, allowNull: true })
  bankDetails: {
    accountHolderName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    branchName?: string;
  };

  // Emergency Contact
  @Column({ type: DataType.JSON, allowNull: true })
  emergencyContact: {
    name?: string;
    relationship?: string;
    phone?: string;
  };

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Employee, { foreignKey: 'managerId', as: 'manager' })
  manager: Employee;

  @HasMany(() => EmployeeSalaryAssignment)
  salaryAssignments: EmployeeSalaryAssignment[];

  @HasMany(() => LeaveRequest)
  leaveRequests: LeaveRequest[];
}
