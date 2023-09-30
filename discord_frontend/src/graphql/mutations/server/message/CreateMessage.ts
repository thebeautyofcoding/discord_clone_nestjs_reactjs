import { gql } from "@apollo/client"

export const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $content: String
    $conversationId: Float
    $channelId: Float
    $file: Upload
  ) {
    createMessage(
      content: $content
      conversationId: $conversationId
      channelId: $channelId
      file: $file
    ) {
      message {
        ... on DirectMessage {
          id
          content
          deleted
          createdAt
          updatedAt
          conversationId
          fileUrl
          member {
            role
            id
            profileId
            profile {
              email
              id
              name
              imageUrl
            }
          }
        }
        ... on Message {
          id
          content
          deleted
          createdAt
          updatedAt
          fileUrl
          channel {
            id
          }
          member {
            role
            id
            profileId
            profile {
              email
              id
              name
              imageUrl
            }
          }
        }
      }
    }
  }
`
