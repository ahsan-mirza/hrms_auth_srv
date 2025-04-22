import { IsString, IsNotEmpty } from 'class-validator';

export class CheckReferralCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
