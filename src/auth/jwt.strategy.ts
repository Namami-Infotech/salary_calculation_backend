import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../database/models/User.model';
import { Role } from '../database/models/Role.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User) private userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    });
  }

  async validate(payload: { sub: string; email: string; role: string; companyId: string }) {
    const user = await this.userModel.findByPk(payload.sub, {
      include: [{ model: Role }],
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is invalid or deactivated.');
    }
    return {
      userId: user.id,
      email: user.email,
      role: user.role?.name,
      companyId: user.companyId,
    };
  }
}

