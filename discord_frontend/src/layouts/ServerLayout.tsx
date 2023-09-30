import React from "react"
import { Outlet } from "react-router-dom"
import ServerSidebar from "../components/navigation/ServerSidebar"

function ServerLayout() {
  return (
    <div>
      <ServerSidebar />
      <Outlet />
    </div>
  )
}

export default ServerLayout
