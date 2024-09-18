import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class UpdateWorkerDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Aadhar No must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  aadharNo?: string;

  @IsOptional()
  @IsString({ message: 'Current Address must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  currentAddress?: string;

  @IsOptional()
  @IsString({ message: 'Permanent Address must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  permanentAddress?: string;

  @IsOptional()
  @IsString({ message: 'Reference Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  referenceName?: string;

  @IsOptional()
  @ApiProperty({ example: true, description: 'true', required: false })
  status?: boolean;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
    required: false,
  })
  image?: string;
}
