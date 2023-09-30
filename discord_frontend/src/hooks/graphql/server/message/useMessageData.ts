import { useMutation, useQuery } from "@apollo/client"
import {
  CreateMessageMutation,
  CreateMessageMutationVariables,
  GetMessagesQuery,
  GetMessagesQueryVariables,
} from "../../../../gql/graphql"
import { CREATE_MESSAGE } from "../../../../graphql/mutations/server/message/CreateMessage"
import { useParams } from "react-router-dom"
import { GET_MESSAGES } from "../../../../graphql/queries/GetMessages"

export function useMessageData() {
  const [createMessage] = useMutation<
    CreateMessageMutation,
    CreateMessageMutationVariables
  >(CREATE_MESSAGE)

  const { memberId: membId, channelId: chanId, conversationId } = useParams()

  const memberId = Number(membId)
  const channelId = Number(chanId)

  const { data: dataGetMessages } = useQuery<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >(GET_MESSAGES, {
    variables: {
      conversationId: Number(conversationId),
      channelId,
    },
  })

  return {
    memberId,
    channelId,
    createMessage,
    messages: dataGetMessages?.getMessages.messages,
  }
}
