import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './roles.model';

@Table({
  tableName: 'user_roles',
  timestamps: false, // Optional: disable if you don't need createdAt/updatedAt
})
export class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId: number;
}
