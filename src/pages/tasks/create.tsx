import { useSearchParams } from "react-router-dom";
import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Form, Input, Modal } from "antd";
import { CREATE_TASK_MUTATION } from "@/graphql/mutations";

const TasksCreatePage = () => {
  // Get search parameters from the URL
  const [searchParams] = useSearchParams();

  /**
   * useNavigation is a hook by Refine that allows you to navigate to a page.
   * https://refine.dev/docs/routing/hooks/use-navigation/
   *
   * The list method navigates to the list page of the specified resource.
   * https://refine.dev/docs/routing/hooks/use-navigation/#list
   */
  const { list } = useNavigation();

  /**
   * useModalForm is a hook by Refine for managing forms inside modals.
   * It extends the useForm hook from the @refinedev/antd package.
   * https://refine.dev/docs/ui-integrations/ant-design/hooks/use-modal-form/
   *
   * formProps -> Manages form state and actions like onFinish, onValuesChange, etc.
   * It uses the useForm hook from @refinedev/antd internally.
   * https://refine.dev/docs/ui-integrations/ant-design/hooks/use-modal-form/#formprops
   *
   * modalProps -> Manages modal state and actions like onOk, onCancel, etc.
   * https://refine.dev/docs/ui-integrations/ant-design/hooks/use-modal-form/#modalprops
   */
  const { formProps, modalProps, close } = useModalForm({
    action: "create", // Specify the action type as 'create'
    defaultVisible: true, // Make the modal visible by default
    meta: {
      gqlMutation: CREATE_TASK_MUTATION, // Set the GraphQL mutation for creating a task
    },
  });

  return (
    <Modal
      {...modalProps} // Spread modalProps to handle modal visibility and actions
      onCancel={() => {
        close(); // Close the modal
        list("tasks", "replace"); // Navigate to the list page of tasks
      }}
      title="Add new card" // Modal title
      width={512}
    >
      <Form
        {...formProps} // Spread formProps to manage form state and validation
        layout="vertical" // Use vertical layout for the form fields
        onFinish={(values) => {
          // On form submit, add additional values like stageId and userIds
          formProps?.onFinish?.({
            ...values,
            stageId: searchParams.get("stageId")
              ? Number(searchParams.get("stageId"))
              : null, // Set the stageId based on the search params from URL
            userIds: [], // Default value for userIds
          });
        }}
      >
        {/* Title form input */}
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input /> {/* Input field for task title */}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TasksCreatePage;
