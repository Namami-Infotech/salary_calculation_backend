import { Table, Column, Model, DataType, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { User } from './User.model';

export enum RoleType {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

@Table({ tableName: 'roles', timestamps: true })
export class Role extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.ENUM(...Object.values(RoleType)), unique: true, allowNull: false })
  name: RoleType;

  @Column({ type: DataType.STRING(255), allowNull: true })
  description: string;

  @HasMany(() => User)
  users: User[];
}
