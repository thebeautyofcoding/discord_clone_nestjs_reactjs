import { useMediaQuery } from "@mantine/hooks"
import { useGeneralStore } from "../stores/generalStore"

export const useToggleDrawer = () => {
  const isSmallerThanLg = useMediaQuery("(max-width: 1350px)")

  const drawerOpen = useGeneralStore((state) => state.drawerOpen)

  return {
    drawerOpen,
    isSmallerThanLg,
  }
}
