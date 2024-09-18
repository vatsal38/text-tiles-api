import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { Machine, MachineSchema } from './machine.schema';
import { MachineRepository } from './machine.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Machine.name, schema: MachineSchema }]),
  ],
  controllers: [MachineController],
  providers: [MachineService, MachineRepository],
})
export class MachineModule {}
