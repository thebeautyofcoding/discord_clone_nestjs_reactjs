import { useApolloClient, useSubscription } from "@apollo/client"
import { useParams } from "react-router-dom"
import {
  GetMessagesQuery,
  MessageDeletedSubscription,
  MessageDeletedSubscriptionVariables,
  MessageUnion,
  MessageUpdatedSubscription,
  MessageUpdatedSubscriptionVariables,
} from "../../../../gql/graphql"
import { MESSAGE_UPDATED } from "../../../../graphql/subscriptions/MessageUpdated"
import { MESSAGE_DELETED } from "../../../../graphql/subscriptions/MessageDeleted"
import { useEffect } from "react"
import { GET_MESSAGES } from "../../../../graphql/queries/GetMessages"

export function useMessageCacheUpdate(messageId: number | undefined) {
  const params = useParams()

  const { cache } = useApolloClient()

  const channelId = params.channelId ? parseInt(params.channelId) : null
  const conversationId = params.conversationId
    ? parseInt(params.conversationId)
    : null

  const { data: dataMessageUpdated } = useSubscription<
    MessageUpdatedSubscription,
    MessageUpdatedSubscriptionVariables
  >(MESSAGE_UPDATED, {
    variables: { conversationId, channelId },
    skip: !conversationId && !channelId,
    onError: (err) => {
      console.log(err)
    },
  })

  const { data: dataMessageDeleted } = useSubscription<
    MessageDeletedSubscription,
    MessageDeletedSubscriptionVariables
  >(MESSAGE_DELETED, {
    variables: { conversationId, channelId },
    skip: !conversationId && !channelId,
  })

  useEffect(() => {
    if (dataMessageUpdated?.messageUpdated?.message?.id === String(messageId)) {
      const cachedData = cache.readQuery<GetMessagesQuery>({
        query: GET_MESSAGES,
        variables: {
          conversationId,
          channelId,
        },
      })

      const updatedMessages = cachedData?.getMessages.messages?.map(
        (message) => {
          console.log("message", message)
          if (!message) return message
          if (message.id === dataMessageUpdated?.messageUpdated?.message?.id) {
            const timestamp = new Date(
              dataMessageUpdated?.messageUpdated?.message?.updatedAt
            ).getTime()
            const updatedMessage = {
              ...dataMessageUpdated?.messageUpdated?.message,
              updatedAt: timestamp,
            }
            return updatedMessage
          }
          return message
        }
      )

      cache.writeQuery<GetMessagesQuery>({
        query: GET_MESSAGES,
        variables: {
          conversationId,
          channelId,
        },
        data: {
          getMessages: {
            messages: updatedMessages as MessageUnion[],
          },
        },
      })
    }
  }, [dataMessageUpdated, cache, channelId, conversationId, messageId])

  useEffect(() => {
    console.log("date69", dataMessageDeleted?.messageDeleted?.message.id)
    if (dataMessageDeleted?.messageDeleted?.message?.id === String(messageId)) {
      const cachedData = cache.readQuery<GetMessagesQuery>({
        query: GET_MESSAGES,
        variables: {
          conversationId,
          channelId,
        },
      })
      const updatedMessages = cachedData?.getMessages.messages?.map(
        (message) => {
          if (!message) return message
          const timestamp = new Date(
            dataMessageDeleted?.messageDeleted?.message?.updatedAt
          ).getTime()
          console.log("timestamp69", timestamp)
          const updatedMessage = {
            ...dataMessageDeleted?.messageDeleted?.message,
            updatedAt: timestamp,
          }
          return message.id === dataMessageDeleted?.messageDeleted?.message?.id
            ? updatedMessage
            : message
        }
      )

      cache.writeQuery<GetMessagesQuery>({
        query: GET_MESSAGES,
        variables: {
          conversationId,
          channelId,
        },
        data: {
          getMessages: {
            messages: updatedMessages as MessageUnion[],
          },
        },
      })
    }
  }, [
    dataMessageDeleted,
    cache,
    channelId,
    conversationId,
    messageId,
    dataMessageDeleted?.messageDeleted?.message?.id,
  ])
}
