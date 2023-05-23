import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';
import { UsersService } from '../../users/users.service';
import { GOOGLE_AUTH } from '../auth.constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(GOOGLE_AUTH) private googleAuth,
    private usersService: UsersService,
  ) {
    super();
  }

  async validate(req: Request) {
    const code = req.headers['gauthorization'];
    const { tokens } = await this.googleAuth.getToken(code);

    if (tokens.id_token) {
      const data = await this.googleAuth.verifyIdToken({
        idToken: tokens.id_token,
      });
      const tokenPayload = data.getPayload();

      return this.findOrCreateUser(tokenPayload);
    }

    throw new UnauthorizedException();
  }

  async findOrCreateUser(payload: TokenPayload) {
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      return this.usersService.createByAccounts({
        username: payload.email.split('@')[0],
        email: payload.email,
      });
    }
    return user;
  }
}
