import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User, Refresh_Token } from '@prisma/client';
import { exclude } from '../utils/exclude.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async registerGuest(
    registerDto: RegisterDto,
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findOne(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phoneNumber,
      avatar: registerDto.avatar,
    });

    return exclude(user, ['password']);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '1d',
        ) as JwtSignOptions['expiresIn'],
      }),
    ]);

    const refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '1d',
    );
    const expiresAt = new Date();
    if (refreshExpiresIn.endsWith('d')) {
      expiresAt.setDate(
        expiresAt.getDate() + parseInt(refreshExpiresIn.replace('d', '')),
      );
    } else if (refreshExpiresIn.endsWith('h')) {
      expiresAt.setHours(
        expiresAt.getHours() + parseInt(refreshExpiresIn.replace('h', '')),
      );
    } else {
      expiresAt.setDate(expiresAt.getDate() + 1);
    }

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refresh_Token.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    try {
      const storedTokens = await this.prisma.refresh_Token.findMany({
        where: { userId: userId },
      });

      let matchedTokenRecord: Refresh_Token | null = null;
      for (const record of storedTokens) {
        const isMatch = await bcrypt.compare(refreshToken, record.token);
        if (isMatch) {
          matchedTokenRecord = record;
          break;
        }
      }

      if (!matchedTokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      if (new Date() > matchedTokenRecord.expiresAt) {
        await this.prisma.refresh_Token.delete({
          where: { id: matchedTokenRecord.id },
        });
        throw new UnauthorizedException('Refresh token expired');
      }

      const foundUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!foundUser) {
        throw new UnauthorizedException('User not found');
      }

      const user = foundUser;

      await this.prisma.refresh_Token.delete({
        where: { id: matchedTokenRecord.id },
      });

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const [accessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAsync(newPayload),
        this.jwtService.signAsync(newPayload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRES_IN',
            '1d',
          ) as JwtSignOptions['expiresIn'],
        }),
      ]);

      const refreshExpiresIn = this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '1d',
      );
      const expiresAt = new Date();
      if (refreshExpiresIn.endsWith('d')) {
        expiresAt.setDate(
          expiresAt.getDate() + parseInt(refreshExpiresIn.replace('d', '')),
        );
      } else {
        expiresAt.setDate(expiresAt.getDate() + 1);
      }

      const newHashedToken = await bcrypt.hash(newRefreshToken, 10);

      await this.prisma.refresh_Token.create({
        data: {
          token: newHashedToken,
          userId: user.id,
          expiresAt: expiresAt,
        },
      });

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    const storedTokens = await this.prisma.refresh_Token.findMany({
      where: { userId: userId },
    });

    for (const record of storedTokens) {
      const isMatch = await bcrypt.compare(refreshToken, record.token);
      if (isMatch) {
        await this.prisma.refresh_Token.delete({
          where: { id: record.id },
        });
        break;
      }
    }
  }
}
