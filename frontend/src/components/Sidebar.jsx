import React from "react";

function Sidebar({ currentView, setCurrentView }) {
  return (
    <aside className="bg-indigo-700 text-white w-56 min-h-screen flex flex-col py-8 px-4 shadow-lg z-10">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Productivity Webapp V3
      </h2>
      <nav className="flex flex-col gap-4">
        <button
          className={`text-left px-4 py-2 rounded transition-colors ${
            currentView === "dashboard"
              ? "bg-indigo-500 font-semibold"
              : "hover:bg-indigo-600"
          }`}
          onClick={() => setCurrentView("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`text-left px-4 py-2 rounded transition-colors ${
            currentView === "calendar"
              ? "bg-indigo-500 font-semibold"
              : "hover:bg-indigo-600"
          }`}
          onClick={() => setCurrentView("calendar")}
        >
          Calendar
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
