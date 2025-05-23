import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import CalendarPage from "./components/CalendarPage";
import DashboardBackground from "./components/DashboardBackground";
import DarkModeToggle from "./components/DarkModeToggle";

// Helper to load tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
}

function Home() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [tasks, setTasks] = useState(loadTasks());
  const [name, setName] = useState("");
  const [inputName, setInputName] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    // Persist dark mode in localStorage
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Load name from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);
  }, []);

  // Keep tasks in sync with localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle name submission
  const handleSubmitName = (e) => {
    e.preventDefault();
    if (inputName.trim() === "") return;
    setName(inputName.trim());
    localStorage.setItem("userName", inputName.trim());
    setInputName("");
  };

  function handleToggleTaskComplete(toggledTask) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task === toggledTask ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleAddTask(newTask) {
    setTasks((tasks) => [...tasks, newTask]);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <DashboardBackground darkMode={darkMode} setDarkMode={setDarkMode} />

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-8 pt-24 relative">
        {currentView === "dashboard" && (
          <div className="max-w-4xl mx-auto">
            {!name ? (
              <form
                onSubmit={handleSubmitName}
                className="bg-white p-8 rounded shadow border border-slate-200 max-w-sm w-full mx-auto mt-16"
              >
                <h1 className="text-2xl font-bold mb-4 text-indigo-600 text-center">
                  Welcome!
                </h1>
                <label className="block mb-2 text-slate-700 text-center">
                  Please enter your name:
                </label>
                <input
                  className="w-full border border-slate-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded transition-colors"
                >
                  Continue
                </button>
              </form>
            ) : (
              <DashboardOverview
                name={name}
                tasks={tasks}
                handleToggleTaskCompleted={handleToggleTaskComplete}
                handleAddTask={handleAddTask}
              />
            )}
          </div>
        )}
        {currentView === "calendar" && (
          <CalendarPage tasks={tasks} setTasks={setTasks} />
        )}
      </main>
    </div>
  );
}

export default Home;
