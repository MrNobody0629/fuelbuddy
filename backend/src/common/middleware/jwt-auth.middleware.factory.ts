// src/common/middleware/jwt-auth.middleware.factory.ts
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { JwtAuthMiddleware } from './auth.middleware';

export function createJwtAuthMiddleware(
  jwtService: JwtService,
  dataSource: DataSource,
) {
  return new JwtAuthMiddleware(jwtService, dataSource);
}
