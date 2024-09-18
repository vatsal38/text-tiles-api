import { Buyer } from './../buyer/buyer.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type GoodsDocument = Goods & Document;

export enum GoodsStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  OverDueDate = 'Over Due Date',
  PaidOverDueDate = 'Paid (Over Due Date)',
}

@Schema()
export class Goods {
  @Prop({ required: true })
  @IsString({ message: 'Product Name must be a string' })
  @IsNotEmpty({ message: 'Product Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  productName: string;

  @Prop({ required: true })
  @IsString({ message: 'Quantity must be a string' })
  @IsOptional()
  @IsNotEmpty({ message: 'Quantity is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  quantity: string;

  @Prop({ required: true })
  @IsString({ message: 'Weight must be a string' })
  @IsNotEmpty({ message: 'Weight is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  weight: string;

  @Prop({ required: true })
  @IsString({ message: 'Rate must be a string' })
  @IsNotEmpty({ message: 'Rate is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  rate: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'GST No must be a string' })
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  gstNo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true })
  @IsMongoId({ message: 'Buyer must be a valid MongoId' })
  @ApiProperty({ example: 'ObjectId', description: 'Reference to Buyer' })
  buyer: string;

  @Prop({ required: false })
  @IsNumber({}, { message: 'Interest Rate must be a number' })
  @IsOptional()
  @ApiProperty({ example: 5, description: 'Interest Rate (%)' })
  interestRate?: number;

  @Prop({ required: false })
  @IsOptional()
  @ApiProperty({ example: '2024-12-31', description: 'Due Date' })
  dueDate?: Date;

  // Updated status field with enum
  @Prop({ required: true, enum: GoodsStatus, default: GoodsStatus.Pending })
  @IsEnum(GoodsStatus, {
    message:
      'Status must be one of: Pending, Paid, Over Due Date, Paid (Over Due Date)',
  })
  @ApiProperty({
    enum: GoodsStatus,
    example: GoodsStatus.Pending,
    description: 'Status',
  })
  status: GoodsStatus;

  @Prop({ required: false })
  @IsString({ message: 'Image URL must be a string' })
  @IsOptional()
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Product image URL',
  })
  image?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const GoodsSchema = SchemaFactory.createForClass(Goods);

GoodsSchema.pre('save', function (next) {
  const Goods = this as GoodsDocument;
  Goods.updatedAt = new Date();
  next();
});

GoodsSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

GoodsSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
