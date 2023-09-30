import { useMutation } from "@apollo/client"
import { useProfileStore } from "../../../../stores/profileStore"
import {
  CreateAccessTokenMutation,
  CreateAccessTokenMutationVariables,
} from "../../../../gql/graphql"
import { CREATE_ACCESS_TOKEN } from "../../../../graphql/mutations/server/media/CreateAccessToken"
import { useEffect } from "react"

export const useLivekitAccessToken = (chatId: string | undefined) => {
  const name = useProfileStore((state) => state.profile?.name)

  const [createToken, { data, loading }] = useMutation<
    CreateAccessTokenMutation,
    CreateAccessTokenMutationVariables
  >(CREATE_ACCESS_TOKEN, {
    variables: {
      identity: name,
      chatId,
    },
  })

  useEffect(() => {
    createToken()
  }, [createToken, chatId, name])
  return { token: data?.createAccessToken, loading }
}
