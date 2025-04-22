import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  PrimaryKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { LegalDocument } from './legal-document.model';
import { User } from './user.model';

@Table({ tableName: 'user_legal_acceptances', timestamps: true })
export class UserLegalAcceptance extends Model<UserLegalAcceptance> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User; // The user who provided the answer

  @ForeignKey(() => LegalDocument)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare document_id: number;

  @BelongsTo(() => LegalDocument)
  declare documnet: LegalDocument; // The user who provided the answer

  @Default(false)
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare accepted: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  declare accepted_at: Date;
}
