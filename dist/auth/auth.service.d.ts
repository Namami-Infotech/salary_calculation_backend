import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/models/User.model';
import { Role, RoleType } from '../database/models/Role.model';
import { RefreshToken } from '../database/models/RefreshToken.model';
import { Employee } from '../database/models/Employee.model';
import { LoginDto } from './dto/login.dto';
export declare class AuthService implements OnModuleInit {
    private userModel;
    private roleModel;
    private refreshTokenModel;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(userModel: typeof User, roleModel: typeof Role, refreshTokenModel: typeof RefreshToken, jwtService: JwtService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    syncDefaultAdminUser(): Promise<void>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: RoleType;
            companyId: string;
            employee: Employee;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshTokenStr: string): Promise<{
        accessToken: string;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getCurrentUser(userId: string): Promise<User>;
}
