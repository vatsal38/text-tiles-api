import { MachineModule } from './../machine/machine.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Stock, StockSchema } from './stock.schema';
import { StockRepository } from './stock.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    MachineModule,
  ],
  controllers: [StockController],
  providers: [StockService, StockRepository],
  exports: [StockRepository],
})
export class StockModule {}
