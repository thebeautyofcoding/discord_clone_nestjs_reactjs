import { Provider } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const REDIS_PUB_SUB = 'REDIS_PUB_SUB';

export const redisPubSubProvider: Provider = {
  provide: REDIS_PUB_SUB,
  useFactory: () => {
    return new RedisPubSub({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_POST) || 6379,
      },
    });
  },
};
