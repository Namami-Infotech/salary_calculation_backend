import { Model } from 'sequelize-typescript';
import { User } from './User.model';
export declare enum RoleType {
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE"
}
export declare class Role extends Model {
    id: string;
    name: RoleType;
    description: string;
    users: User[];
}
