import { gql } from "@apollo/client"

export const ADD_MEMBER = gql`
  mutation AddMember($inviteCode: String!) {
    addMemberToServer(inviteCode: $inviteCode) {
      id
    }
  }
`
