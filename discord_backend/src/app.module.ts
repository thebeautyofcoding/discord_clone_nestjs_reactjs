import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ServerModule } from './server/server.module';
import { ProfileModule } from './profile/profile.module';
import { MemberModule } from './member/member.module';
import { ChatModule } from './chat/chat.module';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';
import { LivekitModule } from './livekit/livekit.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    GraphQLModule.forRootAsync({
      imports: [TokenModule],
      inject: [TokenService],
      driver: ApolloDriver,
      useFactory: async (tokenService: TokenService) => {
        return {
          installSubscriptionHandlers: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscriptions: {
            'subscriptions-transport-ws': {
              onConnect: async (connectionParams) => {
                if (!connectionParams.headers.authorization.token)
                  throw new Error('Missing auth token!');

                const profile = await tokenService.validateToken(
                  connectionParams.headers.authorization.token,
                );
                return { profile };
              },
            },
          },
        };
      },
    }),

    ServerModule,

    ProfileModule,

    MemberModule,

    ChatModule,

    TokenModule,

    LivekitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
