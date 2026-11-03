import { Model } from 'sequelize-typescript';
import { User } from './User.model';
export declare class AuditLog extends Model {
    id: string;
    companyId: string;
    userId: string;
    action: string;
    entityName: string;
    entityId: string;
    oldValues: any;
    newValues: any;
    ipAddress: string;
    userAgent: string;
    user: User;
}
