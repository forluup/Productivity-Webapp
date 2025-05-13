import React, { useState, useEffect } from "react";

// Helper to parse "YYYY-MM-DD" as a local date (no timezone bug)
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Helper to format date for display (e.g., "June 7, 2024")
function formatDisplayDate(dateInput) {
  // Accepts either a Date object or a string
  const date =
    typeof dateInput === "string" ? parseLocalDate(dateInput) : dateInput;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to format date for input[type="date"] (e.g., "2024-06-07")
function formatInputDate(dateInput) {
  if (!dateInput) return "";
  // If already a string in YYYY-MM-DD, return as is
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  // Otherwise, format Date object as YYYY-MM-DD
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TaskList({ selectedDate, tasks, setTasks }) {
  // Default new task date is the currently selected date
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState(formatInputDate(selectedDate));
  const [newTime, setNewTime] = useState("09:00");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingTime, setEditingTime] = useState("09:00");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setNewDate(formatInputDate(selectedDate));
  }, [selectedDate]);

  // Trigger fade-in on mount
  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  // Add a new task with chosen date and time
  const handleAddTask = () => {
    if (newTask.trim() === "" || !newDate) return;
    const updatedTasks = [
      ...tasks,
      {
        text: newTask.trim(),
        date: newDate,
        time: newTime,
        completed: false,
      },
    ];
    setTasks(updatedTasks);
    setNewTask("");
    setNewDate(formatInputDate(selectedDate));
    setNewTime("09:00");
  };

  // Mark a task as completed
  const handleCompleteTask = (index) => {
    const filteredTasks = filteredTasksForSelectedDate();
    const taskToComplete = filteredTasks[index];
    const updatedTasks = tasks.map((task) =>
      task === taskToComplete ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
  };

  // Delete a task (by index in filtered list)
  const handleDeleteTask = (index) => {
    const filteredTasks = filteredTasksForSelectedDate();
    const taskToDelete = filteredTasks[index];
    const updatedTasks = tasks.filter((task) => task !== taskToDelete);
    setTasks(updatedTasks);
  };

  // Start editing a task
  const handleEditTask = (index) => {
    const filteredTasks = filteredTasksForSelectedDate();
    setEditingIndex(index);
    setEditingText(filteredTasks[index].text);
    setEditingDate(filteredTasks[index].date);
    setEditingTime(filteredTasks[index].time || "09:00");
  };

  // Save edited task
  const handleSaveEdit = () => {
    if (editingText.trim() === "" || !editingDate) return;
    const filteredTasks = filteredTasksForSelectedDate();
    const taskToEdit = filteredTasks[editingIndex];
    const updatedTasks = tasks.map((task) =>
      task === taskToEdit
        ? {
            ...task,
            text: editingText.trim(),
            date: editingDate,
            time: editingTime,
          }
        : task
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
    setEditingDate("");
    setEditingTime("09:00");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
    setEditingDate("");
    setEditingTime("09:00");
  };

  // Filter tasks for the currently selected date (from calendar)
  function filteredTasksForSelectedDate() {
    const selectedDateStr = formatInputDate(selectedDate);
    return tasks
      .filter((task) => task.date === selectedDateStr)
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }

  const tasksForDate = filteredTasksForSelectedDate();

  return (
    <div
      className={`max-w-md mx-auto p-4 bg-white rounded-xl shadow border border-slate-200
        transition-all duration-700
        ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        Tasks for {formatDisplayDate(selectedDate)}
      </h2>
      {/* Responsive Add Row */}
      <div className="flex flex-col gap-2 mb-4 w-full">
        {/* Task input row */}
        <input
          className="border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
        {/* Date and time row */}
        <div className="flex flex-col gap-2 w-full md:flex-row md:items-center">
          <input
            className="border border-slate-300 rounded px-2 py-1 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <input
            className="border border-slate-300 rounded px-2 py-1 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </div>
        {/* Add button row */}
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors w-full"
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>
      <ul>
        {tasksForDate.map((task, index) => (
          <li
            key={index}
            className="flex items-center justify-between mb-2 border-b border-slate-200 pb-1"
          >
            {editingIndex === index ? (
              // Responsive Edit Row
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-2 md:flex-row md:items-center w-full">
                  <input
                    className="flex-1 border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                  />
                  <input
                    className="border border-slate-300 rounded px-2 py-1 w-full md:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="date"
                    value={editingDate}
                    onChange={(e) => setEditingDate(e.target.value)}
                  />
                  <input
                    className="border border-slate-300 rounded px-2 py-1 w-full md:w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    type="time"
                    value={editingTime}
                    onChange={(e) => setEditingTime(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-2 rounded transition-colors w-full md:w-auto"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-slate-400 hover:bg-slate-500 text-white px-2 py-2 rounded transition-colors w-full md:w-auto"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 text-slate-700 ${
                    task.completed ? "line-through text-slate-400" : ""
                  }`}
                >
                  <span className="font-mono text-slate-500 mr-2">
                    {task.time}
                  </span>
                  {task.text}
                </span>
                {!task.completed && (
                  <>
                    <button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded mr-1 transition-colors"
                      onClick={() => handleEditTask(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded mr-1 transition-colors"
                      onClick={() => handleCompleteTask(index)}
                    >
                      Complete
                    </button>
                  </>
                )}
                {task.completed && (
                  <button
                    className="bg-slate-500 hover:bg-slate-600 text-white px-2 py-1 rounded transition-colors"
                    onClick={() => handleDeleteTask(index)}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      {tasksForDate.length === 0 && (
        <p className="text-slate-400 text-center">No tasks for this date.</p>
      )}
    </div>
  );
}

export default TaskList;
