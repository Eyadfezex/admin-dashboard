import {
  KanabanColumnSkeleton,
  KanbanBoard,
  KanbanBoardContainer,
  KanbanColumn,
  KanbanItem,
  ProjectCard,
  ProjectCardSkeleton,
} from "@/components";
import {} from "@/components";
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

const List = ({ children }: PropsWithChildren) => {
  const { mutate: updateTask } = useUpdate();
  const { replace } = useNavigation();
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
  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unsigned"
        ? "/tasks/new"
        : `/tasks/new/?stageId=${args.stageId}`;
    replace(path);
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    const stageId = event.over?.id as string | null | undefined;
    const taskId = event.active?.id as string;
    const taskStageId = event.active.data.current?.stageId as
      | string
      | null
      | undefined;

    if (taskStageId === stageId) return;

    const newStageId = stageId === "unsigned" ? null : stageId;

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

  const isLoading = isLoadingStages || isLoadingTasks;
  if (isLoading) {
    return <PageSkeleton />;
  }
  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
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
const PageSkeleton = () => {
  const columnCount = 6;
  const itemCount = 4;
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
