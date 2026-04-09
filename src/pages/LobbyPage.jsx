// pages/LobbyPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useGame } from "../context/GameContext";

export default function LobbyPage() {
  const { sessionCode, teams, startGame } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionCode) navigate("/");
  }, [sessionCode]);

  // ✅ window.location.origin — works on any device on same network
  const joinUrl = `${window.location.origin}/join?code=${sessionCode}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4 text-center">
          <p className="text-xs text-gray-400 font-medium tracking-widest mb-1">SESSION CODE</p>
          <p className="text-4xl font-bold tracking-widest font-mono mb-1">{sessionCode}</p>
          <p className="text-xs text-gray-400 mb-6">Players scan QR code or enter this code</p>

          <div className="inline-block p-4 bg-white border border-gray-100 rounded-2xl shadow-sm mb-4">
            <QRCodeSVG value={joinUrl} size={200} level="M" />
          </div>

          <p className="text-xs text-gray-400 mb-1">Or share this link:</p>
          <p className="text-xs text-blue-600 break-all mb-6 select-all">{joinUrl}</p>

          <button
            onClick={() => { startGame(); navigate("/game"); }}
            className="w-full py-4 bg-gray-900 text-white rounded-xl text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Game →
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-medium mb-3">Teams
            <span className="ml-2 text-xs text-gray-400 font-normal">
              ({teams.reduce((sum, t) => sum + (t.players?.length || 0), 0)} players joined)
            </span>
          </p>
          <div className="space-y-2">
            {teams.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: t.color?.bg || "#888" }}>
                  {t.name[0]}
                </div>
                <span className="font-medium flex-1">{t.name}</span>
                <span className="text-xs text-gray-400">
                  {(t.players?.length || 0)} player{(t.players?.length || 0) !== 1 ? "s" : ""} joined
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}