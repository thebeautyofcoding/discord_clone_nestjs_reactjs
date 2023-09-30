import { gql } from "@apollo/client"

export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage(
    $messageId: Float!
    $serverId: Float!
    $content: String!
    $conversationId: Float
    $channelId: Float
  ) {
    updateMessage(
      messageId: $messageId
      serverId: $serverId
      content: $content
      conversationId: $conversationId
      channelId: $channelId
    ) {
      message {
        ... on DirectMessage {
          content
          createdAt
          updatedAt
          deleted
        }
        ... on Message {
          content
          createdAt
          updatedAt
          deleted
        }
      }
    }
  }
`
