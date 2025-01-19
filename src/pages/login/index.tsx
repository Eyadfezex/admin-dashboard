import { AuthPage } from "@refinedev/antd";
import { authCredentials } from "../../Providers/auth";
export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
