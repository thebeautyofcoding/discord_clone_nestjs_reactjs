import React from "react"
import "@livekit/components-styles"
import classes from "./MediaRoom.module.css"
import { useLivekitAccessToken } from "../../../hooks/graphql/server/chat/useLivekitAccessToken"
import { useNavigate, useParams } from "react-router-dom"
import { useToggleDrawer } from "../../../hooks/useToggleDrawer"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
function MediaRoom({
  chatId,
  audio,
  video,
}: {
  chatId: string | undefined
  audio: boolean
  video: boolean
}) {
  const { token } = useLivekitAccessToken(chatId)
  const { serverId } = useParams()
  const navigate = useNavigate()

  const { drawerOpen } = useToggleDrawer()

  return (
    <LiveKitRoom
      serverUrl={import.meta.env.VITE_LK_SERVER_URL}
      onDisconnected={() => navigate(`/servers/${serverId}`)}
      className={
        drawerOpen ? classes.mediaRoomDrawerOpen : classes.mediaRoomDrawerClosed
      }
      video={video}
      audio={audio}
      token={token}
      data-lk-theme="default"
      style={{ height: "calc(80vh - 60px)" }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}

export default MediaRoom
