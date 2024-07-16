import { IsNotEmpty } from 'class-validator';

export class AdminSigninDto {
  username: string;

  @IsNotEmpty()
  password: string;
}
