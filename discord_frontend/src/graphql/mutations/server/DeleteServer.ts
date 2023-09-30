import { gql } from "@apollo/client"

export const DELETE_SERVER = gql`
  mutation DeleteServer($serverId: Float) {
    deleteServer(serverId: $serverId)
  }
`
