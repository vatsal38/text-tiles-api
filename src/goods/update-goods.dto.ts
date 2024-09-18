import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { GoodsStatus } from './goods.schema';

export class UpdateGoodsDto {
  @IsOptional()
  @IsString({ message: 'Product Name must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  productName?: string;

  @IsOptional()
  @IsString({ message: 'GST No must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  gstNo?: string;

  @IsOptional()
  @IsString({ message: 'Quantity must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  quantity?: string;

  @IsOptional()
  @IsString({ message: 'Weight must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  weight?: string;

  @IsOptional()
  @IsString({ message: 'Rate must be a string' })
  @ApiProperty({ example: 'string', description: 'string', required: false })
  rate?: string;

  @IsOptional()
  @IsEnum(GoodsStatus, {
    message:
      'Status must be one of: Pending, Paid, Over Due Date, Paid (Over Due Date)',
  })
  @ApiProperty({
    enum: GoodsStatus,
    example: GoodsStatus.Pending,
    description: 'Status',
  })
  status?: GoodsStatus;

  @IsNumber({}, { message: 'Interest Rate must be a number' })
  @IsOptional()
  @ApiProperty({ example: 5, description: 'Interest Rate (%)' })
  interestRate?: number;

  @IsOptional()
  @ApiProperty({ example: '2024-12-31', description: 'Due Date' })
  dueDate?: Date;

  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
    required: false,
  })
  image?: string;
}
