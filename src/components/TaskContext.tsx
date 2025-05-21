// context/TaskContext.tsx
import React, { createContext } from "react";
import useLocalStorageTasks from "../hooks/localStorageHook";

type TaskContextType = ReturnType<typeof useLocalStorageTasks>;

export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const taskData = useLocalStorageTasks("taskLists");

  return (
    <TaskContext.Provider value={taskData}>
      {children}
    </TaskContext.Provider>
  );
};
