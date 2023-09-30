import { gql } from "@apollo/client"

export const GET_SERVERS = gql`
  query GetServers {
    getServers {
      id
      name
      imageUrl
    }
  }
`
