import { gql } from "@apollo/client"

export const DELETE_CHANNEL = gql`
  mutation DeleteChannel($channelId: Float) {
    deleteChannelFromServer(channelId: $channelId)
  }
`
