import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { Goods, GoodsSchema } from './goods.schema';
import { GoodsRepository } from './goods.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goods.name, schema: GoodsSchema }]),
  ],
  controllers: [GoodsController],
  providers: [GoodsService, GoodsRepository],
})
export class GoodsModule {}
