import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateChannelOnServerDto,
  CreateServerDto,
  UpdateServerDto,
} from './dto';
import { v4 as uuidv4 } from 'uuid';
import { Member, MemberRole } from 'src/member/member.types';
import { ApolloError } from 'apollo-server-express';
import { ChannelType } from './types';
@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async createServer(input: CreateServerDto, imageUrl: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: input.profileId,
      },
    });
    if (!profile) throw new BadRequestException('Profile not found');

    return this.prisma.server.create({
      data: {
        ...input,
        imageUrl,
        inviteCode: uuidv4(),

        channels: {
          create: [
            {
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },

      include: {
        members: true,
      },
    });
  }

  async getServer(id: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });

    if (!profile)
      return new ApolloError('Profile not found', 'PROFILE_NOT_FOUND');

    const server = await this.prisma.server.findUnique({
      where: {
        id,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: true,
        members: {
          include: {
            profile: true,
            server: true,
          },
        },
      },
    });
    if (!server) return new ApolloError('Server not found', 'SERVER_NOT_FOUND');
    return server;
  }

  async getServersByProfileEmailOfMember(email: string) {
    console.log(
      email,
      await this.prisma.server.findMany({
        where: {
          members: {
            some: {
              profile: {
                email,
              },
            },
          },
        },
      }),
    );
    return await this.prisma.server.findMany({
      where: {
        members: {
          some: {
            profile: {
              email,
            },
          },
        },
      },
    });
  }
  async updateServerWithNewInviteCode(serverId: number) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });

    if (!server) throw Error('Server not found');

    return this.prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
  }

  async updateServer(input: UpdateServerDto, imageUrl: string) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: input.serverId,
      },
    });
    if (!server) throw Error('Server not found');
    return this.prisma.server.update({
      where: {
        id: server.id,
      },
      data: {
        name: input.name,
        imageUrl,
      },
    });
  }

  async createChannel(input: CreateChannelOnServerDto, email: string) {
    if (!input.name) throw new Error('Channel name is required');

    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');

    return this.prisma.server.update({
      where: {
        id: input.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name: input.name,
            profileId: profile.id,
            type: ChannelType[input.type],
          },
        },
      },
    });
  }

  async leaveServer(serverId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    console.log('serverId69', serverId, email);
    if (!profile) throw new Error('Profile not found');
    return this.prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  }

  async deleteServer(serverId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');

    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN],
            },
          },
        },
      },
    });

    if (!server) throw new Error('Server not found');
    await this.prisma.server.delete({
      where: {
        id: serverId,
      },
    });

    return 'Server deleted successfully';
  }

  async deleteChannelFromServer(channelId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        profileId: profile.id,
        NOT: {
          name: 'general',
        },
      },
    });

    if (!channel) throw new Error('Channel not found');
    await this.prisma.channel.delete({
      where: {
        id: channelId,
      },
    });
    return 'Channel deleted successfully';
  }

  async addMemberToServer(inviteCode: string, email: string) {
    const server = await this.prisma.server.findUnique({
      where: {
        inviteCode,
      },
    });
    if (!server) throw new Error('Server not found');

    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });

    if (!profile) throw new Error('Profile not found');

    const member = await this.prisma.member.findFirst({
      where: {
        serverId: server.id,
        profileId: profile.id,
      },
    });

    if (member) return new Error('Member already exists');

    return this.prisma.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId: profile.id,
            },
          ],
        },
      },
    });
  }

  async changeMemberRole(memberId, role: MemberRole, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new Error('Member not found');
    await this.prisma.member.update({
      where: {
        id: member.id,
        NOT: {
          profileId: member.id,
        },
      },
      data: {
        role: MemberRole[role],
      },
    });
    const server = await this.prisma.server.findUnique({
      where: {
        id: member.serverId,
      },
      include: {
        members: true,
      },
    });
    if (!server) throw new Error('Server not found');
    return server;
  }

  async deleteMember(memberId: number, email) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        email,
      },
    });
    if (!profile) throw new Error('Profile not found');
    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });
    await this.prisma.member.delete({
      where: {
        id: member.id,
        NOT: {
          profileId: profile.id,
        },
      },
    });
    const server = await this.prisma.server.findUnique({
      where: {
        id: member.serverId,
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!server) throw new Error('Server not found');
    return server;
  }
}
