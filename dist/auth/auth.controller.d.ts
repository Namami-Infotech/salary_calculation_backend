import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("../database/models/Role.model").RoleType;
            companyId: string;
            employee: import("../database/models/Employee.model").Employee;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    logout(user: AuthenticatedUser): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(user: AuthenticatedUser): Promise<import("../database/models/User.model").User>;
}
