import { gql } from "@apollo/client"

export const DELETE_MEMBER = gql`
  mutation DeleteMember($memberId: Float) {
    deleteMember(memberId: $memberId) {
      id
      name
      imageUrl
      members {
        id
        role
        profileId
        profile {
          id
          name
          imageUrl
          email
        }
      }
    }
  }
`
