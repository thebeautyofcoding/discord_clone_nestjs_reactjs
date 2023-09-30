import { gql } from "@apollo/client"

export const UPDATE_SERVER_WITH_NEW_INVITE_CODE = gql`
  mutation UpdateServerWithNewInviteCode($serverId: Float) {
    updateServerWithNewInviteCode(serverId: $serverId) {
      id
      name
      imageUrl

      inviteCode
    }
  }
`
