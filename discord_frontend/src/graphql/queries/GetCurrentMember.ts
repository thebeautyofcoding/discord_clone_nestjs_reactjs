import { gql } from "@apollo/client"

export const GET_CURRENT_MEMBER = gql`
  query GetCurrentMember($profileId: Float, $serverId: Float) {
    getCurrentMember(profileId: $profileId, serverId: $serverId) {
      id
      role
      profile {
        id
        name
        email
      }
    }
  }
`
