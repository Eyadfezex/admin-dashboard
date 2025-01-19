import { Refine } from "@refinedev/core";
import { DevtoolsPanel } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { dataProvider, liveProvider } from "./Providers";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import routerBindings, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { authProvider } from "./Providers/auth";
import { Home, Register, ForgotPassword, Login } from "./pages";
function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            liveProvider={liveProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "ah6hOh-drxNML-7gXkwD",
              liveMode: "auto",
            }}
          >
            <Routes>
              <Route index element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          <DevtoolsPanel />
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
