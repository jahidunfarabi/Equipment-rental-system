import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsIn,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdminDto {
  @IsOptional()
  @IsString()
  fullName?: string; // Optional name field

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Account status

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  @Matches(/@aiub\.edu$/, { message: 'Only @aiub.edu emails allowed' })
  email!: string; // Domain restriction

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  @Matches(/[A-Z]/, { message: 'Must contain one uppercase letter' })
  password!: string; // Password complexity rules

  @IsNotEmpty()
  @IsIn(['male', 'female'])
  gender!: string; // Gender selection

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  phone!: number; // Converted to number for bigint column

  @IsNotEmpty()
  @IsString()
  role!: string; // User role
}
