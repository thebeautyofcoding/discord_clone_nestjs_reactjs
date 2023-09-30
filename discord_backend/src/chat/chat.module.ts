import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from 'src/profile/profile.service';
import { ServerResolver } from 'src/server/server.resolver';
import { ServerService } from 'src/server/server.service';
import { REDIS_PUB_SUB, redisPubSubProvider } from 'src/redis-pubsub.provider';
import { MemberService } from 'src/member/member.service';

@Module({
  providers: [
    ChatService,
    ChatResolver,
    PrismaService,
    JwtService,
    ProfileService,
    ServerResolver,
    ServerService,
    redisPubSubProvider,
    MemberService,
  ],
})
export class ChatModule {}
