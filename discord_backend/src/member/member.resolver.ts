import { Args, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/auth.guard';
import { ApolloError } from 'apollo-server-express';
import { Member } from './member.types';
@UseGuards(GraphqlAuthGuard)
@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @Query(() => Member)
  async getMember(
    @Args('memberId', { nullable: true }) memberId: number,
    @Args('serverId', { nullable: true }) serverId: number,
  ) {
    try {
      return await this.memberService.getMember(memberId, serverId);
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }

  @Query(() => Member)
  async getCurrentMember(
    @Args('profileId', { nullable: true }) profileId: number,
    @Args('serverId', { nullable: true }) serverId: number,
  ) {
    try {
      return await this.memberService.getCurrentMember(profileId, serverId);
    } catch (err) {
      throw new ApolloError(err.message, err.code);
    }
  }
}
