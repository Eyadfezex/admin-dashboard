import { Button, Popover } from "antd";
import CustomAvatar from "../custom-avatar";
import { useGetIdentity } from "@refinedev/core";
import type { User } from "@/graphql/schema.types";
import { Text } from "../text";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { AccountSettings } from "./account-settings";

const CurrentUser = () => {
  const { data: user } = useGetIdentity<User>();
  const name = user?.name;
  const src = user?.avatarUrl;
  const userId = user?.id;
  const [isOpen, setIsOpen] = useState(false);
  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Text strong style={{ padding: "12px 20px" }}>
        {name}
      </Text>
      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined color="blacks" />}
          type="text"
          block
          onClick={() => setIsOpen(!isOpen)}
        >
          Account Setting
        </Button>
      </div>
    </div>
  );
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        style={{ zIndex: 999 }}
        content={content}
      >
        <CustomAvatar
          name={name}
          src={src}
          size="default"
          style={{ cursor: "pointer" }}
        />
      </Popover>
      {user && (
        <AccountSettings
          opened={isOpen}
          setOpened={setIsOpen}
          userId={userId}
        />
      )}
    </>
  );
};

export default CurrentUser;
