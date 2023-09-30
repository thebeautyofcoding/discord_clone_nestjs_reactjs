import React from "react"
import { ChannelType } from "../../../../gql/graphql"
import { useParams } from "react-router-dom"
import { useForm } from "@mantine/form"
import { MutationFunctionOptions } from "@apollo/client"
import { Button, FileInput, Flex, Image, TextInput, rem } from "@mantine/core"
import classes from "./TextInputSection.module.css"
import { IconCubeSend, IconFile, IconX } from "@tabler/icons-react"

type CreateMessageMutation = () => Promise<any>

interface Props {
  conversationId?: number
  channelId?: number
  createMessage: CreateMessageMutation
}

function TextInputSection({ conversationId, channelId, createMessage }: Props) {
  const fileInputRef = React.useRef<HTMLButtonElement>(null)

  const { channelType } = useParams<{ channelType: string }>()

  const isMediaChannel =
    ChannelType.Video === channelType || ChannelType.Audio === channelType

  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [file, setFile] = React.useState<File | null>(null)

  const createImagePreview = (file: File) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setFile(file)
    }
  }

  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!values.content) {
        errors.content = "Required"
      }
      return errors
    },
  })

  const handleSendMessage = async () => {
    if (!conversationId && !channelId) return

    await createMessage({
      variables: {
        content: form.values.content,
        conversationId: conversationId,
        channelId: channelId,
        file: file,
      },
      refetchQueries: ["GetMessages"],
      onError: (error) => {
        console.log(error)
      },
      onCompleted: () => {
        form.setValues({ content: "" })
        setImagePreview(null)
        setFile(null)
      },
    })
  }

  return (
    <Flex
      className={
        !isMediaChannel
          ? classes.textInputSectionContainerNoMedia
          : classes.textInputSectionContainerWithMedia
      }
    >
      <TextInput
        className={
          !isMediaChannel
            ? classes.textInputNoMedia
            : classes.textInputWithMedia
        }
        placeholder={"Message"}
        {...form.getInputProps("content")}
      />
      <Flex
        className={
          !isMediaChannel
            ? classes.buttonsContainerNoMedia
            : classes.buttonsContainerWithMedia
        }
      >
        {!imagePreview && (
          <Button
            variant="light"
            radius={100}
            w={rem(50)}
            h={rem(50)}
            p={imagePreview ? "0" : "xs"}
            size={imagePreview ? "compact-md" : "compact-lg"}
            className={
              !isMediaChannel
                ? classes.fileUploadButtonContainerNoMedia
                : classes.fileUploadButtonContainerWithMedia
            }
            onClick={() => fileInputRef.current?.click()}
          >
            {" "}
            <>
              <FileInput
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={createImagePreview}
              />
              <IconFile size={25} />
            </>
          </Button>
        )}
        <Flex>
          {imagePreview && (
            <Flex
              style={{
                width: rem(50),
                height: rem(50),
                borderRadius: "100%",
                position: "relative",
                marginRight: rem(10),
              }}
            >
              <Image
                w={rem(50)}
                h={rem(50)}
                src={imagePreview}
                style={{ borderRadius: "100%" }}
                pos="absolute"
                fit="cover"
              />
              <Button
                onClick={() => setImagePreview(null)}
                color="red"
                pos="absolute"
                size="25"
                radius={100}
                m="0"
                p="0"
                right="0"
              >
                <IconX radius={100} />
              </Button>
            </Flex>
          )}
        </Flex>

        <Button
          p="xs"
          radius={100}
          variant="light"
          size="50"
          onClick={handleSendMessage}
        >
          <IconCubeSend size="25" />
        </Button>
      </Flex>
    </Flex>
  )
}

export default TextInputSection
