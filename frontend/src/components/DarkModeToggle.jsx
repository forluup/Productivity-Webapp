import React from "react";

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow transition"
      aria-label="Toggle dark mode"
    >
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
