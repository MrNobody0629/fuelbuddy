import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entity/user.entity';
import { FirebaseAdminService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private firebaseAdmin: FirebaseAdminService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new UnauthorizedException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ email: dto.email, password: hashed });
    await this.userRepo.save(user);
    return this.signToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(user.id, user.email);
  }

  async firebaseSignup(req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Missing Firebase token');
    try {
      const decoded = await this.firebaseAdmin.auth.verifyIdToken(token);
      const { email } = decoded;

      let user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        user = this.userRepo.create({ email, password: '' });
        await this.userRepo.save(user);
      }

      const response_token = this.signToken(user.id, user.email);
      user.access_token = response_token.access_token;
      await this.userRepo.save(user);
      return response_token;
    } catch (err) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  private signToken(userId: string, email: string) {
    return {
      access_token: this.jwtService.sign(
        { userId, email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        },
      ),
    };
  }
}
