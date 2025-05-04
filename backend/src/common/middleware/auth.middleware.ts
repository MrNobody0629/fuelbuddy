import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { EXCLUDED_APIS_FROM_AUTH } from '../constant/constant';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const shouldExclude = EXCLUDED_APIS_FROM_AUTH.some((pattern) => {
      return typeof pattern === 'string'
        ? req?.baseUrl === pattern
        : pattern instanceof RegExp && pattern.test(req?.baseUrl);
    });

    if (shouldExclude) return next();

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const userRepo = this.dataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: payload.userId } });
      if (user?.access_token !== token)
        throw new UnauthorizedException('Token mismatch');
      if (!user) throw new UnauthorizedException('User not found');
      req['user'] = user;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
