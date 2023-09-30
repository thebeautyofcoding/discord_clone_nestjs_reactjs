import { gql } from "@apollo/client"

export const UPDATE_SERVER = gql`
  mutation UpdateServer($input: UpdateServerDto!, $file: Upload) {
    updateServer(input: $input, file: $file) {
      id

      name
      imageUrl
    }
  }
`
