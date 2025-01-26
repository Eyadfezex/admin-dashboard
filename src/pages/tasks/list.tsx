import {
  KanabanColumnSkeleton,
  KanbanBoard,
  KanbanBoardContainer,
  KanbanColumn,
  KanbanItem,
  ProjectCardSkeleton,
} from "@/components";
import { ProjectCardMemo } from "@/components/tasks/kanban/card";
import { KanbanAddCardButton } from "@/components/tasks/kanban/kanban-add-card-button";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { PropsWithChildren, useMemo } from "react";

// List component for rendering the Kanban board with tasks and stages
const List = ({ children }: PropsWithChildren) => {
  // Hook to mutate task data
  const { mutate: updateTask } = useUpdate();

  // Hook for navigation
  const { replace } = useNavigation();

  // Fetching task stages
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });

  // Fetching tasks
  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    queryOptions: {
      enabled: !!stages,
    },
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });

  // Processing tasks and stages into grouped columns for the board
  const taskStages = useMemo(() => {
    if (!stages?.data || !tasks?.data) {
      return {
        unsignedStage: [],
        stages: [],
      };
    }
    const unsignedStage = tasks.data.filter((task) => task.stageId == null);
    const grouped = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter(
        (task) => task?.stageId?.toString() === stage.id
      ),
    }));
    return {
      unsignedStage,
      columns: grouped,
    };
  }, [stages, tasks]);

  // Handler for adding a new task card
  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unsigned"
        ? "/tasks/new"
        : `/tasks/new/?stageId=${args.stageId}`;
    replace(path);
  };

  // Handler for drag and drop functionality
  const handleOnDragEnd = (event: DragEndEvent) => {
    const stageId = event.over?.id as string | null | undefined;
    const taskId = event.active?.id as string;
    const taskStageId = event.active.data.current?.stageId as
      | string
      | null
      | undefined;

    // Prevent update if the task remains in the same stage
    if (taskStageId === stageId) return;

    const newStageId = stageId === "unsigned" ? null : stageId;

    // Update task stage after drag
    updateTask({
      resource: "tasks",
      id: taskId,
      values: {
        stageId: newStageId,
      },
      successNotification: false,
      mutationMode: "optimistic",
      meta: {
        gqlMutation: UPDATE_TASK_STAGE_MUTATION,
      },
    });
  };

  // Loading state to display a skeleton when data is being fetched
  const isLoading = isLoadingStages || isLoadingTasks;
  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          {/* Unsigned tasks column */}
          <KanbanColumn
            id="unsigned"
            title="unsigned"
            count={taskStages.unsignedStage.length || 0}
            onAddClick={() => {
              handleAddCard({ stageId: "unsigned" });
            }}
          >
            {taskStages.unsignedStage.map((task, i) => (
              <KanbanItem
                key={i}
                id={task.id || ""}
                data={{ ...task, stageId: "unsigned" }}
              >
                <ProjectCardMemo
                  id={task.id}
                  title={task.title}
                  updatedAt={task.updatedAt}
                />
              </KanbanItem>
            ))}
            {!taskStages.unsignedStage.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unsigned" })}
              />
            )}
          </KanbanColumn>

          {/* Loop through each stage and render columns */}
          {taskStages.columns?.map((column, i) => (
            <KanbanColumn
              key={i}
              id={column.id}
              title={column.title}
              count={column.tasks.length || 0}
              onAddClick={() => handleAddCard({ stageId: column.id })}
            >
              {!isLoading &&
                column.tasks.map((task, i) => (
                  <KanbanItem key={i} id={task.id} data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
              {!column.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: column.id })}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
};

export default List;

// PageSkeleton component to display a loading placeholder while tasks and stages are loading
const PageSkeleton = () => {
  const columnCount = 6; // Number of columns to display
  const itemCount = 4; // Number of items per column

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, i) => (
        <KanabanColumnSkeleton key={i}>
          {Array.from({ length: itemCount }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </KanabanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
