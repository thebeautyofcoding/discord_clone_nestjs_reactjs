import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
@Injectable()
export class TokenService {
  validateToken(token: string) {
    const jwtPublicKey = process.env.JWT_PUBLIC_KEY;

    try {
      const tokenWithoutBearer = token.replace('Bearer ', '');
      return verify(tokenWithoutBearer, jwtPublicKey);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
