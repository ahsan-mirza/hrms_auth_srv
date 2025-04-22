import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Kyc } from './kyc.model';

@Table({
  tableName: 'kyc_document_types',
  timestamps: true,
  paranoid: true,
})
export class KycDocumentType extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string; // Name of the verification type (e.g., Emirate Id)

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare symbol: string; // unique identifier for the verification type (e.g., ID, Address)

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null; // Description of the verification type

  @Column({
    type: DataType.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE',
    allowNull: false,
  })
  declare status: 'ACTIVE' | 'INACTIVE'; // Status of the verification type

  @Column({
    type: DataType.ENUM('profile', 'address'),
    defaultValue: 'profile',
    allowNull: false,
  })
  declare type: 'profile' | 'address'; // Type of document (e.g., profile, address)

  @HasMany(() => Kyc)
  kyc: Kyc[]; // Relationship with KYC records
}
