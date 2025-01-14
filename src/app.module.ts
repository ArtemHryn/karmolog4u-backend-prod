import { ImageModule } from './image/image.module';
import { DiscountModule } from './admin/products/discount/discount.module';
import { ProductModule } from './products/product.module';
// import { MaterialModule } from './material/material.module';
// import { GroupModule } from './group/group.module';
// import { AdminUserModule } from './admin/user/admin-user.module';
// import { AdminModule } from './admin/admin.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
// import { RouterModule } from '@nestjs/core';
import { validate } from './common/helper/env.validation';
import { LoggerMiddleware } from './common/middleware/logger.middlvare';
// import { AdminProductModule } from './admin/products/admin-product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AdminModule } from './admin/admin.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ validate, envFilePath, isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: '/covers',
      // rootPath: path.join(__dirname, '..', 'covers'), // Path to your static files
      serveRoot: '/covers', // Optional: URL prefix for accessing the files
    }),
    DiscountModule,
    TokenModule,
    UserModule,
    AuthModule,
    AdminModule,
    ProductModule,
    ImageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
