import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthUtilsModule } from './auth-utils/auth-utils.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AuthUtilsModule,
    AuthModule,
    CacheModule.register({
      ttl: 10,
      max: 100000,
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
