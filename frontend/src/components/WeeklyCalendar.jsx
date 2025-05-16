import React, { useMemo, useState, useEffect, useCallback } from "react";

// Helper to get start of week (Sunday)
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper to get start of month
function getStartOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper to format date as "Month Day"
function formatDay(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Helper to format date as "Month Year"
function formatMonthYear(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Helper to parse "YYYY-MM-DD" as a local date (no timezone bug)
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Helper to get days in month
function getDaysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

const HOURS = Array.from(
  { length: 12 },
  (_, i) => `${String(i + 8).padStart(2, "0")}:00`
); // 08:00 to 19:00

function WeeklyCalendar({ tasks, selectedDate, onSelectDate }) {
  const [view, setView] = useState("weekly"); // "daily" | "weekly" | "monthly"
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  // --- Common date calculations ---
  const startOfWeek = useMemo(
    () => getStartOfWeek(selectedDate),
    [selectedDate]
  );
  const startOfMonth = useMemo(
    () => getStartOfMonth(selectedDate),
    [selectedDate]
  );
  const daysInMonth = useMemo(
    () => getDaysInMonth(selectedDate),
    [selectedDate]
  );

  // --- Group tasks by date and time (show all tasks, completed or not) ---
  const tasksByDateTime = useMemo(() => {
    const map = {};
    for (const task of tasks) {
      if (!task.time) continue;
      const dateStr = parseLocalDate(task.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!map[dateStr]) map[dateStr] = {};
      const [hour] = task.time.split(":");
      const hourKey = `${hour.padStart(2, "0")}:00`;
      map[dateStr][hourKey] = map[dateStr][hourKey] || [];
      map[dateStr][hourKey].push(task);
    }
    return map;
  }, [tasks]);

  // --- Group tasks by date (for monthly view) ---
  const tasksByDate = useMemo(() => {
    const map = {};
    for (const task of tasks) {
      const dateStr = parseLocalDate(task.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      map[dateStr] = map[dateStr] || [];
      map[dateStr].push(task);
    }
    return map;
  }, [tasks]);

  // --- Navigation handlers ---
  const handlePrev = useCallback(() => {
    let newDate = new Date(selectedDate);
    if (view === "daily") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === "weekly") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === "monthly") {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onSelectDate(newDate);
  }, [selectedDate, view, onSelectDate]);

  const handleNext = useCallback(() => {
    let newDate = new Date(selectedDate);
    if (view === "daily") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === "weekly") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === "monthly") {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onSelectDate(newDate);
  }, [selectedDate, view, onSelectDate]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // --- Daily View ---
  function renderDailyView() {
    const dayStr = selectedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
              onClick={handlePrev}
              aria-label="Previous Day"
            >
              &larr;
            </button>
            <h2 className="text-xl font-bold text-indigo-600">
              Daily View: {formatDay(selectedDate)}
            </h2>
            <button
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
              onClick={handleNext}
              aria-label="Next Day"
            >
              &rarr;
            </button>
          </div>
        </div>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 w-20 text-slate-500">Time</th>
              <th className="border-b p-2 text-slate-700">
                {formatDay(selectedDate)}
              </th>
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => {
              const cellTasks =
                (tasksByDateTime[dayStr] && tasksByDateTime[dayStr][hour]) ||
                [];
              return (
                <tr key={hour}>
                  <td className="border-b p-2 text-slate-500 font-mono">
                    {hour}
                  </td>
                  <td className="border-b p-2 align-top">
                    {cellTasks.map((task, i) => (
                      <div
                        key={i}
                        className={`mb-1 px-2 py-1 rounded text-sm ${
                          task.completed
                            ? "bg-slate-200 line-through text-slate-400"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {task.text}
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="text-xs text-slate-400 mt-2"></div>
      </div>
    );
  }

  // --- Weekly View ---
  function renderWeeklyView() {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
              onClick={handlePrev}
              aria-label="Previous Week"
            >
              &larr;
            </button>
            <h2 className="text-xl font-bold text-indigo-600">Weekly View</h2>
            <button
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
              onClick={handleNext}
              aria-label="Next Week"
            >
              &rarr;
            </button>
          </div>
        </div>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 w-20 text-slate-500">Time</th>
              {days.map((day, idx) => (
                <th
                  key={idx}
                  className={`border-b p-2 text-slate-700 cursor-pointer ${
                    day.toDateString() === selectedDate.toDateString()
                      ? "bg-indigo-100 font-bold"
                      : ""
                  }`}
                  onClick={() => onSelectDate(day)}
                >
                  {formatDay(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className="border-b p-2 text-slate-500 font-mono">
                  {hour}
                </td>
                {days.map((day, idx) => {
                  const dateStr = day.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  const cellTasks =
                    (tasksByDateTime[dateStr] &&
                      tasksByDateTime[dateStr][hour]) ||
                    [];
                  return (
                    <td key={idx} className="border-b p-2 align-top">
                      {cellTasks.map((task, i) => (
                        <div
                          key={i}
                          className={`mb-1 px-2 py-1 rounded text-sm ${
                            task.completed
                              ? "bg-slate-200 line-through text-slate-400"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {task.text}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-slate-400 mt-2"></div>
      </div>
    );
  }

  // --- Monthly View ---
  function renderMonthlyView() {
    // Build a grid for the month
    const year = startOfMonth.getFullYear();
    const month = startOfMonth.getMonth();
    const firstDayOfWeek = startOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const totalDays = daysInMonth;
    const weeks = [];
    let dayNum = 1 - firstDayOfWeek;
    for (let w = 0; w < 6; w++) {
      // up to 6 weeks in a month
      const week = [];
      for (let d = 0; d < 7; d++) {
        if (dayNum > 0 && dayNum <= totalDays) {
          week.push(new Date(year, month, dayNum));
        } else {
          week.push(null);
        }
        dayNum++;
      }
      weeks.push(week);
      if (dayNum > totalDays) break;
    }
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
              onClick={handlePrev}
              aria-label="Previous Month"
            >
              &larr;
            </button>
            <h2 className="text-xl font-bold text-indigo-600">
              {formatMonthYear(selectedDate)}
            </h2>
            <button
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
              onClick={handleNext}
              aria-label="Next Month"
            >
              &rarr;
            </button>
          </div>
        </div>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <th key={d} className="border-b p-2 text-slate-700">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  if (!day) {
                    return (
                      <td
                        key={di}
                        className="border-b p-2 bg-slate-50 min-w-[6rem] h-32"
                      ></td>
                    );
                  }
                  const dateStr = day.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  const cellTasks = tasksByDate[dateStr] || [];
                  return (
                    <td
                      key={di}
                      className="border-b p-2 align-top min-w-[6rem] h-32 bg-white"
                      style={{ verticalAlign: "top" }}
                    >
                      <button
                        type="button"
                        className={`font-bold text-xs mb-1 rounded w-8 h-8 flex items-center justify-center transition
                        ${
                          day.toDateString() === selectedDate.toDateString()
                            ? "bg-indigo-500 text-white"
                            : "hover:bg-indigo-100"
                        }
                      `}
                        onClick={() => onSelectDate(day)}
                      >
                        {day.getDate()}
                      </button>
                      {cellTasks.map((task, i) => (
                        <div
                          key={i}
                          className={`mb-1 px-2 py-1 rounded text-xs ${
                            task.completed
                              ? "bg-slate-200 line-through text-slate-400"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {task.text}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-slate-400 mt-2"></div>
      </div>
    );
  }

  // --- View Switcher ---
  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg border border-slate-200 p-4 overflow-x-auto relative
        transition-all duration-700
        ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            view === "daily"
              ? "bg-indigo-500 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
          onClick={() => setView("daily")}
        >
          Daily
        </button>
        <button
          className={`px-3 py-1 rounded ${
            view === "weekly"
              ? "bg-indigo-500 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
          onClick={() => setView("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-3 py-1 rounded ${
            view === "monthly"
              ? "bg-indigo-500 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
          onClick={() => setView("monthly")}
        >
          Monthly
        </button>
      </div>
      {view === "daily" && renderDailyView()}
      {view === "weekly" && renderWeeklyView()}
      {view === "monthly" && renderMonthlyView()}
    </div>
  );
}

export default WeeklyCalendar;
