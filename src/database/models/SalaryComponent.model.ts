import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SalaryStructure } from './SalaryStructure.model';

export enum ComponentType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
}

export enum CalculationType {
  FLAT = 'FLAT',
  PERCENTAGE_OF_BASIC = 'PERCENTAGE_OF_BASIC',
  FORMULA = 'FORMULA',
}

@Table({ tableName: 'salary_components', timestamps: true })
export class SalaryComponent extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => SalaryStructure)
  @Column({ type: DataType.UUID, allowNull: false })
  structureId: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string; // e.g. 'Basic Salary', 'HRA', 'PF', 'ESI', 'Professional Tax'

  @Column({ type: DataType.ENUM(...Object.values(ComponentType)), allowNull: false })
  type: ComponentType;

  @Column({ type: DataType.ENUM(...Object.values(CalculationType)), defaultValue: CalculationType.FLAT })
  calculationType: CalculationType;

  // Stored as DECIMAL(12, 2) for strict monetary precision
  @Column({ type: DataType.DECIMAL(12, 2), defaultValue: 0.0 })
  value: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isTaxable: boolean;

  @BelongsTo(() => SalaryStructure)
  structure: SalaryStructure;
}

