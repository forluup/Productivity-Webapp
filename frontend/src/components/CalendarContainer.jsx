import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarContainer({ selectedDate, onChange }) {
  return (
    <div className="bg-white rounded shadow border border-slate-200 p-4 max-w-xs mx-auto">
      <h2 className="text-xl font-bold mb-4 text-indigo-600 text-center">Calendar</h2>
      <Calendar
        onChange={onChange}
        value={selectedDate}
        className="rounded"
      />
    </div>
  );
}

export default CalendarContainer;