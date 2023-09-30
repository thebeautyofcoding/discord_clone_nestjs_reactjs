import { Flex } from "@mantine/core"
import React from "react"
import MessageButton from "./MessageButton"

function MessageActions({
  canUpdateMessage,
  canDeleteMessage,
  handleUpdateMessage,
  handleDeleteMessage,
}: {
  canUpdateMessage: boolean
  canDeleteMessage: boolean
  handleUpdateMessage: () => void
  handleDeleteMessage: () => void
}) {
  return (
    <Flex id="actions69" w="100%" justify="center" align="center">
      {canDeleteMessage && (
        <MessageButton type="delete" onClick={handleDeleteMessage} />
      )}
      {canUpdateMessage && (
        <MessageButton type="update" onClick={handleUpdateMessage} />
      )}
    </Flex>
  )
}

export default MessageActions
