import React from "react"
import TextInputSection from "./TextInputSection"
import ChatHeader from "./ChatHeader"
import { useGeneralStore } from "../../../../stores/generalStore"
import { ChannelType } from "../../../../gql/graphql"
import { useParams } from "react-router-dom"
import { useMessageData } from "../../../../hooks/graphql/server/message/useMessageData"
import { Flex, Paper, rem } from "@mantine/core"
import ChatMessages from "../../../chat/ChatMessages"
import { useMessageCreatedSubscription } from "../../../../hooks/graphql/server/chat/useMessageCreatedSubscription"
import MediaRoom from "../../../chat/media/MediaRoom"
import { useMediaQuery } from "@mantine/hooks"

function ChatWindow({
  chatName,
  chatType,
  channelType,
}: {
  chatName: string | undefined
  chatType: "channel" | "conversation"
  channelType?: ChannelType | undefined
}) {
  const { drawerOpen, toggleDrawer } = useGeneralStore((state) => state)
  const { conversationId } = useParams<{ conversationId: string }>()
  const { createMessage, messages, channelId } = useMessageData()
  useMessageCreatedSubscription()
  const isSmallerThanLg = useMediaQuery("(max-width: 1350px)")
  return (
    <>
      <ChatHeader opened={drawerOpen} toggle={toggleDrawer} type={chatType} />
      <Flex
        justify={"center"}
        align={"center"}
        direction="column"
        pt={rem(60)}
        h={"calc(100vh - 80px )"}
        w={drawerOpen ? "calc(100vw -420px)" : "calc(100vw -80px)"}
        ml={drawerOpen ? rem(420) : rem(80)}
        miw="60vw"
      >
        <Paper m="0" p="0" h={"calc(100% - 60px)"} w="100%">
          <Flex>
            {channelType === ChannelType.Text && (
              <Flex direction="column" mr="md" w="100%">
                <ChatMessages messages={messages} channelId={channelId} />
                <Flex mt="md" w="100%" align="center" justify={"center"}>
                  <TextInputSection
                    conversationId={Number(conversationId)}
                    channelId={channelId}
                    createMessage={createMessage}
                  />
                </Flex>
              </Flex>
            )}
            {channelType === ChannelType.Video && (
              <>
                <Flex w={"100%"}>
                  <MediaRoom chatId={chatName} audio={true} video={false} />
                </Flex>
                {!isSmallerThanLg && !drawerOpen && (
                  <Flex direction="column" mr="md" w="100%">
                    <ChatMessages messages={messages} channelId={channelId} />
                    <Flex
                      mt="md"
                      ml="md"
                      px="md"
                      w="100%"
                      align="center"
                      justify={"start"}
                    >
                      <TextInputSection
                        conversationId={Number(conversationId)}
                        channelId={channelId}
                        createMessage={createMessage}
                      />
                    </Flex>
                  </Flex>
                )}
              </>
            )}
            {channelType === ChannelType.Audio && (
              <>
                <Flex>
                  <MediaRoom chatId={chatName} audio={true} video={false} />
                </Flex>
                {!isSmallerThanLg && (
                  <Flex direction="column" mr="md" w="100%">
                    <ChatMessages messages={messages} channelId={channelId} />
                    <Flex mt="md" w="100%" align="center" justify={"center"}>
                      <TextInputSection
                        conversationId={Number(conversationId)}
                        channelId={channelId}
                        createMessage={createMessage}
                      />
                    </Flex>
                  </Flex>
                )}
              </>
            )}
            {chatType === "conversation" && (
              <>
                <Flex direction="column" mr="md" w="100%">
                  <ChatMessages messages={messages} channelId={channelId} />
                  <Flex mt="md" w="100%" align="center" justify={"center"}>
                    <TextInputSection
                      conversationId={Number(conversationId)}
                      channelId={channelId}
                      createMessage={createMessage}
                    />
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
        </Paper>
      </Flex>
    </>
  )
}

export default ChatWindow
