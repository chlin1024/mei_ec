import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  id: number;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  userName: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}/)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  email: string;
}
