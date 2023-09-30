import { gql } from "@apollo/client"

export const CREATE_PROFILE = gql`
  mutation CreateProfile($input: CreateProfileDto!) {
    createProfile(input: $input) {
      id
      imageUrl
      name
      email
    }
  }
`
