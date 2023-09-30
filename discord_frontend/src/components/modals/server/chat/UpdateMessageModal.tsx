import { useParams } from "react-router-dom"
import { useModal } from "../../../../hooks/useModal"
import { useMessageStore } from "../../../../stores/messageStore"
import { useForm } from "@mantine/form"
import { useEffect } from "react"
import { useMutation } from "@apollo/client"
import {
  UpdateMessageMutation,
  UpdateMessageMutationVariables,
} from "../../../../gql/graphql"
import { UPDATE_MESSAGE } from "../../../../graphql/mutations/server/message/UpdateMessage"
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core"

function UpdatMessageModal() {
  const updateMessageModal = useModal("UpdateMessage")

  const { conversationId, channelId, serverId } = useParams()
  const message = useMessageStore((state) => state.message)

  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) =>
        !value?.trim ? "Please enter your new content" : null,
    },
    validateInputOnChange: true,
  })

  useEffect(() => {
    if (!message?.content) return
    form.setFieldValue("content", message.content)
  }, [message])

  const [updateMessage, { loading }] = useMutation<
    UpdateMessageMutation,
    UpdateMessageMutationVariables
  >(UPDATE_MESSAGE, {
    variables: {
      messageId: Number(message?.id),
      content: form.values.content,
      conversationId: Number(conversationId),
      channelId: Number(channelId),
      serverId: Number(serverId),
    },
    onCompleted: () => {
      updateMessageModal.closeModal()
    },
  })

  return (
    <Modal
      opened={updateMessageModal.isOpen}
      onClose={updateMessageModal.closeModal}
      title="Update Message"
      size="md"
    >
      <Stack>
        <TextInput
          mb="md"
          label="Content"
          placeholder="Update your content"
          {...form.getInputProps("content")}
          error={form.errors.content}
        />

        <Group gap="md">
          <Button onClick={updateMessageModal.closeModal} color="red">
            Cancel
          </Button>
          <Button
            onClick={() => updateMessage()}
            variant="gradient"
            disabled={loading || !!form.errors.content}
          >
            Update Message
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default UpdatMessageModal
