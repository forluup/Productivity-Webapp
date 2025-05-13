import React, { useEffect, useState } from "react";

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(date) {
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl shadow-lg px-8 py-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] z-0 w-145 h-36 backdrop-blur-md bg-white/40 border border-white/30">
      <div
        className="text-5xl md:text-7xl font-extrabold text-indigo-700 tracking-widest drop-shadow mb-2 transition-colors duration-300"
        style={{ fontFamily: "'DS-Digital', monospace" }}
      >
        {formatTime(now)}
      </div>
      <div className="text-lg md:text-xl text-indigo-700 font-semibold tracking-wide">
        {formatDate(now)}
      </div>
    </div>
  );
}
