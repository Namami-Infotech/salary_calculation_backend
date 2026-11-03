import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/models/User.model';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userModel;
    constructor(configService: ConfigService, userModel: typeof User);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
        companyId: string;
    }): Promise<{
        userId: string;
        email: string;
        role: import("../database/models/Role.model").RoleType;
        companyId: string;
    }>;
}
export {};
