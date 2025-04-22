import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { KycService } from './kyc.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { KycSettingsDto } from './dto/create-kyc-setting.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  create(@Body() createKycDto: CreateKycDto) {
    return this.kycService.create(createKycDto);
  }

  @UseGuards(AuthGuard)
  @Post('create-verification-link')
  createVerificationLink(@Request() res, @Body() createKycDto: CreateKycDto) {
    return this.kycService.createVerificationLink(res.user);
  }

  @Post('verify')
  verifyKyc(@Request() res, @Body() data: any) {
    console.log('data', data);
    return this.kycService.verifyKYC(data);
  }

  @Get()
  findAll() {
    return this.kycService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kycService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKycDto: UpdateKycDto) {
    return this.kycService.update(+id, updateKycDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kycService.remove(+id);
  }

  @Post('admin/create-kyc-setting')
  createDocumentSetting(@Body() createKycSettingDto: KycSettingsDto) {
    return this.kycService.createKycVerificationDocumentSetting(
      createKycSettingDto,
    );
  }
}
