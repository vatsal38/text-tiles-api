import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class UpdateStockDto {
  @IsOptional()
  @IsString({ message: 'serialNumber must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  serialNumber?: string;

  @IsOptional()
  machine?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Meter must be a number' })
  @ApiProperty({ example: '0', description: '0', required: false })
  meter?: string;

  @IsOptional()
  @IsString({ message: 'Type must be a string' })
  @ApiProperty({ example: 'type', description: 'type', required: false })
  type?: string;
}
