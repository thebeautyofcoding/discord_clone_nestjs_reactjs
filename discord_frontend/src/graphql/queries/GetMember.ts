import { gql } from "@apollo/client"

export const GET_MEMBER = gql`
  query GetMember($memberId: Float, $serverId: Float) {
    getMember(memberId: $memberId, serverId: $serverId) {
      id
      role
      profile {
        id
        name
        email
        imageUrl
        servers {
          id
          name
          channels {
            id
            name
            type
          }
        }
      }
    }
  }
`
