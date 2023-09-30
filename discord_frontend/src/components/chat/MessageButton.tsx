import React from "react"
import classes from "./MessageButton.module.css"
import { Flex } from "@mantine/core"
import { IconEdit, IconTrash } from "@tabler/icons-react"
function MessageButton({
  onClick,
  type,
}: {
  onClick: () => void
  type: "update" | "delete"
}) {
  return (
    <Flex className={classes.messageButton} onClick={onClick}>
      {type === "delete" && <IconTrash className={classes.icon} size="15" />}
      {type === "update" && <IconEdit className={classes.icon} size="15" />}
    </Flex>
  )
}

export default MessageButton
