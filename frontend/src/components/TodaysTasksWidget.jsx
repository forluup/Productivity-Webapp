import React from "react";

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

export default function TodayTasksWidget({ tasks }) {
  const todayTasks = (tasks || []).filter((task) => isToday(task.date));

  // Sort by time if time exists
  todayTasks.sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div
      className=" absolute bottom-0 left-60 border border-white/40 p-6 rounded-2xl text-blue-900 max-w-sm mx-auto my-4
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
            <li
              key={idx}
              className={`flex items-center gap-2 text-blue-900 ${
                task.completed ? "line-through text-blue-900" : ""
              }`}
            >
              <span className="text-s font-mono text-blue-900 min-w-[3.5em]">
                {formatTaskTime(task.time)}
              </span>
              <span>{task.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
