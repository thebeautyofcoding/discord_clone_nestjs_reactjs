import React from "react"
import ChatWindow from "../components/modals/server/chat/ChatWindow"
import { useParams } from "react-router-dom"
import { ChannelType } from "../gql/graphql"

function ChannelPage() {
  const { channelId, channelType } = useParams<{
    channelId: string
    channelType: ChannelType
  }>()

  return (
    <>
      <ChatWindow
        chatName={channelId}
        chatType="channel"
        channelType={channelType}
      />
    </>
  )
}

export default ChannelPage
