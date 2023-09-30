import { useNavigate, useParams } from "react-router-dom"
import { useProfileStore } from "../../../stores/profileStore"
import { useQuery } from "@apollo/client"
import { GET_SERVER } from "../../../graphql/queries/GetServer"
import {
  ChannelType,
  GetServerQuery,
  GetServerQueryVariables,
} from "../../../gql/graphql"

export function useServer() {
  const { serverId } = useParams<{ serverId: string }>()
  const profileId = useProfileStore((state) => state.profile?.id)

  const navigate = useNavigate()

  const { data: dataServer, loading } = useQuery<
    GetServerQuery,
    GetServerQueryVariables
  >(GET_SERVER, {
    variables: {
      id: Number(serverId),
    },
    onError: () => {
      navigate("/")
    },
  })
  const textChannels =
    dataServer?.getServer?.channels?.filter(
      (channel) => channel?.type === ChannelType.Text
    ) || []

  const audioChannels =
    dataServer?.getServer?.channels?.filter(
      (channel) => channel?.type === ChannelType.Audio
    ) || []

  const videoChannels =
    dataServer?.getServer?.channels?.filter(
      (channel) => channel?.type === ChannelType.Video
    ) || []

  const members =
    dataServer?.getServer?.members?.filter(
      (member) => member?.profileId !== profileId
    ) || []

  const role = dataServer?.getServer?.members?.find(
    (member) => member?.profileId === profileId
  )?.role

  return {
    server: dataServer?.getServer,
    loading,
    textChannels,
    audioChannels,
    videoChannels,
    members,
    role,
  }
}
