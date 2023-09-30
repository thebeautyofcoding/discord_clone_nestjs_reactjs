import React from "react"
import { ChannelType, MemberRole } from "../../gql/graphql"
import { useModal } from "../../hooks/useModal"
import { useGeneralStore } from "../../stores/generalStore"
import { Flex, Text, Tooltip } from "@mantine/core"
import { IconPlus, IconSettings } from "@tabler/icons-react"

interface ServerSidebarSectionProps {
  sectionType: "channels" | "members"
  channelType?: ChannelType
  role: MemberRole
  label: string
}

function ServerSidebarSection({
  sectionType,
  channelType,
  role,
  label,
}: ServerSidebarSectionProps) {
  const channelModal = useModal("CreateChannel")
  const manageMembersModal = useModal("ManageMembers")

  const setChannelTypeForCreateChannelModal = useGeneralStore(
    (state) => state.setChannelTypeForCreateChannelModal
  )

  const handleOnClick = () => {
    console.log("handleOnClick", channelType)
    setChannelTypeForCreateChannelModal(channelType)
    channelModal.openModal()
  }

  if (role !== MemberRole.Guest && sectionType === "channels") {
    return (
      <Tooltip label="Create Channel" withArrow onClick={handleOnClick}>
        <Flex p="md" style={{ cursor: "pointer" }}>
          <Flex justify={"space-between"} w="100%">
            <Text fw={700}>{label}</Text>
          </Flex>
          <IconPlus />
        </Flex>
      </Tooltip>
    )
  }

  if (role === MemberRole.Admin && sectionType === "members") {
    return (
      <Tooltip
        label="Manage Members"
        withArrow
        onClick={manageMembersModal.openModal}
      >
        <Flex p="md" style={{ cursor: "pointer" }}>
          <Flex justify={"space-between"} w="100%">
            <Text fw={700}>{label}</Text>
          </Flex>
          <IconSettings />
        </Flex>
      </Tooltip>
    )
  }
  if (role !== MemberRole.Admin && sectionType === "members") {
    return (
      <Flex p="md">
        <Flex justify={"space-between"} w="100%">
          <Text fw={700}>{label}</Text>
        </Flex>
      </Flex>
    )
  }
}

export default ServerSidebarSection
