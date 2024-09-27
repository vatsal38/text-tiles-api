import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { Buyer, BuyerSchema } from './buyer.schema';
import { BuyerRepository } from './buyer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }]),
  ],
  controllers: [BuyerController],
  providers: [BuyerService, BuyerRepository],
  exports: [BuyerRepository],
})
export class BuyerModule {}
