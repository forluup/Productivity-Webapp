import React from "react";

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

function getGradientColors(timeOfDay) {
  switch (timeOfDay) {
    case "morning":
      return {
        start: "#ff5f6d", // vivid pink
        end: "#ffc371", // vivid orange
      };
    case "afternoon":
      return {
        start: "#2563eb", // blue-600
        end: "#06b6d4", // cyan-500
      };
    case "evening":
      return {
        start: "#7c3aed", // purple-600
        end: "#f472b6", // pink-400
      };
    case "night":
      return {
        start: "#60a5fa", //
        end: "#3c0069", //
      };
  }
}

export default function DashboardBackground() {
  const timeOfDay = getTimeOfDay();
  const { start, end } = getGradientColors(timeOfDay);

  // Sidebar width (w-64 in Tailwind = 16rem = 256px)
  const sidebarWidth = 220;

  return (
    <div
      className="fixed top-0 bottom-0 right-0 z-0 overflow-hidden"
      style={{
        left: `${sidebarWidth}px`,
        width: `calc(120vw - ${sidebarWidth}px)`,
        height: "100vh",
      }}
    >
      <svg
        className="absolute animate-spin-slow blur-2xl opacity-100 w-full h-full"
        viewBox="0 0 1200 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          left: -130,
          top: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id="dashboard-bg-gradient"
            x1="0"
            y1="0"
            x2="1200"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={start} />
            <stop offset="1" stopColor={end} />
          </linearGradient>
        </defs>
        <ellipse
          cx="600"
          cy="450"
          rx="500"
          ry="300"
          fill="url(#dashboard-bg-gradient)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 600 450"
            to="360 600 450"
            dur="40s"
            repeatCount="indefinite"
          />
        </ellipse>
      </svg>
    </div>
  );
}
