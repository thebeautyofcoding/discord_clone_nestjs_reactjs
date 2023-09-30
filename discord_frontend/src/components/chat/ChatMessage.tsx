import { ChannelType, MemberRole, MessageUnion } from "../../gql/graphql"
import { Flex, Image, Stack, Text, rem } from "@mantine/core"
import classes from "./ChatMessage.module.css"
import { useParams } from "react-router-dom"

import { useToggleDrawer } from "../../hooks/useToggleDrawer"
import { IconCrown, IconShieldCheck } from "@tabler/icons-react"
import MessageActions from "./MessageActions"
import { useMessagePermissions } from "../../hooks/graphql/server/chat/useMessagePermissions"
import { useProfileStore } from "../../stores/profileStore"
import { useMessageCacheUpdate } from "../../hooks/graphql/server/chat/useMessageCacheUpdate"
import { useMessageActions } from "../../hooks/graphql/server/chat/useMessageActions"

function ChatMessage({ message }: { message: MessageUnion }) {
  const { channelType, serverId } = useParams()
  const profileId = useProfileStore((state) => state.profile?.id)
  const { drawerOpen } = useToggleDrawer()
  const { canUpdateMessage, canDeleteMessage } = useMessagePermissions(
    message,
    profileId,
    Number(serverId)
  )
  const IconRoleMap = {
    [MemberRole.Guest]: null,
    [MemberRole.Moderator]: <IconShieldCheck />,
    [MemberRole.Admin]: <IconCrown color="green" />,
  }

  useMessageCacheUpdate(Number(message.id))

  const { handleDeleteMessage, handleUpdateMessage } =
    useMessageActions(message)

  return (
    <Flex
      className={
        channelType !== ChannelType.Text && !drawerOpen
          ? classes.messageContainerWithMediaDrawerClosed
          : classes.messageContainerNoMedia
      }
      my="md"
      p="md"
    >
      <Flex justify="center" align="center">
        <Image
          w={rem(30)}
          h={rem(30)}
          radius={rem(30)}
          mr="md"
          src={message.member.profile?.imageUrl}
        />
        <Stack gap="0">
          <Flex justify={"start"} align="center">
            <Text
              className={
                channelType === ChannelType.Text
                  ? classes.profileNameNoMedia
                  : classes.profileNameWithMedia
              }
              fw={700}
            >
              {message?.member?.profile?.name}
            </Text>
            <Flex ml="sm" align="center">
              {message?.member?.role && IconRoleMap[message?.member?.role]}
            </Flex>
            <Text ml="sm" c="dimmed" size="sm" truncate>
              {new Date(Number(message?.updatedAt)).toLocaleTimeString()}
            </Text>
          </Flex>

          {!message.deleted ? (
            <Stack>
              <Text
                className={
                  channelType !== ChannelType.Text && !drawerOpen
                    ? classes.contentWithMediaDrawerClosed
                    : channelType === ChannelType.Text && drawerOpen
                    ? classes.contentNoMediaDrawerOpen
                    : channelType === ChannelType.Text && !drawerOpen
                    ? classes.contentNoMediaDrawerClosed
                    : classes.contentWithMediaDrawerOpen
                }
              >
                {message.content}
              </Text>
              {message.fileUrl && (
                <Image
                  mt="sm"
                  src={message.fileUrl}
                  w={rem(100)}
                  h={rem(100)}
                  fit="cover"
                  radius="md"
                />
              )}
            </Stack>
          ) : (
            <Text c="dimmed" size="sm">
              {message.content}
            </Text>
          )}
        </Stack>
      </Flex>
      {!message.deleted && (
        <MessageActions
          canUpdateMessage={canUpdateMessage}
          canDeleteMessage={canDeleteMessage}
          handleDeleteMessage={handleDeleteMessage}
          handleUpdateMessage={handleUpdateMessage}
        />
      )}
    </Flex>
  )
}

export default ChatMessage
