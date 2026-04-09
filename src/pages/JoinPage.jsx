
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGame } from "../context/GameContext";
import toast from "react-hot-toast";

export default function JoinPage() {
  const navigate = useNavigate();
  const { code: paramCode } = useParams();        // /join/ABC123
  const [searchParams] = useSearchParams();        // /join?code=ABC123

  const { loadSession, joinGame, teams, sessionCode } = useGame();

  const [step, setStep] = useState("loading"); //    loading | form | error
  const [playerName, setPlayerName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [joining, setJoining] = useState(false);
  const [resolvedCode, setResolvedCode] = useState("");
  

 
  useEffect(() => {
    const init = async () => {
      const code = (paramCode || searchParams.get("code") || "").toUpperCase().trim();

      if (!code) {
        setStep("error");
        return;
      }

      setResolvedCode(code);

      const success = await loadSession(code);
      if (!success) {
        setStep("error");
        return;
      }

      
      setStep("form");
    };

    init();
  }, []); 
  const handleJoin = async () => {
    const name = playerName.trim();
    if (!name)          { toast.error("Enter your name");  return; }
    if (!selectedTeamId){ toast.error("Choose a team");    return; }

    setJoining(true);

    const playerId = localStorage.getItem("playerId");

    try {
      await joinGame(playerId, name, selectedTeamId);

      // Persist player identity for PlayerViewPage
      sessionStorage.setItem("ib_player_id",     playerId);
      sessionStorage.setItem("ib_player_name",   name);
      sessionStorage.setItem("ib_team_id",        selectedTeamId);
      sessionStorage.setItem("ib_session_code",   resolvedCode);

      toast.success(`Joined as ${name}!`);
      navigate("/player");
    } catch (err) {
      console.error("Join error:", err);
      toast.error("Failed to join. Please try again.");
      setJoining(false);
    }
  };

 
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Finding session...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">Session not found</h2>
          <p className="text-gray-500 text-sm mb-6">
            The session code <span className="font-mono font-bold">{resolvedCode}</span> doesn't exist or has expired.
            Ask your facilitator for the correct code.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Join Form ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎲</div>
          <h1 className="text-2xl font-semibold">Join the game</h1>
          <p className="text-gray-500 text-sm mt-1">
            Session <span className="font-mono font-semibold text-gray-700">{resolvedCode}</span>
            {" · "}{teams.length} team{teams.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">

          {/* Name input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your name</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none
                         focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
              placeholder="Enter your name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
              maxLength={30}
              autoFocus
              disabled={joining}
            />
          </div>

          {/* Team selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose your team</label>

            {teams.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Loading teams...</p>
            ) : (
              <div className="space-y-2">
                {teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    disabled={joining}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left
                      ${selectedTeamId === team.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: team.color?.bg || "#888" }}
                    >
                      {team.name[0]}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium block">{team.name}</span>
                      <span className="text-xs text-gray-400">
                        {(team.players || []).length === 0
                          ? "No players yet — you'll be captain!"
                          : `${team.players.length} player${team.players.length !== 1 ? "s" : ""} joined`}
                      </span>
                    </div>
                    {selectedTeamId === team.id && (
                      <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Join button */}
          <button
            onClick={handleJoin}
            disabled={joining || !playerName.trim() || !selectedTeamId}
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-base
                       hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {joining ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Joining...
              </>
            ) : (
              "Join Game →"
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          No account needed · Your name is only visible during this session
        </p>
      </div>
    </div>
  );
}