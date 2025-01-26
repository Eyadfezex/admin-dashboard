// Import necessary modules and components
import { useSearchParams } from "react-router-dom"; // Hook for handling query parameters in the URL
import { useModalForm } from "@refinedev/antd"; // Hook for managing modal forms in Refine framework
import { useNavigation } from "@refinedev/core"; // Hook for handling navigation actions in Refine
import { Form, Input, Modal } from "antd"; // UI components from Ant Design
import { CREATE_TASK_MUTATION } from "@/graphql/mutations"; // GraphQL mutation for creating tasks

// Define the TasksCreatePage component
const TasksCreatePage = () => {
  // Extract query parameters from the URL
  const [searchParams] = useSearchParams();

  // Get navigation helper functions
  const { list } = useNavigation();

  // Configure the modal form using Refine's useModalForm hook
  const { formProps, modalProps, close } = useModalForm({
    action: "create", // Specifies that this is a create action
    defaultVisible: true, // Modal should be visible by default
    meta: {
      gqlMutation: CREATE_TASK_MUTATION, // Specifies the GraphQL mutation to use
    },
  });

  console.log("formProps:", formProps); // Log the form properties for debugging

  return (
    // Define the Modal component for adding a new task
    <Modal
      {...modalProps} // Spread modalProps for modal configuration
      title="Add new card" // Modal title
      onCancel={() => {
        close(); // Close the modal
        list("tasks", "replace"); // Navigate to the tasks list, replacing the current route
      }}
      width={512} // Modal width
    >
      {/* Define the form inside the modal */}
      <Form
        form={formProps.form} // Bind the form instance from formProps
        {...formProps} // Spread formProps for additional configurations
        layout="vertical" // Use a vertical form layout
        initialValues={{
          title: "", // Initial value for the title field
        }}
        onFinish={(values) => {
          // Handle form submission
          console.log("Form submitted values:", values); // Log submitted values for debugging
          formProps?.onFinish?.({
            ...values, // Include all form values
            stageId: searchParams.get("stageId")
              ? Number(searchParams.get("stageId")) // Get stageId from query parameters, if available
              : null, // Otherwise, set stageId to null
            userIds: [], // Set an empty array for userIds
          });
        }}
      >
        {/* Form item for the task title */}
        <Form.Item
          label="Title" // Label for the input field
          name="title" // Name of the form field
          rules={[{ required: true, message: "Title is required" }]} // Validation rule: title is required
        >
          <Input /> {/* Input field for the title */}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TasksCreatePage; // Export the component as the default export
