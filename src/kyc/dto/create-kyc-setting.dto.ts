import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FACE_DOCUMENT, KYC_DOCUMENT, KYC_TYPE } from 'src/enum/kyc.enum';

export class KycSettingsDto {
  @IsOptional()
  @IsEnum(KYC_TYPE)
  kycType: KYC_TYPE;

  @IsBoolean()
  profileIdentity: boolean;

  @IsBoolean()
  addressVerification: boolean;

  @IsBoolean()
  faceComparisonRequired: boolean;

  @IsArray()
  @IsEnum(KYC_DOCUMENT, { each: true })
  profileIdentityDocument: KYC_DOCUMENT[];

  @IsArray()
  @IsEnum(FACE_DOCUMENT, { each: true })
  faceComparisonAllowedDocuments: FACE_DOCUMENT[];

  @IsBoolean()
  allowPoiManualUploads: boolean;

  @IsBoolean()
  allowDesktop: boolean;
}

export class CreateDocumentSettingKycDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => KycSettingsDto)
  settings: KycSettingsDto;
}
