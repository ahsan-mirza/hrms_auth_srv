import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.model';
import { KycDocumentType } from './kyc-document-types';

@Table({
  tableName: 'kyc',
  timestamps: true,
  paranoid: true,
})
export class Kyc extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number; // The ID of the user associated with the KYC

  @BelongsTo(() => User)
  declare user: User; // The user associated with the KYC


  @ForeignKey(() => KycDocumentType)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare kycDocumentTypeId: number;

  @BelongsTo(() => KycDocumentType)
  declare kycDocumentType: KycDocumentType; // The document type associated with the KYC


  @Column({
    type: DataType.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'verified' | 'rejected'; // Status of the KYC verification


  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare reason: string | null; // Reason for rejection or note on approval

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare profileDocumentFront: string | null; // URL of the uploaded document

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare profileDocumentBack: string | null; // URL of the uploaded document

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addressDocumentFront: string | null; // URL of the uploaded document

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addressDocumentBack: string | null; // URL of the uploaded document


  // meta i want to any 
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare meta: any | null; // Additional metadata related to the KYC

}