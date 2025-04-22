import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
} from 'sequelize-typescript';
import { KYC_TYPE, KYC_DOCUMENT, FACE_DOCUMENT } from 'src/enum/kyc.enum';

const DEFAULT_KYC_FACE_DOCUMENTS = Object.values(FACE_DOCUMENT); // ✅ Fix here

const DEFAULT_KYC_PROFILE_DOCUMENTS: KYC_DOCUMENT[] = [
  ...Object.values(KYC_DOCUMENT),
];

@Table({
  tableName: 'kyc_settings',
  timestamps: true,
  paranoid: true,
})
export class KycSetting extends Model {
  @Column({
    type: DataType.ENUM(...Object.values(KYC_TYPE)),
  })
  declare kycType: KYC_TYPE;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare profileIdentity: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare addressVerification: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare faceComparisonRequired: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: () => DEFAULT_KYC_PROFILE_DOCUMENTS,
  })
  declare profileIdentityDocument: KYC_DOCUMENT[];

  @Column({
    type: DataType.JSONB, // ✅
    allowNull: false,
    defaultValue: () => [...Object.values(FACE_DOCUMENT)], // ✅
  })
  declare faceComparisonAllowedDocuments: FACE_DOCUMENT[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare allowPoiManualUploads: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare allowDesktop: boolean;

  // @BeforeCreate
  // static setDefaultDocuments(instance: KycSetting) {
  //   if (
  //     !instance.profileIdentityDocument ||
  //     instance.profileIdentityDocument.length === 0
  //   ) {
  //     instance.profileIdentityDocument = [...Object.values(KYC_DOCUMENT)];
  //   }
  // }
}
