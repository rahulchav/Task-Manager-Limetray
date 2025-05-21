import { IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";
import TaskList from "./components/TaskList";
import { useState } from "react";
import TaskCard from "./components/TaskCard";

function App() {
  // dark mode state
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
  // mobile side bar open state
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // active Task list index
  const [activeTaskList, setActiveTaskList] = useState(0);
  return (
    <>
      <div>
        <div className="cursor-pointer">
          <div
            onClick={() => {
              document.documentElement.classList.toggle("dark");
              setDarkMode(!darkMode);
            }}
            className="absolute top-4 right-4 max-md:right-16 p-2 text-primary-font rounded-full shadow-md transition-colors duration-300"
            aria-label="Toggle Theme"
          >
            {darkMode ? <IconSun size={24} /> : <IconMoon size={24} />}
          </div>
        </div>
        <div className="flex w-full h-[100vh]">

          {/* Hamburger Icon */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden absolute top-4 right-4 z-50 bg-main-bg text-primary-font p-2 rounded-md shadow"
          >
            <IconMenu2 size={24} />
          </button>

          {/* Sidebar section */}
          <TaskList
            setActiveTaskList={setActiveTaskList}
            activeTaskList={activeTaskList}
            isMobileOpen={isMobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
          {/* TaskCards main section */}
          <TaskCard
            activeTaskList={activeTaskList}
          />
        </div>
      </div>
    </>
  );
}

export default App;
