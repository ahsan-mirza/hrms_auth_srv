import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { authRoutes, routes } from 'src/routes';
import { AuthService } from './auth.service';
import { MicroserviceException } from 'src/exception/microservice-exception';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(routes.HELLOUSER)
  getHello(): any {
    return { message: 'Hello Kafka ' };
  }

  @MessagePattern(authRoutes.REGISTER)
  async registerUser(@Payload() payload: any) {
    try {
      return await this.authService.registerUserService(payload.createUserDto);
    } catch (error) {
     
      throw MicroserviceException.Custom(error.message, error.error.code);
    }
  }
}
