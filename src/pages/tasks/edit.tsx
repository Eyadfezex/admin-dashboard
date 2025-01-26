import { useState } from "react";
import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import {
  AlignLeftOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import {
  Accordion,
  DescriptionForm,
  DescriptionHeader,
  DueDateForm,
  DueDateHeader,
  StageForm,
  TitleForm,
  UsersForm,
  UsersHeader,
} from "@/components";
import { Task } from "@/graphql/schema.types";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

const TasksEditPage = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>();

  // use the list method from useNavigation to navigate to the task list after editing
  const { list } = useNavigation();

  // Create a modal form to edit the task using the useModalForm hook
  // modalProps manages modal state, close closes the modal, queryResult contains the task data
  const { modalProps, close, queryResult } = useModalForm<Task>({
    action: "edit", // Set the action type to edit for modifying a task
    defaultVisible: true, // Make the modal visible by default
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION, // GraphQL mutation to update task
    },
  });

  // Extract the task data from queryResult
  const { description, dueDate, users, title } = queryResult?.data?.data ?? {};

  // Loading state while the task data is being fetched
  const isLoading = queryResult?.isLoading ?? true;

  return (
    <Modal
      {...modalProps} // Spread the modalProps to handle modal functionality
      className="kanban-update-modal"
      onCancel={() => {
        close(); // Close the modal
        list("tasks", "replace"); // Navigate to the task list page after canceling
      }}
      title={<TitleForm initialValues={{ title }} isLoading={isLoading} />} // Render the title form
      width={586}
      footer={
        <DeleteButton
          type="link"
          onSuccess={() => {
            list("tasks", "replace"); // Navigate to the task list after successful deletion
          }}
        >
          Delete card
        </DeleteButton>
      }
    >
      {/* Render the stage form for editing the task's stage */}
      <StageForm isLoading={isLoading} />

      {/* Render the description form in an accordion with an icon */}
      <Accordion
        accordionKey="description"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DescriptionHeader description={description} />} // Fallback content when the form is not active
        isLoading={isLoading}
        icon={<AlignLeftOutlined />}
        label="Description"
      >
        <DescriptionForm
          initialValues={{ description }} // Set the initial value for the description form
          cancelForm={() => setActiveKey(undefined)} // Function to cancel editing
        />
      </Accordion>

      {/* Render the due date form in an accordion */}
      <Accordion
        accordionKey="due-date"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DueDateHeader dueData={dueDate} />} // Fallback content for due date
        isLoading={isLoading}
        icon={<FieldTimeOutlined />}
        label="Due date"
      >
        <DueDateForm
          initialValues={{ dueDate: dueDate ?? undefined }} // Set initial value for due date
          cancelForm={() => setActiveKey(undefined)} // Function to cancel editing
        />
      </Accordion>

      {/* Render the users form in an accordion */}
      <Accordion
        accordionKey="users"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<UsersHeader users={users} />} // Fallback content for users
        isLoading={isLoading}
        icon={<UsergroupAddOutlined />}
        label="Users"
      >
        <UsersForm
          initialValues={{
            userIds: users?.map((user) => ({
              label: user.name,
              value: user.id,
            })),
          }} // Set initial values for users in the form
          cancelForm={() => setActiveKey(undefined)} // Function to cancel editing
        />
      </Accordion>
    </Modal>
  );
};

export default TasksEditPage;
