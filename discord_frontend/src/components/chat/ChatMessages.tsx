import ChatMessage from "./ChatMessage"
import { ChannelType, MessageUnion } from "../../gql/graphql"
import { useServer } from "../../hooks/graphql/server/useServer"
import { useParams } from "react-router-dom"
import { useToggleDrawer } from "../../hooks/useToggleDrawer"
import { ScrollArea } from "@mantine/core"
import classes from "./ChatMessages.module.css"

import { useScrollToBottom } from "../../hooks/useScrollToBottom"

import { useMember } from "../../hooks/graphql/server/chat/useMember"
import WelcomeMessage from "./WelcomeMessage"

function ChatMessages({
  channelId,
  messages,
}: {
  channelId?: number | undefined
  messages: MessageUnion[] | undefined
}) {
  const { channelType } = useParams()
  const { server } = useServer()
  const channel = server?.channels.find((channel) => channel.id === channelId)
  const isMediaChannel =
    channelType === ChannelType.Video || channelType === ChannelType.Audio

  const { drawerOpen } = useToggleDrawer()

  const { viewport, scrollToBottom } = useScrollToBottom(messages?.length)

  const member = useMember()

  return (
    <ScrollArea
      viewportRef={viewport}
      className={
        drawerOpen && !isMediaChannel
          ? classes.scrollAreaNoMediaDrawerOpen
          : !drawerOpen && !isMediaChannel
          ? classes.scrollAreaNoMediaDrawerClosed
          : drawerOpen && isMediaChannel
          ? classes.scrollAreaWithMediaDrawerOpen
          : classes.scrollAreaWithMediaDrawerClosed
      }
      onLoad={scrollToBottom}
      ml="md"
      type="always"
      w={"100%"}
      p="md"
      h={"calc(100vh - 220px)"}
    >
      {member?.profile?.name && (
        <WelcomeMessage type="conversation" name={member?.profile?.name} />
      )}
      {channel?.name && <WelcomeMessage type="channel" name={channel.name} />}

      {messages?.map((message) => (
        <ChatMessage message={message} key={message.id} />
      ))}
    </ScrollArea>
  )
}

export default ChatMessages
