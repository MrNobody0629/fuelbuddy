import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MiddlewareModule } from './common/middleware/middleware.module';
import { JwtAuthMiddleware } from './common/middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging: true,
      autoLoadEntities: true,
      synchronize: process.env?.ENV === 'dev',
    }),
    MiddlewareModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly jwtAuthMiddleware: JwtAuthMiddleware) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.jwtAuthMiddleware.use.bind(this.jwtAuthMiddleware))
      .forRoutes('*');
  }
}
