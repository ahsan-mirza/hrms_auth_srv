import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Username must be a string' })
  @MinLength(5, { message: 'Username should have at least 5 characters' })
  @MaxLength(50, {
    message: 'Username should not be longer than 50 characters',
  })
  userName: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  password: string;
}
