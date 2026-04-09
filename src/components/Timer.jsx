// components/Timer.jsx
import React from "react";

export default function Timer({ active, seconds, onStart, onStop }) {
  const max = 120; // max we'll show on ring
  const pct = Math.min(seconds / max, 1);
  const circ = 150.8;
  const offset = circ * (1 - pct);
  const isLow = seconds <= 10 && active;

  const display = seconds >= 60
    ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
    : String(seconds);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
      <p className="text-xs text-gray-500 font-medium mb-3 tracking-wide">TIMER</p>

      {/* Ring */}
      <div className="relative w-14 h-14 mx-auto mb-3">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle
            cx="28" cy="28" r="24"
            fill="none"
            stroke={isLow ? "#dc2626" : "#111827"}
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={active ? offset : 0}
            strokeLinecap="round"
            transform="rotate(-90 28 28)"
            style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-semibold ${isLow ? "text-red-600" : "text-gray-900"}`}>
            {active ? display : "—"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onStart(60)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50"
        >
          60s
        </button>
        <button
          onClick={() => onStart(120)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50"
        >
          2m
        </button>
        {active && (
          <button
            onClick={onStop}
            className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}