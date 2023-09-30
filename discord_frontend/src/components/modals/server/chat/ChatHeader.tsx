import React from "react"
import { useServer } from "../../../../hooks/graphql/server/useServer"
import { useParams } from "react-router-dom"
import { Avatar, Button, Flex, Paper, Text } from "@mantine/core"
import classes from "./ChatHeader.module.css"
import { IconHash, IconMenu2 } from "@tabler/icons-react"

function ChatHeader({
  opened,
  toggle,
  type,
}: {
  opened: boolean
  toggle: () => void
  type: "channel" | "conversation"
}) {
  const { memberId } = useParams<{ memberId: string }>()

  const { server, members } = useServer()
  const member = members.find((member) => member?.id === Number(memberId))

  return (
    <Paper
      style={{
        transition: "margin-left 0.3s ease",
        width: "calc(100% - 80px)",
        marginLeft: opened ? "400px" : "80px",
        height: "60px",
        position: "fixed",
      }}
      className={classes.chatHeader}
      shadow="md"
    >
      <Flex justify="start" align="center" h="100%">
        <Button variant="subtle" onClick={toggle}>
          <IconMenu2 />
        </Button>
        {type === "channel" ? (
          <>
            <IconHash />
            <Text fw={700} size="lg">
              {server?.name}
            </Text>
          </>
        ) : (
          <Flex align="center" w="20%" ml="md">
            <Avatar mr="md" src={member?.profile?.imageUrl} radius={100} />
            <Text fw={700} size="lg">
              {member?.profile?.name}
            </Text>
          </Flex>
        )}
      </Flex>
    </Paper>
  )
}

export default ChatHeader
