import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type MachineDocument = Machine & Document;

@Schema()
export class Machine {
  @Prop({ unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  @IsString({ message: 'Machine string must be a string' })
  @ApiProperty({ example: '0', description: '0' })
  machineNumber: string;

  @Prop({ required: true })
  @IsString({ message: 'floor must be a string' })
  @IsNotEmpty({ message: 'floor is required' })
  @ApiProperty({ example: 'floor', description: 'floor' })
  floor: string;

  @Prop({ default: true })
  status: boolean;

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

export const MachineSchema = SchemaFactory.createForClass(Machine);

MachineSchema.pre('save', function (next) {
  const Machine = this as MachineDocument;
  Machine.updatedAt = new Date();
  next();
});

MachineSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

MachineSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
