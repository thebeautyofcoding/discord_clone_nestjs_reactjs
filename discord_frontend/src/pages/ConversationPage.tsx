import React from "react"
import ChatWindow from "../components/modals/server/chat/ChatWindow"
import { Outlet, useParams } from "react-router-dom"

function ConversationPage() {
  const { conversationId } = useParams()
  return (
    <>
      <ChatWindow chatName={conversationId} chatType="conversation" />
    </>
  )
}

export default ConversationPage
