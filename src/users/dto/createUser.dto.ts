import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/, {
    message:
      'Password too Weak. Include at least one lowercase letter, one uppercase letter,one digit.',
  })
  password: string;

  @IsNotEmpty()
  name: string;

  // roles: UserRoles[];

  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  email: string;
}
