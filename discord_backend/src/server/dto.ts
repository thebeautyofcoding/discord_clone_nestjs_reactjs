import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';
import { ChannelType } from './types';

@InputType()
export class CreateServerDto {
  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field()
  profileId: number;
}

@InputType()
export class UpdateServerDto {
  @IsString()
  @Field()
  name: string;

  @Field({ nullable: true })
  serverId: number;
}

@InputType()
export class CreateChannelOnServerDto {
  @IsString()
  @Field()
  name: string;

  @IsInt()
  @Field({ nullable: true })
  serverId: number;

  @IsString()
  @Field()
  type: ChannelType;
}
