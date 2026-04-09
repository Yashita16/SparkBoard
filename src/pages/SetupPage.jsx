// pages/SetupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

export default function SetupPage() {
  const { createSession } = useGame();
  const navigate = useNavigate();
  const [teamCount, setTeamCount] = useState(3);
  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2", "Team 3"]);

  const handleCountChange = (n) => {
    setTeamCount(n);
    setTeamNames(Array.from({ length: n }, (_, i) => teamNames[i] || `Team ${i + 1}`));
  };

  const handleCreate = () => {
    const names = teamNames.slice(0, teamCount).map((n, i) => n.trim() || `Team ${i + 1}`);
    createSession(names);
    navigate("/lobby");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
          ← Back
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h1 className="text-xl font-semibold mb-5">Set up your game</h1>
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">Number of teams</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => handleCountChange(n)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors
                    ${teamCount === n ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 hover:bg-gray-50"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2 mb-6">
            {Array.from({ length: teamCount }, (_, i) => (
              <div key={i}>
                <label className="block text-xs text-gray-500 mb-1">Team {i + 1}</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400"
                  value={teamNames[i] || ""}
                  onChange={e => {
                    const n = [...teamNames];
                    n[i] = e.target.value;
                    setTeamNames(n);
                  }}
                  placeholder={`Team ${i + 1}`}
                />
              </div>
            ))}
          </div>
          <button onClick={handleCreate} className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Create Session & Get QR Code →
          </button>
        </div>
      </div>
    </div>
  );
}