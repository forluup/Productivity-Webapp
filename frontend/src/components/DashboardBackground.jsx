import React from "react";

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

function getGradientColors(timeOfDay, darkMode) {
  if (darkMode) {
    // Dark mode gradients
    switch (timeOfDay) {
      case "morning":
        return { start: "#232526", end: "#414345" };
      case "afternoon":
        return { start: "#141E30", end: "#243B55" };
      case "evening":
        return { start: "#373B44", end: "#4286f4" };
      case "night":
        return { start: "#0f2027", end: "#2c5364" };
      default:
        return { start: "#232526", end: "#414345" };
    }
  } else {
    // Light mode gradients
    switch (timeOfDay) {
      case "morning":
        return { start: "#ff5f6d", end: "#ffc371" };
      case "afternoon":
        return { start: "#2563eb", end: "#06b6d4" };
      case "evening":
        return { start: "#7c3aed", end: "#f472b6" };
      case "night":
        return { start: "#60a5fa", end: "#3c0069" };
      default:
        return { start: "#ff5f6d", end: "#ffc371" };
    }
  }
}

// Updated helper for background color behind gradients
function getBackgroundColor(timeOfDay, darkMode) {
  if (darkMode) {
    // Use rich dark blue shades for dark mode
    switch (timeOfDay) {
      case "morning":
        return "#1e293b"; // slate-800
      case "afternoon":
        return "#1e40af"; // blue-900
      case "evening":
        return "#312e81"; // indigo-900
      case "night":
        return "#0f172a"; // slate-900
      default:
        return "#1e293b";
    }
  } else {
    switch (timeOfDay) {
      case "morning":
        return "#fff7ed";
      case "afternoon":
        return "#f0f4fa";
      case "evening":
        return "#f3e8ff";
      case "night":
        return "#e0e7ff";
      default:
        return "#f0f4fa";
    }
  }
}

export default function DashboardBackground({ darkMode }) {
  const timeOfDay = getTimeOfDay();
  const { start, end } = getGradientColors(timeOfDay, darkMode);
  const backgroundColor = getBackgroundColor(timeOfDay, darkMode);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        height: "100vh",
        backgroundColor, // Dynamic background color behind gradients
        transition: "background-color 0.7s",
      }}
    >
      <svg
        className="absolute animate-spin-slow blur-[40px] opacity-100 mix-blend-multiply transition-opacity duration-1000 ease-in-out w-full h-full"
        viewBox="0 0 1200 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: "translateX(200px)",
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
          opacity="0.7"
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
