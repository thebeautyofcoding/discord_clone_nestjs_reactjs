import { gql } from "@apollo/client"

export const MESSAGE_CREATED = gql`
  subscription MessageCreated($conversationId: Float, $channelId: Float) {
    messageCreated(conversationId: $conversationId, channelId: $channelId) {
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
