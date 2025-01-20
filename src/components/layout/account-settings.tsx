import { SaveButton, useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin } from "antd";

import { getNameInitials } from "@/utils";
import { UPDATE_USER_MUTATION } from "@/graphql/mutations";

import { Text } from "../text";
import CustomAvatar from "../custom-avatar";

import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "@/graphql/types";

type Props = {
  opened: boolean;
  setOpened?: (opened: boolean) => void;
  userId?: string;
};

export const AccountSettings = ({
  opened,
  setOpened = () => {},
  userId,
}: Props) => {
  const { saveButtonProps, formProps, queryResult } = useForm<
    GetFields<UpdateUserMutation>,
    HttpError,
    GetVariables<UpdateUserMutationVariables>
  >({
    mutationMode: "optimistic",
    resource: "users",
    action: "edit",
    id: userId,
    meta: {
      gqlMutation: UPDATE_USER_MUTATION,
    },
  });

  const { avatarUrl, name } = queryResult?.data?.data || {
    avatarUrl: "",
    name: "",
  };

  const closeModal = () => {
    setOpened(false);
  };

  if (queryResult?.isLoading) {
    return (
      <Drawer
        open={opened}
        width={756}
        styles={{
          body: {
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: { background: "#f5f5f5", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Text strong>Account Settings</Text>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={closeModal}
          aria-label="Close Drawer"
        />
      </div>
      <div style={{ padding: "16px" }}>
        <Card>
          <Form {...formProps} layout="vertical">
            <CustomAvatar
              shape="square"
              src={avatarUrl || undefined}
              name={getNameInitials(name || "User")}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Job title" name="jobTitle">
              <Input placeholder="Job Title" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Phone" />
            </Form.Item>
          </Form>
          <SaveButton
            {...saveButtonProps}
            loading={saveButtonProps.loading || queryResult?.isLoading}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          />
        </Card>
      </div>
    </Drawer>
  );
};
