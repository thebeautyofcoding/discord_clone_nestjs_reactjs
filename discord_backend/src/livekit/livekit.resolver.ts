import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LivekitService } from './livekit.service';

@Resolver()
export class LivekitResolver {
  constructor(private readonly livekitService: LivekitService) {}

  @Mutation(() => String)
  async createAccessToken(
    @Args('identity', { nullable: true }) identity: string,
    @Args('chatId', { nullable: true }) chatId: string,
  ) {
    try {
      return await this.livekitService.createAccessToken(identity, chatId);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
