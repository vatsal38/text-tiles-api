import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { Worker, WorkerSchema } from './worker.schema';
import { WorkerRepository } from './worker.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService, WorkerRepository],
})
export class WorkerModule {}
