import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User, UserStatus } from 'src/users/entities/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { MicroserviceException } from 'src/exception/microservice-exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @Inject('REQUEST') private readonly request: Request, // Add this
  ) {}

  async registerUserService(
    createUserDto: CreateUserDTO,
  ): Promise<
    { statusCode: HttpStatus; message: string; data: any } | { message: string }
  > {
    try {
      const { password, email } = createUserDto;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw MicroserviceException.Custom(
          'Email already exist',
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        ...createUserDto,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
      });
      await user.save();

      // return only the user object without password
      const userWithoutPassword = user.get({ plain: true });
      const userInfor = {
        id: userWithoutPassword.id,
        firstName: userWithoutPassword.firstName,
        lastName: userWithoutPassword.lastName,
        email: userWithoutPassword.email,
      };

      return {
        message: 'User Register Successfully',
        statusCode: HttpStatus.CREATED,
        data: userInfor,
      };
    } catch (error) {
   
      throw MicroserviceException.Custom(error.message, error.error.code);
    }
  }
}
