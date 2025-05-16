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
      return { start: "#ff5f6d", end: "#ffc371" };
    case "afternoon":
      return { start: "#2563eb", end: "#06b6d4" };
    case "evening":
      return { start: "#7c3aed", end: "#f472b6" };
    case "night":
      return { start: "#60a5fa", end: "#3c0069" };
  }
}

export default function DashboardBackground() {
  const timeOfDay = getTimeOfDay();
  const { start, end } = getGradientColors(timeOfDay);
  const sidebarWidth = 220;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        height: "100vh",
      }}
    >
      <svg
        className="absolute animate-spin-slow blur-[40px] opacity-100 mix-blend-lighten transition-opacity duration-1000 ease-in-out w-full h-full"
        viewBox="0 0 1200 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: "translateX(200px)", // NEW: shift gradient toward center
        }}
      >
        <defs>
          {/* Gradient */}
          <linearGradient
            id="dashboard-bg-gradient"
            x1="0"
            y1="0"
            x2="1200"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={start} stopOpacity="0.9" />
            <stop offset="60%" stopColor={end} stopOpacity="0.5" />
            <stop offset="100%" stopColor={end} stopOpacity="0" />
          </linearGradient>

          {/* Radial mask */}
          <mask id="fade-mask">
            <radialGradient id="fade-gradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
            <rect width="1200" height="900" fill="url(#fade-gradient)" />
          </mask>
        </defs>

        {/* Layer 1 - Main Ellipse */}
        <ellipse
          cx="600"
          cy="450"
          rx="500"
          ry="300"
          fill="url(#dashboard-bg-gradient)"
          mask="url(#fade-mask)"
          opacity="1"
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

        {/* Layer 2 - Soft Depth Ellipse */}
        <ellipse
          cx="400"
          cy="300"
          rx="400"
          ry="200"
          fill="url(#dashboard-bg-gradient)"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 400 300"
            to="0 400 300"
            dur="60s"
            repeatCount="indefinite"
          />
        </ellipse>
      </svg>
    </div>
  );
}
