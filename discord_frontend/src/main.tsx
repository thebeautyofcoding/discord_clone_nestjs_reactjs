import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react"
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom"
import RootLayout from "./layouts/RootLayout.tsx"
import HomePage from "./pages/HomePage.tsx"
import CreateServerModal from "./components/modals/CreateServerModal.tsx"
import { ApolloProvider } from "@apollo/client"
import client from "./apolloClient.ts"
import ServerLayout from "./layouts/ServerLayout.tsx"
import CreateChannelModal from "./components/modals/server/CreateChannelModal.tsx"
import ChannelLayout from "./layouts/ChannelLayout.tsx"
import ChannelPage from "./pages/ChannelPage.tsx"
import InviteModal from "./components/modals/server/InviteModal.tsx"
import UpdateServerModal from "./components/modals/server/UpdateServerModal.tsx"
import DeleteChannelModal from "./components/modals/server/channel/DeleteChannelModal.tsx"
import DeleteServerModal from "./components/modals/server/DeleteServerModal.tsx"
import ServerJoinModal from "./components/modals/server/ServerJoinModal.tsx"
import ManageMemberModal from "./components/modals/member/ManageMemberModal.tsx"
import ConversationPage from "./pages/ConversationPage.tsx"
import UpdatMessageModal from "./components/modals/server/chat/UpdateMessageModal.tsx"
import LeaveServerModal from "./components/modals/server/LeaverServerModal.tsx"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

const RouterComponent = () => {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path="" element={<RootLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <ServerJoinModal />
                <CreateServerModal />
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="servers/:serverId" element={<ServerLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <CreateChannelModal />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="servers/:serverId/channels/:channelType/:channelId"
          element={<ChannelLayout />}
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <LeaveServerModal />
                <UpdatMessageModal />
                <ManageMemberModal />
                <ServerJoinModal />
                <DeleteServerModal />
                <DeleteChannelModal />
                <CreateChannelModal />
                <UpdateServerModal />
                <CreateChannelModal />
                <InviteModal />
                <ChannelPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="servers/:serverId/conversations/:conversationId/members/:channelType/:memberId"
          element={<ChannelLayout />}
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <LeaveServerModal />
                <UpdatMessageModal />
                <ManageMemberModal />
                <ServerJoinModal />
                <DeleteServerModal />
                <DeleteChannelModal />
                <CreateChannelModal />
                <UpdateServerModal />
                <CreateChannelModal />
                <InviteModal />
                <ConversationPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <BrowserRouter>
          <RouterComponent />
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>
)

export default RouterComponent
