import { Model } from 'sequelize-typescript';
import { User } from './User.model';
export declare class RefreshToken extends Model {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    isRevoked: boolean;
    user: User;
}
