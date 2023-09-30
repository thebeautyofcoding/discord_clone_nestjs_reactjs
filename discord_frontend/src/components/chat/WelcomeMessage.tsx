import { Flex, Text } from "@mantine/core"
import { IconHash } from "@tabler/icons-react"
import React from "react"

function WelcomeMessage({
  type,
  name,
}: {
  type: "conversation" | "channel"
  name: string | null
}) {
  return (
    <Flex justify="end" align="start" direction="column" p="lg">
      <IconHash size="40" radius="40" />

      <Text size="xl" fw={700}>
        {type === "conversation" ? `Welcome to # ${name}` : ``}
      </Text>
      <Text c="dimmed">
        {type === "channel"
          ? `This is the start of the #${name} channel`
          : `This is the start of the conversation with ${name}`}
      </Text>
    </Flex>
  )
}

export default WelcomeMessage
