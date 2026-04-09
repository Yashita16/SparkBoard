// pages/EndedPage.jsx
// Game over screen — shows final positions and a play-again button
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const RANK_EMOJI = ["🥇", "🥈", "🥉"];

export default function EndedPage() {
  const navigate = useNavigate();
  const { teams, sessionCode, reset } = useGame();

  // If no session loaded (e.g. direct nav), go home
  useEffect(() => {
    if (!sessionCode && teams.length === 0) navigate("/");
  }, []);

  // Sort teams by position descending
  const ranked = [...teams].sort((a, b) => b.position - a.position);

  const handlePlayAgain = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Celebration header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce inline-block">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Game Over!</h1>
          <p className="text-gray-500">
            Great energy everyone. Here's how teams finished.
          </p>
        </div>

        {/* Final standings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="font-medium">Final Standings</p>
          </div>
          <div className="divide-y divide-gray-50">
            {ranked.map((team, index) => {
              const pct = Math.round((team.position / 14) * 100);
              return (
                <div key={team.id} className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <span className="text-2xl w-8 text-center">
                      {RANK_EMOJI[index] || "👏"}
                    </span>
                    {/* Team dot */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: team.color.bg }}
                    >
                      {team.name[0]}
                    </div>
                    {/* Name + bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-medium">{team.name}</span>
                        <span className="text-sm font-mono text-gray-500">
                          {team.position}/14
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: team.color.bg }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <p className="font-medium mb-3">Session</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{teams.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Teams</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold font-mono">{sessionCode}</p>
              <p className="text-xs text-gray-500 mt-0.5">Session code</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePlayAgain}
            className="w-full py-4 bg-gray-900 text-white rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Thanks for playing IceBreaker 🎲
        </p>
      </div>
    </div>
  );
}