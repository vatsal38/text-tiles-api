import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { UploadController } from './upload-image/upload.controller';
import { HttpModule } from '@nestjs/axios';
import { FirebaseService } from './common/firebase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './task/tasks.module';
import { AppController } from './app.controller';
import { WorkerModule } from './worker/worker.module';
import { MachineModule } from './machine/machine.module';
import { SellerModule } from './seller/seller.module';
import { AgentModule } from './agent/agent.module';
import { BuyerModule } from './buyer/buyer.module';
import { GoodsModule } from './goods/goods.module';
import { StockModule } from './stock/stock.module';
import { DashboardController } from './dashboard/dashboard.controller';
const ENV: string = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ENV === 'production' ? '.env.prod' : `.env`],
      expandVariables: true,
    }),
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            auth: {
              user: configService.get<string>('MAIL_USER'),
              pass: configService.get<string>('MAIL_PASS'),
            },
          },
          defaults: {
            from: configService.get<string>('MAIL_FROM'),
          },
          template: {
            dir: join(__dirname, '..', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoURI = configService.get('MONGO_URI');
        const database = configService.get('DB_MONGO_DATABASE');

        return {
          uri: mongoURI,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    HttpModule,
    TasksModule,
    WorkerModule,
    MachineModule,
    SellerModule,
    AgentModule,
    BuyerModule,
    GoodsModule,
    StockModule,
  ],
  controllers: [UploadController, AppController, DashboardController],
  providers: [FirebaseService, AppService],
})
export class AppModule {}
