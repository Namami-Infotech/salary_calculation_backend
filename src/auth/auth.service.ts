import { Injectable, UnauthorizedException, OnModuleInit, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../database/models/User.model';
import { Role, RoleType } from '../database/models/Role.model';
import { RefreshToken } from '../database/models/RefreshToken.model';
import { Employee } from '../database/models/Employee.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.syncDefaultAdminUser();
  }

  async syncDefaultAdminUser() {
    try {
      // 1. Ensure ADMIN role exists
      let adminRole = await this.roleModel.findOne({ where: { name: RoleType.ADMIN } });
      if (!adminRole) {
        adminRole = await this.roleModel.create({
          id: '11111111-1111-1111-1111-111111111111',
          name: RoleType.ADMIN,
          description: 'Complete administrative, HR, payroll, and management access',
        });
        this.logger.log('Created default ADMIN role');
      }

      // 2. Ensure EMPLOYEE role exists
      let empRole = await this.roleModel.findOne({ where: { name: RoleType.EMPLOYEE } });
      if (!empRole) {
        await this.roleModel.create({
          id: '22222222-2222-2222-2222-222222222222',
          name: RoleType.EMPLOYEE,
          description: 'Self-service portal access',
        });
        this.logger.log('Created default EMPLOYEE role');
      }

      // 3. Ensure admin@hrms.com exists with password '123456'
      const defaultEmail = 'admin@hrms.com';
      const plainPassword = '123456';
      const passwordHash = await bcrypt.hash(plainPassword, 12);
      const companyId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';

      const existingUser = await this.userModel.findOne({ where: { email: defaultEmail } });
      if (existingUser) {
        await existingUser.update({
          passwordHash,
          roleId: adminRole.id,
          isActive: true,
        });
        this.logger.log(`Synced default admin user (${defaultEmail}) with password '123456' and ADMIN role`);
      } else {
        await this.userModel.create({
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          companyId,
          email: defaultEmail,
          passwordHash,
          roleId: adminRole.id,
          isActive: true,
        });
        this.logger.log(`Created default admin user (${defaultEmail}) with password '123456' and ADMIN role`);
      }
    } catch (err: any) {
      this.logger.warn(`Default admin sync notice: ${err.message}`);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
      include: [
        { model: Role },
        { model: Employee, attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'photoUrl'] },
      ],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    // Hash refresh token before saving to database
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenModel.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role?.name,
        companyId: user.companyId,
        employee: user.employee,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenStr: string) {
    try {
      const decoded = this.jwtService.verify(refreshTokenStr, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userModel.findByPk(decoded.sub, {
        include: [{ model: Role }],
      });
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User account no longer active.');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role?.name,
        companyId: user.companyId,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
      });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async logout(userId: string) {
    await this.refreshTokenModel.update({ isRevoked: true }, { where: { userId } });
    return { success: true, message: 'Logged out successfully.' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'email', 'isActive', 'createdAt'],
      include: [
        { model: Role, attributes: ['id', 'name', 'description'] },
        { model: Employee },
      ],
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }
}
