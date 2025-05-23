import React, { useState } from "react";

// Helper to parse "YYYY-MM-DD" as a local date (copied from WeeklyCalendar)
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Helper to check if a task is for today
function isToday(taskDate) {
  const today = new Date();
  const date = parseLocalDate(taskDate);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// Helper to format time as "HH:mm" (24-hour) or fallback to "--:--"
function formatTaskTime(timeStr) {
  if (!timeStr) return "--:--";
  // If already in "HH:mm" format, just return it
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  // Otherwise, try to parse and format
  const [hour, minute] = timeStr.split(":");
  if (hour && minute) {
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  }
  return "--:--";
}

export default function TodayTasksWidget({
  tasks,
  onToggleComplete,
  onAddTask,
}) {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [showAddInputs, setShowAddInputs] = useState(false);

  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const todayTasks = (tasks || []).filter((task) => isToday(task.date));

  // Sort by time if time exists
  todayTasks.sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  function handleAddTask() {
    if (!newTaskText.trim()) return;
    if (onAddTask) {
      onAddTask({
        text: newTaskText.trim(),
        date: todayStr,
        time: newTaskTime,
        completed: false,
      });
    }
    setNewTaskText("");
    setNewTaskTime("");
    setShowAddInputs(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleAddTask();
    }
  }

  return (
    <div
      className="absolute bottom-0 left-5 border border-white/40 p-6 rounded-2xl text-blue-900 max-w-sm mx-auto my-4
      transition-all duration-1500 ease-out transform shadow-lg
      hover:shadow-xl hover:scale-[1.02] backdrop-blur-md bg-white/40"
    >
      <div className="font-bold text-xl mb-2 text-indigo-700">
        Today's Tasks
      </div>
      {todayTasks.length === 0 ? (
        <div className="text-slate-400 italic">No tasks for today 🎉</div>
      ) : (
        <ul className="list-none space-y-1 pl-0">
          {todayTasks.map((task, idx) => (
            <li key={idx} className="flex items-center gap-2 text-blue-900">
              <input
                type="checkbox"
                checked={!!task.completed}
                onChange={() => onToggleComplete && onToggleComplete(task)}
                className="accent-indigo-500 w-4 h-4"
              />
              {task.time && (
                <span className="text-s font-mono text-blue-900 min-w-[3.5em]">
                  {formatTaskTime(task.time)}
                </span>
              )}
              <span className={task.completed ? "line-through" : ""}>
                {task.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Add Task Section */}
      <div className="mt-4 flex flex-col gap-2">
        {!showAddInputs ? (
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors"
            onClick={() => setShowAddInputs(true)}
          >
            Add Task
          </button>
        ) : (
          <>
            <input
              type="text"
              className="border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="New task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <input
              type="time"
              className="border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors"
                onClick={handleAddTask}
              >
                Add
              </button>
              <button
                className="bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded transition-colors"
                onClick={() => {
                  setShowAddInputs(false);
                  setNewTaskText("");
                  setNewTaskTime("");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
