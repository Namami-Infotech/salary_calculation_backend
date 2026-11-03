import { OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Role } from './models/Role.model';
import { User } from './models/User.model';
export declare class DatabaseSeederService implements OnModuleInit {
    private roleModel;
    private userModel;
    private sequelize;
    private readonly logger;
    constructor(roleModel: typeof Role, userModel: typeof User, sequelize: Sequelize);
    onModuleInit(): Promise<void>;
    ensureSchemaUpdates(): Promise<void>;
    cleanConstraints(): Promise<void>;
    seedRolesAndAdmin(): Promise<void>;
}
