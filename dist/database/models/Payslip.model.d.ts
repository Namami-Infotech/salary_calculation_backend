import { Model } from 'sequelize-typescript';
import { PayrollRecord } from './PayrollRecord.model';
export declare class Payslip extends Model {
    id: string;
    payrollRecordId: string;
    payslipNumber: string;
    pdfUrl: string;
    generatedAt: Date;
    payrollRecord: PayrollRecord;
}
