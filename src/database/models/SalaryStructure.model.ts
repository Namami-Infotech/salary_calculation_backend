import { Table, Column, Model, DataType, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { SalaryComponent } from './SalaryComponent.model';
import { EmployeeSalaryAssignment } from './EmployeeSalaryAssignment.model';

@Table({ tableName: 'salary_structures', timestamps: true })
export class SalaryStructure extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING(64), allowNull: true })
  companyId: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @HasMany(() => SalaryComponent)
  components: SalaryComponent[];

  @HasMany(() => EmployeeSalaryAssignment)
  assignments: EmployeeSalaryAssignment[];
}
