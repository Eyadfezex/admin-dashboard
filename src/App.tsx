import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { dataProvider, liveProvider } from "./Providers";
import { App as AntdApp } from "antd";
import Layout from "./components/layout/index";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import routerBindings, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
  CatchAllNavigate,
} from "@refinedev/react-router";
import { authProvider } from "./Providers/auth";
import { Home, Register, ForgotPassword, Login } from "./pages";
import { resources } from "./config/resources";
import { CompanyList } from "./pages/company/list";
import Create from "./pages/company/create";
import EditPage from "./pages/company/edit";
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
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "ah6hOh-drxNML-7gXkwD",
              liveMode: "auto",
            }}
          >
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                element={
                  <Authenticated
                    key="authenticated-layout"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<Home />} />
                <Route path="/companies">
                  <Route index element={<CompanyList />} />
                  <Route path="/companies/new" element={<Create />} />
                  <Route path="/companies/edit/:id" element={<EditPage />} />
                </Route>
              </Route>
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
