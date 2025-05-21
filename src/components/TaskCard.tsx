import { IconTrash } from "@tabler/icons-react";
import CustomCheckbox from "./Checkbox";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTaskContext } from "../stores/useTaskContext";
import AddTaskForm from "./AddTasks";
import type { TaskType } from "../stores/Task";

type TaskCardProps = {
  activeTaskList: number;
};

const FilterMapper = {
  all: "All",
  completed: "Completed",
  pending: "Pending",
};

const TaskOverviewCards = ({ task }: {task: TaskType[]}) => {
  const overview = useMemo(() => {
    const total = task.length;
    const completed = task.filter((t) => t.isCompleted).length;
    const pending = total - completed;

    return { total, completed, pending };
  }, [task]);

  return (
    <div className="flex gap-8 max-md:gap-2 mb-6">
      {/* Total Card */}
      <div className="flex-1 border-2 border-sec-font rounded-md px-4 py-2 text-center">
        <h3 className="text-md font-semibold text-sec-font border-sec-font">Total</h3>
        <p className="text-lg font-bold text-sec-font border-sec-font">{overview.total}</p>
      </div>

      {/* Completed Card */}
      <div className="flex-1 border-2 border-app-color rounded-md px-4 py-2 text-center">
        <h3 className="text-md font-semibold text-app-color">Completed</h3>
        <p className="text-lg font-bold text-app-color">{overview.completed}</p>
      </div>

      {/* Pending Card */}
      <div className="flex-1 border-2 border-yellow-400 rounded-md px-4 py-2 text-center">
        <h3 className="text-md font-semibold text-yellow-400">Pending</h3>
        <p className="text-lg font-bold text-yellow-400">{overview.pending}</p>
      </div>
    </div>
  );
};

const TaskCard = ({ activeTaskList }: TaskCardProps) => {
  const { taskLists, addTask, toggleTask, updateTaskOrder, deleteTask } =
    useTaskContext();

  const tagListId = useMemo(() => {
    return taskLists[activeTaskList].id;
  }, [activeTaskList, taskLists]);

  const tasks = useMemo(() => {
    const taskList = taskLists[activeTaskList];
    if (taskList) {
      return taskList.tasks;
    }
    return [];
  }, [activeTaskList, taskLists]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, movedTask);

    const reordered = updatedTasks.map((task, index) => ({
      ...task,
      seqNo: index + 1,
    }));

    updateTaskOrder(tagListId, reordered);
  };

  const [activeFilter, setActiveFilter] = useState("all");

  // ✅ Create a stable sorted task list outside JSX
  const useFilteredSortedTasks = useMemo(() => {
    let filteredTasks = tasks;

    if (activeFilter === "completed") {
      filteredTasks = tasks.filter((task) => task.isCompleted);
    } else if (activeFilter === "pending") {
      filteredTasks = tasks.filter((task) => !task.isCompleted);
    }

    return [...filteredTasks].sort((a, b) => a.seqNo - b.seqNo);
  }, [tasks, activeFilter]);

  const [lastAddedTaskId, setLastAddedTaskId] = useState<string | null>(null);
  const [isNewAdded, setIsNewAdded] = useState<boolean>(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const prevTasksLengthRef = useRef(tasks.length);

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      setDeletingTaskId(taskId);

      // After animation delay, call actual delete
      setTimeout(() => {
        console.log("Deleting task with ID:", taskId);
        deleteTask(tagListId, taskId);
        setDeletingTaskId(null);
      }, 300); // match animation duration
    },
    [deleteTask, tagListId]
  );

  const handleAddTask = useCallback(
    (taskId: string, name : string) => {
      setIsNewAdded(true);
      addTask(taskId, name);
    },
    [addTask]
  );

  useEffect(() => {
    if (tasks.length > prevTasksLengthRef.current && isNewAdded) {
      // New task added
      const newTask = tasks[tasks.length - 1];
      setLastAddedTaskId(newTask.id);
      // Reset after animation duration (300ms here)
      const timer = setTimeout(() => {
        setLastAddedTaskId(null);
        setIsNewAdded(false);
      }, 300);

      return () => clearTimeout(timer);
    }
    prevTasksLengthRef.current = tasks.length;
  }, [isNewAdded, tasks]);

  return (
    <div className="flex-1 px-4 bg-main-bg">
      <div className="text-md font-medium pt-2 text-sec-font">Task List: {taskLists?.[activeTaskList]?.name}</div>
      <div className="text-2xl font-bold py-4 text-primary-font">Tasks</div>
      <TaskOverviewCards task={tasks} />    
      <AddTaskForm activeTaskList={activeTaskList} onChange={handleAddTask} />
      <div className="flex justify-center">
        <div className="flex mb-4">
          {Object.entries(FilterMapper).map(([key, value]) => {
            return (
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                  activeFilter == key
                    ? "border-green-500 text-green-600"
                    : "text-sec-font border-gray-300"
                }`}
                onClick={() => {
                  setActiveFilter(key);
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <div
              className="max-h-[calc(60vh)] overflow-y-auto grid gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {useFilteredSortedTasks?.length ? useFilteredSortedTasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-start justify-between p-4 rounded-2xl shadow-md bg-sec-bg gap-2
                        ${lastAddedTaskId || deletingTaskId ? "transition-all duration-300 ease-out" : ""}
                        ${task.id === lastAddedTaskId ? "scale-105" : "scale-100"}
                        ${task.id === deletingTaskId ? "opacity-0 scale-90" : "opacity-100 scale-100"}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <CustomCheckbox
                          onChange={() => {toggleTask(tagListId, task.id);}}
                          checked={task.isCompleted}
                        />
                        <span
                          className={`${
                            task.isCompleted
                              ? "line-through text-gray-500"
                              : "text-primary-font"
                          }`}
                        >
                          {task.name}
                        </span>
                      </div>
                      <span className="text-sm text-primary-font">
                        <IconTrash
                          size={24}
                          onClick={() => {
                            handleDeleteTask(task.id);
                          }}
                        />
                      </span>
                    </div>
                  )}
                </Draggable>
              )) : (
                <div className={`p-4 rounded-2xl shadow-md bg-sec-bg gap-2 text-center text-sec-font`}>
                  <span>
                    No Task to Display
                  </span>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskCard;
