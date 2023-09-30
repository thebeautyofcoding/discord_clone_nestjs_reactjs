import React, { useState } from "react"
import { useModal } from "../../../hooks/useModal"
import {
  Avatar,
  Button,
  Center,
  Flex,
  Loader,
  Menu,
  Modal,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core"
import { useServer } from "../../../hooks/graphql/server/useServer"
import {
  IconCheck,
  IconCrown,
  IconDotsVertical,
  IconShieldCheck,
} from "@tabler/icons-react"
import { useMutation } from "@apollo/client"
import {
  ChangeMemberRoleMutation,
  ChangeMemberRoleMutationVariables,
  DeleteMemberMutation,
  DeleteMemberMutationVariables,
  MemberRole,
} from "../../../gql/graphql"
import { CHANGE_MEMBER_ROLE } from "../../../graphql/mutations/server/member/ChangeMemberRole"
import { DELETE_MEMBER } from "../../../graphql/mutations/server/member/DeleteMember"

function ManageMemberModal() {
  const { closeModal, isOpen } = useModal("ManageMembers")

  const { server } = useServer()

  const roleIconMap = {
    MODERATOR: <IconShieldCheck color="blue" size={20} />,
    ADMIN: <IconCrown color="green" size={20} />,
    GUEST: <IconShieldCheck color="gray" size={20} />,
  }
  const [loadingId, setLoadingId] = useState<number | null>()

  const [changeMemberRole, { loading }] = useMutation<
    ChangeMemberRoleMutation,
    ChangeMemberRoleMutationVariables
  >(CHANGE_MEMBER_ROLE, {
    onCompleted: () => {
      setLoadingId(null)
    },
  })

  const [deleteMember] = useMutation<
    DeleteMemberMutation,
    DeleteMemberMutationVariables
  >(DELETE_MEMBER, {
    onCompleted: () => {
      setLoadingId(null)
    },
  })
  const handleRoleChange = (memberId: number, role: MemberRole) => {
    setLoadingId(memberId)
    changeMemberRole({
      variables: {
        memberId,
        role,
      },
    })
  }
  const handleDelete = (memberId: number) => {
    setLoadingId(memberId)
    deleteMember({
      variables: {
        memberId,
      },
    })
  }
  return (
    <Modal opened={isOpen} onClose={closeModal} title="Manage Members">
      <Text size="sm" c="dimmed" mb="md">
        {server?.members?.length} Members
      </Text>
      <ScrollArea h={rem(200)}>
        {server?.members?.map((member) => {
          return (
            <Flex my="md" key={member?.id}>
              <Avatar
                src={member?.profile?.imageUrl}
                radius={100}
                mr="md"
                size="md"
              />
              <Flex direction="column" justify="space-between" w={"70%"}>
                <Flex align="center">
                  <Text fw={700}> {member?.profile?.name}</Text>
                  <Flex align="center" ml="xs">
                    {roleIconMap[member.role]}
                  </Flex>
                </Flex>
                <Text size="xs" c="dimmed">
                  {member.profile?.email}
                </Text>
              </Flex>

              {member.profileId !== server?.profileId &&
                loadingId !== member.id && (
                  <Menu shadow="md">
                    <Menu.Target>
                      <Button variant="transparent">
                        <IconDotsVertical />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item>
                        <Menu.Item>
                          <Menu shadow="md" trigger="hover" position="left">
                            <Menu.Target>
                              <Text>Change Role</Text>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                onClick={() =>
                                  handleRoleChange(member.id, MemberRole.Admin)
                                }
                              >
                                <Flex
                                  justify={"space-between"}
                                  align={"center"}
                                >
                                  Admin{" "}
                                  {member.role === MemberRole.Admin ? (
                                    <IconCheck />
                                  ) : null}
                                </Flex>
                              </Menu.Item>
                              <Menu.Item
                                onClick={() =>
                                  handleRoleChange(
                                    member.id,
                                    MemberRole.Moderator
                                  )
                                }
                              >
                                <Flex
                                  justify={"space-between"}
                                  align={"center"}
                                >
                                  Moderator{" "}
                                  {member.role === MemberRole.Moderator ? (
                                    <IconCheck />
                                  ) : null}
                                </Flex>
                              </Menu.Item>
                              <Menu.Item
                                onClick={() =>
                                  handleRoleChange(member.id, MemberRole.Guest)
                                }
                              >
                                <Flex
                                  justify={"space-between"}
                                  align={"center"}
                                >
                                  Guest{" "}
                                  {member.role === MemberRole.Guest ? (
                                    <IconCheck />
                                  ) : null}
                                </Flex>
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Menu.Item>
                        <Menu.Item onClick={() => handleDelete(member.id)}>
                          Kick
                        </Menu.Item>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              {loadingId === member.id && (
                <Flex align="center" justify="center">
                  <Loader size="xs" />
                </Flex>
              )}
            </Flex>
          )
        })}
      </ScrollArea>
    </Modal>
  )
}

export default ManageMemberModal
