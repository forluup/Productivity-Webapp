import React, { useEffect, useState } from "react";

export default function QuoteWidget() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  // Use environment variable for API base URL
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchQuote() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/api/quote`);
        if (!res.ok) throw new Error("Failed to fetch quote");
        const data = await res.json();
        const quote = data[0];
        setQuote({ content: quote.q, author: quote.a });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuote();
  }, [apiUrl]);

  // Trigger fade-in when quote is loaded
  useEffect(() => {
    if (quote) {
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 10);
    }
  }, [quote]);

  if (loading)
    return <div className="text-slate-400 italic">Loading quote...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!quote) return null;

  return (
    <div className="relative flex justify-center items-center min-h-[200px]">
      <div
        className={`border border-white/40 p-6 rounded-2xl text-blue-900 max-w-xl mx-auto my-4
        transition-all duration-1500 ease-out transform shadow-lg
        ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        hover:shadow-xl hover:scale-[1.02] backdrop-blur-md bg-white/40`}
        style={{ zIndex: 1 }}
      >
        <div className="italic text-lg mb-2 font-serif">"{quote.content}"</div>
        <div className="text-right text-sm font-semibold">- {quote.author}</div>
      </div>
    </div>
  );
}
