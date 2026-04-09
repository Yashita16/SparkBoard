// components/TeamList.jsx
import React from "react";

export default function TeamList({ teams, currentTeamIndex }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium mb-3 tracking-wide">ALL TEAMS</p>
      <div className="flex flex-col gap-2">
        {teams.map((t, i) => {
          const isActive = i === currentTeamIndex;
          return (
            <div
              key={t.id}
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                ${isActive
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-100 bg-white"
                }
              `}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{
                  background: t.color.bg,
                  boxShadow: isActive ? `0 0 0 3px ${t.color.bg}44` : "none",
                }}
              >
                {t.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.name}</p>
                <p className="text-xs text-gray-400">Tile {t.position} / 14</p>
              </div>
              {isActive && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  active
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}