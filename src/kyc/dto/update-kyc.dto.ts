import { PartialType } from '@nestjs/mapped-types';
import { CreateKycDto } from './create-kyc.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateKycDto extends PartialType(CreateKycDto) {}
