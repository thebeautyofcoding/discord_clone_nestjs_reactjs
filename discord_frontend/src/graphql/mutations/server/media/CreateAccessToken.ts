import { gql } from "@apollo/client"

export const CREATE_ACCESS_TOKEN = gql`
  mutation CreateAccessToken($identity: String, $chatId: String) {
    createAccessToken(identity: $identity, chatId: $chatId)
  }
`
