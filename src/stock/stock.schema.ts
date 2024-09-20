import { Machine } from './../machine/machine.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type StockDocument = Stock & Document;

@Schema()
export class Stock {
  @Prop({ required: true })
  @IsString({ message: 'Serial Number must be a string' })
  @IsNotEmpty({ message: 'Serial Number is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  serialNumber: string;

  @Prop({ type: Types.ObjectId, ref: Machine.name, required: true })
  @IsNotEmpty({ message: 'Machine is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  machine: Machine;

  @Prop({ required: true })
  @IsNumber({}, { message: 'Meter must be a number' })
  @IsNotEmpty({ message: 'Meter is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  meter: number;

  @Prop({ required: true })
  @IsNotEmpty({ message: 'Type is required' })
  @IsString({ message: 'Type must be a number' })
  @ApiProperty({ example: 'string', description: 'string' })
  type: string;

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

export const StockSchema = SchemaFactory.createForClass(Stock);

StockSchema.pre('save', function (next) {
  const Stock = this as StockDocument;
  Stock.updatedAt = new Date();
  next();
});

StockSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

StockSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
