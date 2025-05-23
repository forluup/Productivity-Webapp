import React, { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable for API base URL
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/api/weather?city=Coquitlam`);
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [apiUrl]);

  if (loading)
    return (
      <div className="absolute top-4 right-8 z-40">
        <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-lg border border-white/30 px-4 py-2 flex items-center w-64">
          <span className="text-slate-500">Loading weather...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="absolute top-4 right-8 z-40">
        <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-lg border border-white/30 px-4 py-2 flex items-center w-64">
          <span className="text-red-500">Error: {error}</span>
        </div>
      </div>
    );
  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="absolute top-0 right-0 p-4">
      <div className="backdrop-blur-md bg-white/30 rounded-2xl shadow-lg border border-white/30 px-4 py-2 flex items-center hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 max-w-xs">
        <img
          src={iconUrl}
          alt={weather.weather[0].description}
          className="w-10 h-10"
        />
        <div className="ml-2 min-w-0">
          <div className="text-xl font-bold text-blue-700">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="text-xs text-blue-500 capitalize">
            {weather.weather[0].description}
          </div>
          <div className="text-xs text-blue-400">{weather.name}</div>
        </div>
      </div>
    </div>
  );
}
