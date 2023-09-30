import { useQuery } from "@apollo/client"
import {
  GetCurrentMemberQuery,
  GetCurrentMemberQueryVariables,
  MemberRole,
  MessageUnion,
} from "../../../../gql/graphql"
import { GET_CURRENT_MEMBER } from "../../../../graphql/queries/GetCurrentMember"

export function useMessagePermissions(
  message: MessageUnion,
  profileId: number | undefined,
  serverId: number
) {
  const { data } = useQuery<
    GetCurrentMemberQuery,
    GetCurrentMemberQueryVariables
  >(GET_CURRENT_MEMBER, {
    variables: {
      serverId,
      profileId,
    },
  })

  const canDeleteMessage =
    message.member.id === data?.getCurrentMember.id ||
    data?.getCurrentMember.role === MemberRole.Admin ||
    data?.getCurrentMember.role === MemberRole.Moderator

  const canUpdateMessage = message.member?.id === data?.getCurrentMember.id

  return { canDeleteMessage, canUpdateMessage }
}
