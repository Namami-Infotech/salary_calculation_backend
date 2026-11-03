import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

export enum PayrollBatchStatus {
  DRAFT = 'DRAFT',
  PREVIEW = 'PREVIEW',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
}

@Table({
  tableName: 'payroll_batches',
  timestamps: true,
  indexes: [{ unique: true, fields: ['company_id', 'year', 'month'] }],
})
export class PayrollBatch extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING(64), allowNull: true })
  companyId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  year: number; // e.g. 2026

  @Column({ type: DataType.INTEGER, allowNull: false })
  month: number; // 1 to 12

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0.0 })
  totalGrossPay: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0.0 })
  totalDeductions: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0.0 })
  totalNetPay: number;

  @Column({ type: DataType.ENUM(...Object.values(PayrollBatchStatus)), defaultValue: PayrollBatchStatus.DRAFT })
  status: PayrollBatchStatus;

  @Column({ type: DataType.UUID, allowNull: true })
  approvedBy: string;

  @Column({ type: DataType.DATE, allowNull: true })
  approvedAt: Date;

  @Column({ type: DataType.UUID, allowNull: true })
  processedBy: string;

  @Column({ type: DataType.DATE, allowNull: true })
  processedAt: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;

  @Column({ type: DataType.JSON, allowNull: true })
  records: any[];
}
