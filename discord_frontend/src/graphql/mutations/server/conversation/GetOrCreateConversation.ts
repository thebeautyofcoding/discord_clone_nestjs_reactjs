import { gql } from "@apollo/client"

export const GET_OR_CREATE_CONVERSATION = gql`
  mutation GetOrCreateConversation($memberOneId: Float, $memberTwoId: Float) {
    getOrCreateConversation(
      memberOneId: $memberOneId
      memberTwoId: $memberTwoId
    ) {
      id
      memberOneId
      memberTwoId
      memberOne {
        profile {
          id
          name
          email
          imageUrl
        }
      }
      memberTwo {
        profile {
          id
          name
          email
          imageUrl
        }
      }
    }
  }
`
