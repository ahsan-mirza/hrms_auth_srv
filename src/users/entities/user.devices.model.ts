import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'logi_histories' })
export class UserDevices extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column(DataType.STRING)
  ipAddress: string;

  @Column(DataType.STRING)
  deviceType: string;

  @Column(DataType.STRING)
  browser: string;

  @Column(DataType.STRING)
  operatingSystem: string;

  @Column(DataType.STRING)
  country: string;

  @Column(DataType.STRING)
  city: string;

  @BelongsTo(() => User)
  user: User;
}
