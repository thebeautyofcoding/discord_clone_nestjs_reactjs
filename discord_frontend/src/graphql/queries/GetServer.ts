import { gql } from "@apollo/client"

export const GET_SERVER = gql`
  query GetServer($id: Float) {
    getServer(id: $id) {
      id
      profileId
      name
      imageUrl
      inviteCode
      channels {
        id
        type
        name
      }

      members {
        id

        server {
          id
        }
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
      profile {
        id
        name
        imageUrl
        email
      }
    }
  }
`
