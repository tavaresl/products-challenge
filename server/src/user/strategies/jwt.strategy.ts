import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'kl1pc2us@',
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.userService.getById(payload.id);

    if (!user) {
      throw new Error('invalid credentials.');
    }

    return user;
  }
}
