import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MessageUnion } from "../gql/graphql"

interface MessageStore {
  message: MessageUnion | null
  setMessage: (message: MessageUnion) => void
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      message: null,
      setMessage: (message) => set(() => ({ message })),
    }),
    {
      name: "message-store",
    }
  )
)
