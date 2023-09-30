import React, { useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/navigation/Sidebar"
import { useProfileStore } from "../stores/profileStore"
import { useAuth, useSession } from "@clerk/clerk-react"
import { useMutation } from "@apollo/client"
import {
  CreateProfileMutation,
  CreateProfileMutationVariables,
} from "../gql/graphql"
import { CREATE_PROFILE } from "../graphql/mutations/CreateProfile"

function RouteLayout() {
  const profile = useProfileStore((state) => state.profile)

  const { session } = useSession()

  const [createProfile] = useMutation<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >(CREATE_PROFILE, {})
  const { isSignedIn } = useAuth()
  const setProfile = useProfileStore((state) => state.setProfile)

  useEffect(() => {
    if (!isSignedIn) setProfile(null)
  }, [isSignedIn, setProfile])
  useEffect(() => {
    const createProfileFn = async () => {
      if (!session?.user) return
      try {
        await createProfile({
          variables: {
            input: {
              email: session?.user.emailAddresses[0].emailAddress,
              name: session?.user.username || "",
              imageUrl: session?.user.imageUrl,
            },
          },
          onCompleted: (data) => {
            setProfile(data.createProfile)
          },
          refetchQueries: ["GetServers"],
        })
      } catch (err) {
        console.log("Error creating profile in backend: ", err)
      }
    }
    if (profile?.id) return
    createProfileFn()
  }, [session?.user, profile?.id])

  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default RouteLayout
