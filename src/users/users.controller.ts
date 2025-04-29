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
import { CreateUserDTO } from './dto/create-user.dto';
import { CheckEmailDto } from './dto/check-email.dto';

import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from './guards/auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { routes } from 'src/routes';
import { CheckUsernameDTO } from './dto/check-username.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(routes.HELLOUSER)
  getHello(): any {
    return { message: 'Hello Kafka ' };
  }

  @Post()
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.sendOtpForRegistration(createUserDTO);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUserInfo(@Request() res) {
    console.log({ res });
    // return {};
    return this.usersService.getUserInformation(res.user.id);
  }



  @Get('check-userName')
  async cehckUsername(@Query() query: CheckUsernameDTO) {
    console.log({ query });

    return this.usersService.userNameAvailability(query.userName);
  }

  @Get('check-email')
  async checkEmail(@Query() query: CheckEmailDto) {
    console.log({ query });
    return this.usersService.cehckEmailAvailability(query.email);
  }



  @Post('send-otp')
  async sendOtpRegistration(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.sendOtpForRegistration(createUserDTO);
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
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
