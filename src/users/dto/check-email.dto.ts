import { IsString, MinLength, MaxLength } from 'class-validator';

export class CheckEmailDto {
  @IsString({ message: 'Email must be a valid string' })
  email: string;
}
