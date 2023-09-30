import { gql } from "@apollo/client"

export const MESSAGE_DELETED = gql`
  subscription MessageDeleted($conversationId: Float, $channelId: Float) {
    messageDeleted(conversationId: $conversationId, channelId: $channelId) {
      message {
        ... on DirectMessage {
          id
          content
          deleted
          conversationId
          updatedAt
          createdAt
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
          updatedAt
          createdAt
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
