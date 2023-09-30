import React from "react"
import MobileSidebar from "../components/navigation/MobileSidebar"
import { Outlet } from "react-router-dom"

function ChannelLayout() {
  return (
    <>
      <MobileSidebar />
      <Outlet />
    </>
  )
}

export default ChannelLayout
