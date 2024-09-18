import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type WorkerDocument = Worker & Document;

@Schema()
export class Worker {
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

  @Prop({ required: true })
  @IsString({ message: 'Village must be a string' })
  @IsNotEmpty({ message: 'Village is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  aadharNo: string;

  @Prop({ required: true })
  @IsString({ message: 'Village must be a string' })
  @IsNotEmpty({ message: 'Village is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  currentAddress: string;

  @Prop({ required: true })
  @IsString({ message: 'Village must be a string' })
  @IsNotEmpty({ message: 'Village is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  permanentAddress: string;

  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  referenceName: string;

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

export const WorkerSchema = SchemaFactory.createForClass(Worker);

WorkerSchema.pre('save', function (next) {
  const Worker = this as WorkerDocument;
  Worker.updatedAt = new Date();
  next();
});

WorkerSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

WorkerSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
