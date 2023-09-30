import { useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"
import {
  GetMemberQuery,
  GetMemberQueryVariables,
} from "../../../../gql/graphql"
import { GET_MEMBER } from "../../../../graphql/queries/GetMember"

export const useMember = () => {
  const { memberId, serverId } = useParams()

  const { data } = useQuery<GetMemberQuery, GetMemberQueryVariables>(
    GET_MEMBER,
    {
      variables: {
        memberId: Number(memberId),
        serverId: Number(serverId),
      },
      skip: !memberId || !serverId,
    }
  )
  return data?.getMember
}
