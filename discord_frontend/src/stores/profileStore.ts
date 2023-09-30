import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Profile } from "../gql/graphql"

interface ProfileStore {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) =>
        set(() => ({
          profile,
        })),
    }),
    {
      name: "profile-store",
    }
  )
)
