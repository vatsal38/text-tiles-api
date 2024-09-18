import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type SellerDocument = Seller & Document;

@Schema()
export class Seller {
  @Prop({ unique: true })
  code: string;

  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  name: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('IN', {
    message: 'Phone number must be a valid Indian phone number',
  })
  @ApiProperty({ example: '9999966666', description: '9999966666' })
  phone: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'GST No must be a string' })
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  gstNo: string;

  @Prop({ required: true })
  @IsString({ message: 'Shop Address must be a string' })
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  shopAddress: string;

  @Prop({ default: true })
  status: boolean;

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

export const SellerSchema = SchemaFactory.createForClass(Seller);

SellerSchema.pre('save', function (next) {
  const Seller = this as SellerDocument;
  Seller.updatedAt = new Date();
  next();
});

SellerSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

SellerSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
