import React from "react"

export const useScrollToBottom = (dependency: number | undefined) => {
  const viewport = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (!viewport.current) return
    const scrollHeight = viewport.current.scrollHeight

    viewport.current.scrollTo({
      behavior: "smooth",
      top: scrollHeight,
    })
  }
  React.useEffect(() => {
    if (dependency === undefined) return
    scrollToBottom()
  }, [dependency])

  return { viewport, scrollToBottom }
}
