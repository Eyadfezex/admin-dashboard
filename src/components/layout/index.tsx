import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import Header from "./header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titleProps) => <ThemedTitleV2 {...titleProps} text="refine" />}
    >
      {children}
    </ThemedLayoutV2>
  );
};

export default Layout;
