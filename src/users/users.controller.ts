import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
  Query,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { CheckReferralCodeDto } from './dto/check-referral-code.dto';
import { CheckUsernameDto } from './dto/check-username.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import {
  AcceptLegalDocumentDto,
  CreateLegalDocumentDto,
} from './dto/legal-document.dto';
import { UserDevicesService } from './user-device.services';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userDevicesService: UserDevicesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.sendOtpForRegistration(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUserInfo(@Request() res) {
    console.log({ res });
    // return {};
    return this.usersService.getUserInformation(res.user.id);
  }

  @Get('check-referral-code')
  async checkReferralCode(@Query() query: CheckReferralCodeDto) {
    return this.usersService.checkReferralCode(query.code);
  }

  @Get('check-username')
  async cehckUsername(@Query() query: CheckUsernameDto) {
    console.log({ query });

    return this.usersService.usernameAvailability(query.username);
  }

  @Get('check-email')
  async checkEmail(@Query() query: CheckEmailDto) {
    console.log({ query });
    return this.usersService.cehckEmailAvailability(query.email);
  }

  @Get('questions')
  async getQuestions() {
    return this.usersService.getRegisterQuestion();
  }

  @Post('send-otp')
  async sendOtpRegistration(@Body() createUserDto: CreateUserDto) {
    return this.usersService.sendOtpForRegistration(createUserDto);
  }

  @Post('verify-otp')
  async verifyOtpRegistration(@Body() body: { token: string; otp: string }) {
    return this.usersService.verifyOtpAndCreateUser(body.token, body.otp);
  }

  @Post('login')
  async login(@Body() body: { identifier: string; password: string }) {
    return this.usersService.loginUser(body.identifier, body.password);
  }

  @Post('forgot-password')
  async sendOtpForgotPassword(@Body() body: { email: string }) {
    return this.usersService.sendOtpForgotPassword(body.email);
  }

  @Post('reset-password')
  async updatepassword(@Body() body: { token: string; newPassword: string }) {
    return this.usersService.updatePassword(body.token, body.newPassword);
  }
  @Post('resend-otp')
  async rensedEmailOtp(@Body() body: { token: string }) {
    return this.usersService.resendEmailOtp(body.token);
  }

  @Get('community/:id')
  getCommunity(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getDirectCommunity(id);
  }
  @Get('fullcommunity/:id')
  getMyFullCommunity(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getMyCommunity(id);
  }

  @Get('document-content')
  getDocumentContent(@Query('type') type: string) {
    return this.usersService.getLegalDocument(type);
  }

  @Post('document-content')
  createDocument(@Body() body: any) {
    console.log('body', body);
    return this.usersService.createLegalDocument(body);
  }

  @Post('accept-document')
  createDocumentAcceptance(@Body() body: any) {
    return this.usersService.acceptLegalDocument(body);
  }
  @UseGuards(AuthGuard)
  @Get('recent-devices')
  async getRecentDevices(
    @Request() req,
    // @Query() paginationDto: PaginationDto,
  ) {
    // return {};
    // const { page = 1, limit = 10 } = {paginationDto};
    console.log('🚀 ~ UsersController ~ paginationDto:');
    // return this.userDevicesService.getRecentDevices(req.user.id, 1, +10);
  }

  // @Get('bulk')
  // bulkCreateUserSeederWithNested() {
  //   return this.usersService.bulkCreateUserSeederWithNested();
  // }

  // @Get('image/*')
  // async getImageFromCloudStorage(@Param('path') params, @Res() res: Response) {
  //   const { buffer, contentType } =
  //     await this.usersService.getImageFromCloudStorage(params);
  //   res.set('Content-Type', contentType);
  //   res.send(buffer);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
