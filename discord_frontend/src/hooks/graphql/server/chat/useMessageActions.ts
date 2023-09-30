import { useParams } from "react-router-dom"
import {
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  MessageUnion,
} from "../../../../gql/graphql"
import { useMessageStore } from "../../../../stores/messageStore"
import { useModal } from "../../../useModal"
import { useMutation } from "@apollo/client"
import { DELETE_MESSAGE } from "../../../../graphql/mutations/server/message/DeleteMessage"

export const useMessageActions = (message: MessageUnion) => {
  const updateMessageModal = useModal("UpdateMessage")
  const setMessage = useMessageStore((s) => s.setMessage)

  const { channelId, conversationId } = useParams()

  const [deleteMessage] = useMutation<
    DeleteMessageMutation,
    DeleteMessageMutationVariables
  >(DELETE_MESSAGE, {
    variables: {
      messageId: Number(message.id),
      conversationId: conversationId ? parseInt(conversationId) : null,
      channelId: channelId ? parseInt(channelId) : null,
    },
  })

  const handleUpdateMessage = () => {
    updateMessageModal.openModal()
    setMessage(message)
  }

  const handleDeleteMessage = () => {
    deleteMessage()
  }

  return {
    handleUpdateMessage,
    handleDeleteMessage,
  }
}
