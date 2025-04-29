import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  BeforeCreate,
  BeforeUpdate,
  Index,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { UserRole } from './userRole.model';
import { Role } from './roles.model';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Table({
  tableName: 'users',
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['user_name'], unique: true },
    { fields: ['status'] },
  ],
})
export class User extends Model {
  @Column(DataType.STRING)
  declare firstName: string;

  @Column(DataType.STRING)
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare userName: string;

  @Column(DataType.DATE)
  declare dateOfBirth: Date;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare phone: string;

  @Column(DataType.STRING)
  declare kyc_profile_url: string;

  @Column(DataType.STRING)
  declare city: string;

  @Column(DataType.STRING)
  declare country: string;

  @Column(DataType.STRING)
  declare designation: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    defaultValue: UserStatus.ACTIVE,
  })
  declare status: UserStatus;

  @BelongsToMany(() => Role, () => UserRole)
  declare roles: Role[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }
}
