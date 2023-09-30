import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ChannelType } from "../gql/graphql"

export type Modal =
  | "CreateServer"
  | "InvitePeople"
  | "UpdateServer"
  | "CreateChannel"
  | "ManageMembers"
  | "DeleteChannel"
  | "UpdateChannel"
  | "DeleteServer"
  | "ServerJoin"
  | "UpdateMessage"
  | "LeaveServer"

interface GeneralStore {
  activeModal: Modal | null
  drawerOpen: boolean
  chanelTypeForCreateChannelModal: ChannelType | undefined
  channelToBeDeletedOrUpdatedId: number | null

  setActiveModal: (modal: Modal | null) => void
  toggleDrawer: () => void
  setChannelTypeForCreateChannelModal: (type: ChannelType | undefined) => void
  setChannelToBeDeletedOrUpdatedId: (id: number | null) => void
}

export const useGeneralStore = create<GeneralStore>()(
  persist(
    (set) => ({
      activeModal: null,
      drawerOpen: true,
      chanelTypeForCreateChannelModal: ChannelType.Text,
      channelToBeDeletedOrUpdatedId: null,
      setActiveModal: (modal: Modal | null) => set({ activeModal: modal }),
      toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),

      setChannelTypeForCreateChannelModal: (channeltype) =>
        set(() => ({ chanelTypeForCreateChannelModal: channeltype })),

      setChannelToBeDeletedOrUpdatedId: (id) =>
        set(() => ({ channelToBeDeletedOrUpdatedId: id })),
    }),
    {
      name: "general-store",
    }
  )
)
