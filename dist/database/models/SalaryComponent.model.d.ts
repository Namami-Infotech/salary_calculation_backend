import { Model } from 'sequelize-typescript';
import { SalaryStructure } from './SalaryStructure.model';
export declare enum ComponentType {
    EARNING = "EARNING",
    DEDUCTION = "DEDUCTION"
}
export declare enum CalculationType {
    FLAT = "FLAT",
    PERCENTAGE_OF_BASIC = "PERCENTAGE_OF_BASIC",
    FORMULA = "FORMULA"
}
export declare class SalaryComponent extends Model {
    id: string;
    structureId: string;
    name: string;
    type: ComponentType;
    calculationType: CalculationType;
    value: number;
    isTaxable: boolean;
    structure: SalaryStructure;
}
