import { useParams } from "react-router-dom"
import { useProfileStore } from "../../../../stores/profileStore"
import { useMutation, useQuery } from "@apollo/client"
import {
  GetCurrentMemberQuery,
  GetCurrentMemberQueryVariables,
  GetOrCreateConversationMutation,
  GetOrCreateConversationMutationVariables,
} from "../../../../gql/graphql"
import { GET_CURRENT_MEMBER } from "../../../../graphql/queries/GetCurrentMember"

import { GET_OR_CREATE_CONVERSATION } from "../../../../graphql/mutations/server/conversation/GetOrCreateConversation"

export function useConversation(memberId: number) {
  const { serverId } = useParams<{
    serverId: string
  }>()

  const profileId = useProfileStore((state) => state.profile?.id)

  const { data: dataCurrentMember } = useQuery<
    GetCurrentMemberQuery,
    GetCurrentMemberQueryVariables
  >(GET_CURRENT_MEMBER, {
    variables: {
      profileId: Number(profileId),
      serverId: Number(serverId),
    },
  })

  const [getOrCreateConversation, { data: dataConversation }] = useMutation<
    GetOrCreateConversationMutation,
    GetOrCreateConversationMutationVariables
  >(GET_OR_CREATE_CONVERSATION, {
    variables: {
      memberOneId: Number(memberId),
      memberTwoId: dataCurrentMember?.getCurrentMember?.id,
    },
  })

  return {
    conversation: dataConversation?.getOrCreateConversation,
    getOrCreateConversation,
    currentMember: dataCurrentMember?.getCurrentMember,
  }
}
