import { memo, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useTaskContext } from "../stores/useTaskContext";

type AddTaskFormProps = {
  activeTaskList: number,
  onChange : (listId: string, name: string) => void,
  externalOpen?: boolean,
  setExternalOpen?: React.Dispatch<React.SetStateAction<boolean>>,
};

const AddTaskForm = ({ activeTaskList, onChange, externalOpen , setExternalOpen }: AddTaskFormProps) => {
  const { taskLists } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const listId = typeof externalOpen == "boolean" ? "" : taskLists[activeTaskList].id;
    onChange(listId, taskName.trim());
    setTaskName("");
    if(externalOpen && setExternalOpen) {
      setExternalOpen(false);
    }else{
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTaskName("");
    if(externalOpen && setExternalOpen){
      setExternalOpen(false);
    }else{
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-4">
      { typeof externalOpen != "boolean" && !isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-primary-font bg-sec-bg px-4 py-2 rounded-xl shadow"
        >
          <IconPlus size={20} />
          Add Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
          <input
            type="text"
            autoFocus
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder={`Task ${externalOpen ? "List" : ""} name`}
            className="px-3 py-2 border border-primary-font rounded-md placeholder-sec-font text-primary-font outline-none focus:border-app-color focus:ring-1 focus:ring-app-color"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              // disabled={!taskName.trim()}
              className="bg-app-color text-white px-4 py-2 rounded-md shadow disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black px-4 py-2 rounded-md shadow"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default memo(AddTaskForm);
