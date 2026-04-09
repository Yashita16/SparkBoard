// pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import toast from "react-hot-toast";

export default function HomePage() {
  const { loadSession } = useGame();
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleJoin = () => {
    const c = code.trim().toUpperCase();
    if (c.length < 4) { toast.error("Enter a valid session code"); return; }
    if (loadSession(c)) {
      navigate(`/join?code=${c}`);
    } else {
      toast.error("Session not found. Check the code.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎲</div>
          <h1 className="text-3xl font-semibold mb-2">IceBreaker</h1>
          <p className="text-gray-500">A workshop game for teams</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-3">
          <p className="font-medium mb-3">Host a game</p>
          <button
            onClick={() => navigate("/setup")}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Create Session
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="font-medium mb-3">Join as player</p>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 uppercase"
              placeholder="Session code (e.g. AB3X7K)"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
              maxLength={6}
            />
            <button
              onClick={handleJoin}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              Join
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/admin")}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}