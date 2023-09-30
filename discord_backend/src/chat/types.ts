import { Field, ID, ObjectType, createUnionType } from '@nestjs/graphql';
import { Member } from 'src/member/member.types';
import { Channel } from 'src/server/types';

@ObjectType()
export class Conversation {
  @Field()
  id: number;

  @Field()
  memberOneId: number;

  @Field()
  memberTwoId: number;

  @Field(() => Member)
  memberOne: Member;

  @Field(() => Member)
  memberTwo: Member;

  @Field(() => [DirectMessage])
  messages: DirectMessage[];
}

@ObjectType()
export class DirectMessage {
  @Field(() => ID)
  id: number;

  @Field()
  conversationId: number;

  @Field(() => Conversation)
  conversation: Conversation;

  @Field()
  memberId: number;

  @Field(() => Member)
  member: Member;

  @Field()
  content: string;

  @Field({ nullable: true })
  fileUrl: string;

  @Field()
  deleted: boolean;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class Message {
  @Field(() => ID)
  id: number;

  @Field()
  content: string;

  @Field({ nullable: true })
  fileUrl: string;

  @Field()
  deleted: boolean;

  @Field(() => Channel)
  channel: Channel;

  @Field(() => Member)
  member: Member;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

export const MessageUnion = createUnionType({
  name: 'MessageUnion',
  types: () => [Message, DirectMessage],
  resolveType(value) {
    if ('conversationId' in value) return DirectMessage;
    return Message;
  },
});

@ObjectType()
export class MessageResult {
  @Field(() => MessageUnion)
  message: typeof MessageUnion;
}

@ObjectType()
export class MessagesResult {
  @Field(() => [MessageUnion])
  messages: (typeof MessageUnion)[];
}
