import { Args, Context, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Inject, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { Conversation, MessageResult, MessagesResult } from './types';
import { Mutation } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { ProfileService } from 'src/profile/profile.service';
import { Request } from 'express';
import { ServerResolver } from 'src/server/server.resolver';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { MemberService } from 'src/member/member.service';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly profileService: ProfileService,
    private readonly serverResolver: ServerResolver,
    private readonly memberService: MemberService,

    @Inject('REDIS_PUB_SUB') private readonly pubSub: RedisPubSub,
  ) {}
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Conversation)
  async getOrCreateConversation(
    @Args('memberOneId', { nullable: true }) memberOneId: number,
    @Args('memberTwoId', { nullable: true }) memberTwoId: number,
  ) {
    if (!memberOneId || !memberTwoId)
      throw new ApolloError(
        'Missing memberOneId or memberTwoId',
        'MISSING_MEMBER_ID',
      );
    try {
      return await this.chatService.getOrCreateConversation(
        memberOneId,
        memberTwoId,
      );
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MessageResult)
  async createMessage(
    @Args('content', { nullable: true }) content: string,
    @Args('currentProfileId', { nullable: true }) currentProfileId: number,
    @Args('conversationId', { nullable: true }) conversationId: number,
    @Args('channelId', { nullable: true }) channelId: number,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload,
    @Context() ctx: { req: Request },
  ) {
    try {
      let imageUrl;
      if (file) {
        imageUrl = await this.serverResolver.storeImageAndGetUrl(file);
      }
      const email = ctx.req.profile.email;

      const message = await this.chatService.createMessage(
        content,
        email,
        conversationId,
        channelId,
        imageUrl,
      );
      this.pubSub.publish('messageCreated', {
        messageCreated: message,
        conversationId,
        channelId,
      });
      return message;
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }
  @UseGuards(GraphqlAuthGuard)
  @Query(() => MessagesResult)
  async getMessages(
    @Args('conversationId', { nullable: true }) conversationId: number,
    @Args('channelId', { nullable: true }) channelId: number,
  ) {
    try {
      return await this.chatService.getMessages(conversationId, channelId);
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }
  // subscriptions

  @Subscription(() => MessageResult, {
    filter: (payload, variables) => {
      if (variables.channelId) {
        return payload.messageCreated.message.channelId === variables.channelId;
      }
      if (variables.conversationId) {
        return (
          payload.messageCreated.message.conversationId ===
          variables.conversationId
        );
      }
    },
  })
  messageCreated(
    @Context() ctx: any,
    @Args('conversationId', { nullable: true }) conversationId: number,
    @Args('channelId', { nullable: true }) channelId: number,
  ) {
    if (!ctx.profile.email)
      throw new ApolloError('No profile email found', 'NO_PROFILE_EMAIL');
    return this.pubSub.asyncIterator('messageCreated');
  }

  @Subscription(() => MessageResult)
  messageDeleted(
    @Args('conversationId', { nullable: true }) conversationId: number,
    @Args('channelId', { nullable: true }) channelId: number,
  ) {
    return this.pubSub.asyncIterator('messageDeleted');
  }

  @Subscription(() => MessageResult)
  messageUpdated(
    @Args('conversationId', { nullable: true }) conversationId: number,
    @Args('channelId', { nullable: true }) channelId: number,
  ) {
    return this.pubSub.asyncIterator('messageUpdated');
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MessageResult)
  async deleteMessage(
    @Args('messageId') messageId: number,
    @Args('conversationId', { nullable: true }) conversationId: number,
    @Args('channelId', { nullable: true }) channelId: number,
    @Context() ctx: { req: Request },
  ) {
    if (!conversationId && !channelId)
      throw new ApolloError(
        'Missing conversationId or channelId',
        'MISSING_CONVERSATION_ID_OR_CHANNEL_ID',
      );

    const profile = await this.profileService.getProfileByEmail(
      ctx.req.profile.email,
    );
    const deletedMessage = await this.chatService.deleteMessage(
      messageId,
      conversationId,
      channelId,
      profile.id,
    );
    this.pubSub.publish('messageDeleted', {
      messageDeleted: deletedMessage,
      conversationId,
      channelId,
    });
    return deletedMessage;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MessageResult)
  async updateMessage(
    @Args('messageId') messageId: number,
    @Args('serverId') serverId: number,
    @Args('content') content: string,
    @Context() ctx: { req: Request },
    @Args('conversationId', { nullable: true }) conversationId: number,
    @Args('channelId', { nullable: true }) channelId: number,
  ) {
    const member = await this.memberService.getMemberByEmail(
      ctx.req.profile.email,
      serverId,
    );
    if (!member) return new ApolloError('Member not found', 'MEMBER_NOT_FOUND');

    const updatedMessage = await this.chatService.updateMessage(
      messageId,
      member.id,
      content,
      channelId,
      conversationId,
    );
    this.pubSub.publish('messageUpdated', {
      messageUpdated: updatedMessage,
    });
    return updatedMessage;
  }
}
