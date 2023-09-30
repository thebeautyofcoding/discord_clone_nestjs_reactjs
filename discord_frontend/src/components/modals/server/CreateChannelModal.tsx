import React, { useEffect } from "react"
import { useModal } from "../../../hooks/useModal"
import {
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  rem,
} from "@mantine/core"
import { useGeneralStore } from "../../../stores/generalStore"
import { useForm } from "@mantine/form"
import {
  ChannelType,
  CreateChannelMutation,
  CreateChannelMutationVariables,
} from "../../../gql/graphql"
import { useServer } from "../../../hooks/graphql/server/useServer"
import { useMutation } from "@apollo/client"
import { CREATE_CHANNEL } from "../../../graphql/mutations/server/CreateChannel"

function CreateChannelModal() {
  const { isOpen, closeModal } = useModal("CreateChannel")

  const channelType = useGeneralStore(
    (state) => state.chanelTypeForCreateChannelModal
  )

  const form = useForm({
    initialValues: {
      name: "",
      type: channelType ? channelType : ChannelType.Text,
    },

    validate: {
      name: (value) =>
        !value.trim()
          ? "Please enter a name"
          : value === "general"
          ? "Channel name cannot be general"
          : null,
      type: (value) => !value.trim() && "Please select a type",
    },
    validateInputOnChange: true,
  })

  const { server } = useServer()

  const [createChannel, { loading, error }] = useMutation<
    CreateChannelMutation,
    CreateChannelMutationVariables
  >(CREATE_CHANNEL, {
    variables: {
      input: {
        serverId: server?.id,
        name: form.values.name,
        type: form.values.type,
      },
    },
    refetchQueries: ["GetServer"],
    onCompleted: () => {
      closeModal()
      form.reset()
    },
  })

  const channelTypeForCreateChannelModal = useGeneralStore(
    (state) => state.chanelTypeForCreateChannelModal
  )

  useEffect(() => {
    if (!channelTypeForCreateChannelModal) return
    form.setFieldValue("type", channelTypeForCreateChannelModal)
  }, [channelType])

  return (
    <Modal title="Create Channel" opened={isOpen} onClose={closeModal}>
      <Stack>
        <Flex direction="column" h={rem(250)}>
          <TextInput
            mb="md"
            label="Channel Name"
            {...form.getInputProps("name")}
            error={form.errors.name || error?.message}
          />
          <Select
            {...form.getInputProps("type")}
            label="Channel Type"
            data={Object.values(ChannelType).map((type) => type)}
          />
        </Flex>
        <Group>
          <Button color="red" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => createChannel()}
            loading={loading}
            variant="gradient"
            disabled={
              !form.values.name ||
              !form.values.type ||
              loading ||
              !!error?.message
            }
          >
            Create Channel
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default CreateChannelModal
