import { gql } from "@apollo/client"

export const CHANGE_MEMBER_ROLE = gql`
  mutation ChangeMemberRole($memberId: Float, $role: String!) {
    changeMemberRole(memberId: $memberId, role: $role) {
      id
      name
      imageUrl
      members {
        id
        role
      }
    }
  }
`
