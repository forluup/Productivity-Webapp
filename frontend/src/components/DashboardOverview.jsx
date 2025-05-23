import React, { useEffect, useState } from "react";
import Greeting from "./Greeting";
import WeatherWidget from "./WeatherWidget";
import Clock from "./Clock";
import QuoteWidget from "./QuoteWidget";
import TodayTasksWidget from "./TodaysTasksWidget";

function DashboardOverview({
  name,
  tasks,
  handleToggleTaskCompleted,
  handleAddTask,
}) {
  return (
    <div className="flex flex-col items-center my-8">
      <WeatherWidget />
      <div className="flex flex-col items-center gap-y-5">
        <Greeting name={name} />
        <Clock />
        <QuoteWidget />
        <TodayTasksWidget
          tasks={tasks}
          onToggleComplete={handleToggleTaskCompleted}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
}

export default DashboardOverview;
