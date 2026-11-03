import { Model } from 'sequelize-typescript';
import { PayrollRecord } from './PayrollRecord.model';
import { ComponentType } from './SalaryComponent.model';
export declare class PayrollLineItem extends Model {
    id: string;
    payrollRecordId: string;
    name: string;
    type: ComponentType;
    amount: number;
    payrollRecord: PayrollRecord;
}
