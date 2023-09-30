import gql from "graphql-tag"

export const MESSAGE_UPDATED = gql`
  subscription MessageUpdated($conversationId: Float, $channelId: Float) {
    messageUpdated(conversationId: $conversationId, channelId: $channelId) {
      message {
        ... on DirectMessage {
          id
          content
          updatedAt
          createdAt
          conversationId
          fileUrl
          deleted
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
          createdAt
          updatedAt
          fileUrl
          deleted
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
