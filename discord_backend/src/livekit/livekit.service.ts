import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
@Injectable()
export class LivekitService {
  async createAccessToken(identity: string, roomName: string) {
    try {
      const at = new AccessToken(
        process.env.LK_API_KEY,
        process.env.LK_API_SECRET,
        { identity },
      );

      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
      });
      return at.toJwt();
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
