import React from "react"
import { Channel, ChannelType, MemberRole, Server } from "../../gql/graphql"
import {
  IconCamera,
  IconHash,
  IconMessage,
  IconMicrophone,
  IconTrash,
} from "@tabler/icons-react"
import { useModal } from "../../hooks/useModal"
import { useNavigate } from "react-router-dom"
import { NavLink, Stack, rem } from "@mantine/core"
import { useGeneralStore } from "../../stores/generalStore"

type ServerChannelProps = {
  channel: Channel
  server: Server
  role?: MemberRole
  isActive?: boolean
}

const iconMap = {
  [ChannelType.Text]: <IconHash size={15} />,
  [ChannelType.Audio]: <IconMicrophone size={15} />,
  [ChannelType.Video]: <IconCamera size={15} />,
}

function ServerChannel({
  channel,
  server,
  role,
  isActive,
}: ServerChannelProps) {
  const deleteChannelModal = useModal("DeleteChannel")
  const updateChannelModal = useModal("UpdateChannel")

  const setChannelToBeDeletedOrUpdatedId = useGeneralStore(
    (state) => state.setChannelToBeDeletedOrUpdatedId
  )

  const navigate = useNavigate()
  if (!channel && !server) return null
  const Icon = iconMap[channel.type]
  if (channel?.name !== "general") {
    return (
      <NavLink
        ml="md"
        w={rem(260)}
        label={channel?.name}
        rightSection={Icon}
        active={isActive}
      >
        {role !== MemberRole.Guest && (
          <Stack>
            <NavLink
              label="Join"
              rightSection={
                <IconMessage style={{ marginLeft: "rem(8px)" }} size={20} />
              }
              onClick={() =>
                navigate(
                  `/servers/${server.id}/channels/${channel.type}/${channel.id}`
                )
              }
            />
            <NavLink
              label="Delete"
              rightSection={
                <IconTrash style={{ marginLeft: "rem(8px)" }} size={20} />
              }
              onClick={() => {
                setChannelToBeDeletedOrUpdatedId(channel.id)
                deleteChannelModal.openModal()
              }}
            />
          </Stack>
        )}
      </NavLink>
    )
  } else {
    return (
      <NavLink
        onClick={() =>
          navigate(
            `/servers/${server.id}/channels/${channel.type}/${channel.id}`
          )
        }
        w={rem(260)}
        ml="md"
        active={isActive}
        label={channel?.name}
        rightSection={Icon}
      />
    )
  }
}

export default ServerChannel
