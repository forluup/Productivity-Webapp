import React, { useState } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import TaskList from "./Tasklist";

export default function CalendarPage({ tasks, setTasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTaskDate, setNewTaskDate] = useState(selectedDate);

  // Handler for selecting a day in the weekly calendar
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setNewTaskDate(date);
  };

  // Handler to update tasks from TaskList
  const handleTasksChange = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  return (
    <div className="relative min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-full md:w-2/3">
          <WeeklyCalendar
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </div>
        <div className="flex-1 z-0">
          <TaskList
            tasks={tasks}
            setTasks={handleTasksChange}
            selectedDate={selectedDate}
            newTaskDate={newTaskDate}
            setNewTaskDate={setNewTaskDate}
          />
        </div>
      </div>
    </div>
  );
}
