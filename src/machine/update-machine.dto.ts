import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateMachineDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: '0', description: 'string', required: false })
  machineNumber?: string;

  @IsOptional()
  @IsString({ message: 'Floor must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  floor?: string;

  @IsOptional()
  @ApiProperty({ example: true, description: 'true', required: false })
  status?: boolean;
}
