import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/users.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, res: Response) {
    const tokenPayload : TokenPayload = {
      userId: user._id.toHexString(),
      email: user.email,
      name: user.name,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        this.configService.get<number>('JWT_EXPIRATION', 3600),
    );

    const token = this.jwtService.sign(tokenPayload);
    res.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
