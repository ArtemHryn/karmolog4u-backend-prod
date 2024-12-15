import { DiscountModule } from './admin/products/discount/discount.module';
import { ProductModule } from './products/product.module';
// import { MaterialModule } from './material/material.module';
// import { GroupModule } from './group/group.module';
import { AdminUserModule } from './admin/user/admin-user.module';
import { AdminModule } from './admin/admin.module';
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
import { AdminProductModule } from './admin/products/admin-product.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    // ProductModule,
    // MaterialModule,
    ConfigModule.forRoot({ validate, envFilePath, isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
      }),
    }),
    DiscountModule,
    TokenModule,
    UserModule,
    AuthModule,
    // AdminModule,
    AdminUserModule,
    AdminProductModule,
    ProductModule,
    // GroupModule,
    // RouterModule.register([
    //   {
    //     path: 'admin',
    //     module: AdminModule,
    //     children: [
    //       {
    //         path: '/',
    //         module: AdminUserModule,
    //       },
    //       {
    //         // path: '/',
    //         // module: ,
    //       },
    //     ],
    //   },
    // ]),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
