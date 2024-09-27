import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Seller, SellerSchema } from './seller.schema';
import { SellerRepository } from './seller.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }]),
  ],
  controllers: [SellerController],
  providers: [SellerService, SellerRepository],
  exports: [SellerRepository],
})
export class SellerModule {}
