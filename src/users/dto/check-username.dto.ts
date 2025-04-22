import { IsString, MinLength, MaxLength } from 'class-validator';

export class CheckUsernameDto {
  @IsString({ message: 'Username must be a valid string' })
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username: string;
}
