// import type { TaskListType } from "../stores/Task";

// function TaskList({ taskList } : { taskList : TaskListType[]}) {
//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-72 bg-main-bg border-r border-gray-300 py-4 px-2">
//         <h2 className="text-xl font-semibold mb-4 text-primary-font">Task List</h2>
//         <ul className="space-y-2">
//           {taskList.map((task) => (
//             <li
//               key={task.id}
//               className="p-2 bg-sec-bg rounded-md shadow cursor-pointer transition text-primary-font"
//             >
//               {task.name}
//             </li>
//           ))}
//         </ul>
//       </aside>
//     </div>
//   );
// }

// export default TaskList;



import { IconPlus, IconX } from "@tabler/icons-react";
import { useTaskContext } from "../stores/useTaskContext";
import { useState } from "react";
import AddTaskForm from "./AddTasks";

type Props = {
  setActiveTaskList: React.Dispatch<React.SetStateAction<number>>;
  isMobileOpen: boolean;
  activeTaskList: number;
  onClose: () => void;
};

function TaskList({setActiveTaskList, isMobileOpen, onClose, activeTaskList }: Props) {
  const { taskLists } = useTaskContext();
  const [showAddTaskList, setShowAddTaskList] = useState(false);
  const { addTaskList } = useTaskContext();
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 bg-main-bg border-r border-gray-300 py-4 px-2 min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary-font">Task List</h2>
          <div onClick={()=>{setShowAddTaskList(true)}} className="cursor-pointer">
            <IconPlus size={20} className="text-primary-font" />
          </div>
        </div>
        {showAddTaskList ? <AddTaskForm activeTaskList={activeTaskList} onChange={(_, name)=>addTaskList(name)} externalOpen={showAddTaskList} setExternalOpen={setShowAddTaskList} /> : ""}
        <ul className="space-y-2">
          {taskLists.map((task, index) => (
            <li
              key={task.id}
              onClick={()=>{setActiveTaskList(index)}}
              className={`p-2 bg-sec-bg rounded-md shadow cursor-pointer transition text-primary-font capitalize ${index == activeTaskList ? "!bg-app-color text-white" : ""}`}
            >
              {task.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-main-bg z-50 px-4 py-6 md:hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center justify-start mb-4">
                <h2 className="text-xl font-semibold text-primary-font mr-4">Task List</h2>
                <div onClick={()=>{setShowAddTaskList(true)}} className="cursor-pointer">
                  <IconPlus size={20} className="text-primary-font" />
                </div>
              </div>
              {showAddTaskList ? <AddTaskForm activeTaskList={activeTaskList} onChange={(_, name)=>addTaskList(name)} externalOpen={showAddTaskList} setExternalOpen={setShowAddTaskList} /> : ""}
            </div>
            <button onClick={onClose} className="text-primary-font">
              <IconX size={28} />
            </button>
          </div>
          <ul className="space-y-2">
            {taskLists.map((task,index) => (
              <li
                onClick={()=>{setActiveTaskList(index); onClose()}}
                key={task.id}
                className={`p-2 bg-sec-bg rounded-md shadow cursor-pointer transition text-primary-font capitalize ${index == activeTaskList ? "!bg-app-color text-white" : ""}`}
              >
                {task.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default TaskList;

