import React, { useEffect, useState } from "react";

// Helper to get greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Greeting({ name }) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const timeout = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Animated gradient keyframes */}
      <style>
        {`
          @keyframes gradient-move {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
          .animated-gradient-text {
            background-size: 200% 100%;
            animation: gradient-move 20s linear infinite;
          }
        `}
      </style>
      <h1
        className={`
          mt-12
          text-4xl
          md:text-7xl
          font-extrabold
          mb-2
          bg-gradient-to-r
          from-indigo-500
          via-indigo-400
          to-pink-500
          bg-clip-text
          text-transparent
          drop-shadow
          text-center
          tracking-tight
          transition-all
          duration-300
          pb-2
          transition-opacity
          duration-2000
          animated-gradient-text
          ${fadeIn ? "opacity-100" : "opacity-0"}
        `}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #4338ca, #818cf8, #f472b6, #4338ca, #818cf8, #f472b6, #4338ca)",
        }}
      >
        {getGreeting()}, {name}.
      </h1>
    </>
  );
}
