import { gql } from "@apollo/client"

export const CREATE_CHANNEL = gql`
  mutation CreateChannel($input: CreateChannelOnServerDto!) {
    createChannel(input: $input) {
      id
      name
      imageUrl
      members {
        id
      }
    }
  }
`
