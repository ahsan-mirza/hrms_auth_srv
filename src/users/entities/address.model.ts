import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

export enum AddressType {
  HOME = 'home',
  OFFICE = 'office',
  OTHER = 'other',
}

@Table({
  tableName: 'addresses',
})
export class Address extends Model {
  @Column({
    type: DataType.ENUM,
    values: Object.values(AddressType),
    defaultValue: AddressType.HOME,
  })
  declare type: AddressType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare street: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare country: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare postalCode: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  user: User;
}
