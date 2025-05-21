import { useCallback, useEffect, useState } from "react";
import type { TaskListType, TaskType } from "../stores/Task";

const initialValue: TaskListType[] = [{
    id: new Date().toString(),
    name: "Task List 1",
    tasks: [],
  }];
function useLocalStorageTasks(key: string) {
  const [taskLists, setTaskLists] = useState<TaskListType[]>(() => {
    try {
      const item = localStorage.getItem(key);
      const parsedItem = item ? JSON.parse(item) : null;
      return parsedItem || initialValue;
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      return initialValue;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(taskLists));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [key, taskLists]);

  // Actions

  const addTask = useCallback((listId: string, name: string) => {
    if (!name.trim()) return;
    setTaskLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: [
                ...list.tasks,
                {
                  id: Date.now().toString(),
                  name,
                  isCompleted: false,
                  createdAt: new Date(),
                  seqNo: list.tasks.length + 1,
                },
              ],
            }
          : list
      )
    );
  }, []);

  const deleteTask = useCallback((listId: string, taskId: string) => {
    setTaskLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== taskId),
            }
          : list
      )
    );
  }, []);

  const toggleTask = useCallback((listId: string, taskId: string) => {
    setTaskLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, isCompleted: !task.isCompleted }
                  : task
              ),
            }
          : list
      )
    );
  }, []);

  const updateTaskOrder = useCallback((listId: string, newTasks: TaskType[]) => {
  setTaskLists((prev) =>
    prev.map((list) =>
      list.id === listId
        ? {
            ...list,
            tasks: newTasks,
          }
        : list
    )
  );
}, []);

  const addTaskList = useCallback((name: string) => {
    if (!name.trim()) return;

    setTaskLists((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        tasks: [],
      },
    ]);
  }, []);

  const updateTaskName = useCallback((listId: string, taskId: string, newName: string) => {
    console.log("updateTaskName", listId, taskId, newName);
    if (!newName.trim()) return;
    setTaskLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((task) => {
                return task.id === taskId ? { ...task, name: newName } : task
              }
              ),
            }
          : list
      )
    );
  }, []);

  return {
    taskLists,
    setTaskLists,
    addTask,
    deleteTask,
    toggleTask,
    updateTaskName,
    updateTaskOrder,
    addTaskList
  };
}

export default useLocalStorageTasks;