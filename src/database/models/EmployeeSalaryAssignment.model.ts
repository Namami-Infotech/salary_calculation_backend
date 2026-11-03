import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Employee } from './Employee.model';
import { SalaryStructure } from './SalaryStructure.model';

@Table({ tableName: 'employee_salary_assignments', timestamps: true })
export class EmployeeSalaryAssignment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  employeeId: string;

  @ForeignKey(() => SalaryStructure)
  @Column({ type: DataType.UUID, allowNull: false })
  structureId: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  baseSalary: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  grossSalary: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  netSalary: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  effectiveFrom: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  effectiveTo: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @BelongsTo(() => Employee)
  employee: Employee;

  @BelongsTo(() => SalaryStructure)
  structure: SalaryStructure;
}

