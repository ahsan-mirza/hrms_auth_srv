import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserRole } from './userRole.model';


@Table({
  tableName: 'roles',
})
export class Role extends Model<Role> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  value: string; // e.g. 'admin', 'employee', 'superAdmin'

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
