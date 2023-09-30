import React, { useEffect } from "react"
import ServerHeader from "./ServerHeader"
import classes from "./ServerSidebar.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { useServer } from "../../hooks/graphql/server/useServer"
import { ScrollArea, Stack } from "@mantine/core"
import { Server } from "http"
import ServerSidebarSection from "./ServerSidebarSection"
import ServerChannel from "./ServerChannel"
import { ChannelType } from "../../gql/graphql"
import Servermember from "./Servermember"
function ServerSidebar() {
  const navigate = useNavigate()
  console.log("Server sidebar")
  const { serverId, memberId, channelId } = useParams()
  const { textChannels, audioChannels, videoChannels, server, role, members } =
    useServer()
  useEffect(() => {
    if (!channelId && !memberId && textChannels.length) {
      navigate(`/servers/${serverId}/channels/TEXT/${textChannels[0]?.id}`)
    }
  })

  const [activeMemberId, setActiveMemberId] = React.useState<number | null>()
  const [activeChannelId, setActiveChanneId] = React.useState<number | null>()
  useEffect(() => {
    if (memberId) {
      setActiveMemberId(parseInt(memberId))
      setActiveChanneId(null)
    }
    if (channelId) {
      setActiveChanneId(parseInt(channelId))
      setActiveMemberId(null)
    }
  }, [channelId, memberId, textChannels])
  if (!server || !role) return null
  console.log("members!", members)
  return (
    <nav className={classes.nav}>
      <ServerHeader server={server} memberRole={role} />
      {/* ServerSearch */}
      <ScrollArea>
        {!!textChannels.length && (
          <ServerSidebarSection
            sectionType="channels"
            channelType={ChannelType.Text}
            role={role}
            label="Text Channels"
          />
        )}
        <Stack>
          {textChannels.map((channel) => (
            <ServerChannel
              key={channel?.id}
              channel={channel}
              isActive={activeChannelId === channel?.id}
              role={role}
              server={server}
            />
          ))}
        </Stack>
        {!!audioChannels.length && (
          <ServerSidebarSection
            sectionType="channels"
            channelType={ChannelType.Audio}
            role={role}
            label="Audio Channels"
          />
        )}
        <Stack>
          {audioChannels.map((channel) => (
            <ServerChannel
              key={channel?.id}
              channel={channel}
              isActive={activeChannelId === channel?.id}
              role={role}
              server={server}
            />
          ))}
        </Stack>
        {!!videoChannels.length && (
          <ServerSidebarSection
            sectionType="channels"
            channelType={ChannelType.Video}
            role={role}
            label="Video Channels"
          />
        )}
        <Stack>
          {videoChannels.map((channel) => (
            <ServerChannel
              key={channel?.id}
              channel={channel}
              isActive={activeChannelId === channel?.id}
              role={role}
              server={server}
            />
          ))}
        </Stack>
        {!!members?.length && (
          <ServerSidebarSection
            sectionType="members"
            role={role}
            label="Member"
          />
        )}
        <Stack>
          {members?.map((member) => (
            <Servermember
              key={member?.id}
              member={member}
              isActive={activeMemberId === member?.id}
              server={server}
            />
          ))}
        </Stack>
      </ScrollArea>
    </nav>
  )
}

export default ServerSidebar
