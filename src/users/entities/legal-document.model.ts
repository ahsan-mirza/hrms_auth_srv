import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

export enum DOCUMENT_TYPE {
  Terms = 'terms',
  Privacy = 'privacy',
  Risk = 'risk',
  Tax = 'tax',
}

@Table({ tableName: 'legal_documents' })
export class LegalDocument extends Model<LegalDocument> {
  @Column({
    type: DataType.ENUM(...Object.values(DOCUMENT_TYPE)),
  })
  declare type: DOCUMENT_TYPE;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  declare is_active: boolean;
}
