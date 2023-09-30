import {
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core"
import React, { useEffect } from "react"
import { useModal } from "../../../hooks/useModal"
import { useForm } from "@mantine/form"
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import classes from "./UpdateServerModal.module.css"
import { IconUpload, IconX } from "@tabler/icons-react"
import { useMutation } from "@apollo/client"

import { UPDATE_SERVER } from "../../../graphql/mutations/server/UpdateServer"

import { useProfileStore } from "../../../stores/profileStore"
import {
  UpdateServerMutation,
  UpdateServerMutationVariables,
} from "../../../gql/graphql"
import { useServer } from "../../../hooks/graphql/server/useServer"
function UpdateServerModal() {
  const { isOpen, closeModal } = useModal("UpdateServer")

  const [updateServer, { loading, error }] = useMutation<
    UpdateServerMutation,
    UpdateServerMutationVariables
  >(UPDATE_SERVER)

  const profileId = useProfileStore((state) => state.profile?.id)

  const { server } = useServer()

  useEffect(() => {
    if (!server) return
    form.setValues({ name: server.name })
    setImagePreview(server.imageUrl)
  }, [server?.name, server?.imageUrl])

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) => !value.trim() && "Please enter a name.",
    },
  })
  const onSubmit = () => {
    if (!form.validate()) return

    updateServer({
      variables: {
        input: {
          name: form.values.name,
          serverId: server?.id,
        },
        file,
      },
      onCompleted: () => {
        setImagePreview(null)
        setFile(null)
        form.reset
        closeModal()
      },

      refetchQueries: ["GetServers"],
    })
  }

  const [file, setFile] = React.useState<File | null>(null)
  const handleDropzoneChange: DropzoneProps["onDrop"] = (files) => {
    if (files.length === 0) {
      return setImagePreview(null)
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    setFile(files[0])
    reader.readAsDataURL(files[0])
  }
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  return (
    <Modal title="Update server" opened={isOpen} onClose={closeModal}>
      <Text c="dimmed">
        Give your server a personality with a name and an image. You can always
        change it later.
      </Text>
      <form onSubmit={form.onSubmit(() => onSubmit())}>
        <Stack>
          <Flex justify="center" align="center" direction={"column"}>
            {!imagePreview && (
              <Dropzone
                onDrop={(files) => {
                  handleDropzoneChange(files)
                }}
                className={classes.dropZone}
                accept={IMAGE_MIME_TYPE}
                mt="md"
              >
                <Group
                  style={{
                    minHeight: rem(100),
                    pointerEvents: "none",
                  }}
                >
                  <Dropzone.Accept>
                    <IconUpload size="3.2rem" stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size="3.2rem" stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconUpload size="3.2rem" stroke={1.5} />
                  </Dropzone.Idle>
                  <Stack>
                    <Text size="xl" inline>
                      Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Upload a server icon
                    </Text>
                    {error?.message && !file && (
                      <Text c="red">{error?.message}</Text>
                    )}
                  </Stack>
                </Group>
              </Dropzone>
            )}

            {imagePreview && (
              <Flex pos="relative" w={rem(150)} h={rem(150)} mt="md">
                <>
                  <Button
                    onClick={() => {
                      setImagePreview(null)
                      setFile(null)
                    }}
                    color="red"
                    pos="absolute"
                    style={{
                      zIndex: 1,
                      borderRadius: "50%",
                      padding: 0,
                      width: rem(30),
                      height: rem(30),
                      top: 0,
                      right: 18,
                    }}
                  >
                    <IconX color="white" />
                  </Button>
                  <Image
                    src={imagePreview}
                    width={rem(150)}
                    height={rem(150)}
                    radius={"50%"}
                  />
                </>
              </Flex>
            )}
          </Flex>
          <TextInput
            label="Server name"
            placeholder="Enter server name"
            {...form.getInputProps("name")}
            error={form.errors.name}
          />
          <Button
            disabled={!!form.errors.name || loading}
            w={"50%"}
            type="submit"
            variant="gradient"
            mt="md"
          >
            Update Server
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}

export default UpdateServerModal
