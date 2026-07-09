import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Marcus' })
  @IsString()
  first_name!: string;

  @ApiProperty({ example: 'Silva' })
  @IsString()
  last_name!: string;

  @ApiProperty({ example: 'marcus@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
