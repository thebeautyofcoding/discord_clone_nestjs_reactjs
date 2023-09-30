import React from "react"
import { useModal } from "../../../../hooks/useModal"
import { Button, Modal, Text } from "@mantine/core"
import { useServer } from "../../../../hooks/graphql/server/useServer"
import { useGeneralStore } from "../../../../stores/generalStore"
import { useMutation } from "@apollo/client"
import { DELETE_CHANNEL } from "../../../../graphql/mutations/server/DeleteChannel"
import {
  DeleteChannelMutation,
  DeleteChannelMutationVariables,
} from "../../../../gql/graphql"
import { useNavigate } from "react-router-dom"

function DeleteChannelModal() {
  const { isOpen, closeModal } = useModal("DeleteChannel")
  const { server } = useServer()

  const channelToBeDeletedOrUpdatedId = useGeneralStore(
    (state) => state.channelToBeDeletedOrUpdatedId
  )

  const [deleteChannel, { loading }] = useMutation<
    DeleteChannelMutation,
    DeleteChannelMutationVariables
  >(DELETE_CHANNEL, {
    variables: {
      channelId: channelToBeDeletedOrUpdatedId,
    },
    refetchQueries: ["GetServer"],
    onCompleted: () => {
      closeModal()
      navigate(`/servers/${server?.id}`)
    },
  })
  const navigate = useNavigate()

  return (
    <Modal opened={isOpen} onClose={closeModal} title="Delete Channel">
      <Text fw={700}>Are you sure you want to delete this channel?</Text>
      <Button
        mt="md"
        loading={loading}
        color="red"
        onClick={() => deleteChannel()}
      >
        Delete Channel
      </Button>
    </Modal>
  )
}

export default DeleteChannelModal
