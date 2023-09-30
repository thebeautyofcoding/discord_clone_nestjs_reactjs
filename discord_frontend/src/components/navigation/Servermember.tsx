import React from "react"
import {
  GetOrCreateConversationMutation,
  GetOrCreateConversationMutationVariables,
  Member,
  MemberRole,
  Profile,
} from "../../gql/graphql"
import { Image, NavLink, rem } from "@mantine/core"
import { IconCrown, IconShieldCheck } from "@tabler/icons-react"
import { useMutation } from "@apollo/client"
import { GET_OR_CREATE_CONVERSATION } from "../../graphql/mutations/server/conversation/GetOrCreateConversation"
import { useConversation } from "../../hooks/graphql/server/conversation/useConversation"
import { useNavigate } from "react-router-dom"

type ServerMemberProps = {
  member: Member & { profile: Profile }

  isActive: boolean
}

const roleIconMap = {
  [MemberRole.Guest]: null,
  [MemberRole.Moderator]: <IconShieldCheck size="15" />,
  [MemberRole.Admin]: <IconCrown size="15" />,
}

function Servermember({ member, isActive }: ServerMemberProps) {
  const { getOrCreateConversation } = useConversation(member?.id)
  const navigate = useNavigate()

  return (
    <NavLink
      w={rem(260)}
      ml="md"
      onClick={() => {
        getOrCreateConversation({
          onCompleted: (data) => {
            navigate(
              `/servers/${member?.server?.id}/conversations/${data.getOrCreateConversation.id}/members/TEXT/${member?.id}`
            )
          },
        })
      }}
      active={isActive}
      label={member?.profile?.name}
      leftSection={
        <Image
          w={rem(25)}
          h={rem(25)}
          radius={25}
          src={member?.profile?.imageUrl}
        />
      }
      rightSection={roleIconMap[member?.role]}
    />
  )
}

export default Servermember
