// pages/PlayerViewPage.jsx
// Mobile-optimised view for players.
// Real-time via Firebase onValue listener in GameContext.
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { BOARD_TILES } from "../data/board";
import toast from "react-hot-toast";

const PROMPT_STYLES = {
  move:     { bg: "#fef3c7", border: "#f59e0b", label: "Move Challenge",     icon: "🏃" },
  talk:     { bg: "#dbeafe", border: "#3b82f6", label: "Discussion Time",    icon: "💬" },
  create:   { bg: "#ede9fe", border: "#8b5cf6", label: "Creative Challenge", icon: "🎨" },
  wildcard: { bg: "#fce7f3", border: "#ec4899", label: "Wildcard!",          icon: "🌀" },
};

const DICE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function PlayerViewPage() {
  const navigate = useNavigate();
  const {
    loadSession, rollDice, nextTurn,
    teams, currentTeamIndex, diceValue,
    currentPrompt, phase, players,
  } = useGame();

  const [myPlayerId] = useState(() => sessionStorage.getItem("ib_player_id") || "");
  const [myTeamId]   = useState(() => sessionStorage.getItem("ib_team_id")   || "");
  const [myName]     = useState(() => sessionStorage.getItem("ib_player_name") || "Player");
  const [myCode]     = useState(() => sessionStorage.getItem("ib_session_code") || "");

  const [rolling,     setRolling]     = useState(false);
  const [diceDisplay, setDiceDisplay] = useState("🎲");

  // On refresh: re-subscribe to Firebase session
  useEffect(() => {
    if (!myCode) return;
    loadSession(myCode).then(found => {
      if (!found) {
        toast.error("Session not found. Please re-join.");
        navigate("/");
      }
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!myPlayerId || !myTeamId) {
      toast.error("Session expired. Please re-join.");
      navigate("/");
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (phase === "ended") navigate("/ended");
  }, [phase, navigate]);

  const myTeam      = teams.find(t => t.id === myTeamId);
  const currentTeam = teams[currentTeamIndex];
  const isMyTurn    = currentTeam?.id === myTeamId;
  const myPlayer    = players[myPlayerId];
  const isCaptain   = myPlayer?.isCaptain || myTeam?.captainId === myPlayerId;
  const canRoll     = isMyTurn && isCaptain && !diceValue && !rolling;
  const currentTile = myTeam ? BOARD_TILES[myTeam.position] : null;


  const handleRoll = useCallback(() => {
    if (!canRoll) return;
    setRolling(true);
    const anim = setInterval(() => {
      setDiceDisplay(DICE_FACES[Math.floor(Math.random() * 6) + 1]);
    }, 100);
    rollDice();
    setTimeout(() => { clearInterval(anim); setRolling(false); }, 1300);
  }, [canRoll, rollDice]);

  useEffect(() => {
    if (diceValue && !rolling) setDiceDisplay(DICE_FACES[diceValue]);
    if (!diceValue)            setDiceDisplay("🎲");
  }, [diceValue, rolling]);

  if (!myTeam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading game...</p>
        </div>
      </div>
    );
  }


  const promptStyle = currentPrompt ? PROMPT_STYLES[currentPrompt.type] : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎲</span>
          <span className="font-semibold">IceBreaker</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg">{myCode}</span>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 pt-4 space-y-3">
        {/* My team card */}
        <div
          className="rounded-2xl border-2 p-4"
          style={{ borderColor: (myTeam.color?.bg||"#888")+"60", background: (myTeam.color?.bg||"#888")+"0D" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ background: myTeam.color?.bg||"#888" }}>
              {myTeam.name[0]}
            </div>
            <div>
              <p className="font-semibold text-lg">{myTeam.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{myName}</span>
                {isCaptain && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">👑 Captain</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Position</span>
              <span className="font-mono font-medium">Tile {myTeam.position} / 14</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width:`${(myTeam.position/14)*100}%`, background: myTeam.color?.bg||"#888" }} />
            </div>
          </div>
        </div>

        {/* Current turn */}
        <div className={`bg-white rounded-2xl border-2 p-4 transition-all duration-300 ${isMyTurn?"border-green-300":"border-gray-100"}`}>
          <p className="text-xs text-gray-400 font-medium mb-2 tracking-wide">CURRENT TURN</p>
          <div className="flex items-center gap-3">
            {currentTeam && <>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: currentTeam.color?.bg||"#888" }}>{currentTeam.name[0]}</div>
              <span className="font-medium">{currentTeam.name}</span>
              {isMyTurn && <span className="ml-auto text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Your turn!</span>}
            </>}
          </div>
        </div>

        {/* Dice - captain only */}
        {isMyTurn && isCaptain && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
            <p className="text-sm font-medium text-gray-700 mb-4">
              {diceValue ? `You rolled a ${diceValue}!` : "You're up — roll the dice!"}
            </p>
            <button onClick={handleRoll} disabled={!canRoll}
              className={`w-24 h-24 mx-auto rounded-2xl bg-gray-900 text-5xl flex items-center justify-center
                transition-all duration-150 select-none
                ${canRoll?"cursor-pointer hover:-translate-y-1 active:scale-95 shadow-lg":"opacity-50 cursor-not-allowed"}
                ${rolling?"animate-bounce":""}`}>
              {diceDisplay}
            </button>
            {diceValue && !rolling && (
              <button onClick={nextTurn}
                className="mt-4 w-full py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                End Turn →
              </button>
            )}
          </div>
        )}

        {isMyTurn && !isCaptain && !diceValue && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-amber-700 font-medium">Your team is up!</p>
            <p className="text-amber-600 text-sm mt-1">Waiting for your captain to roll...</p>
          </div>
        )}

        {!isMyTurn && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
            <p className="text-gray-500 text-sm">
              Waiting for <span className="font-medium text-gray-700">{currentTeam?.name}</span> to take their turn...
            </p>
          </div>
        )}

        {/* Prompt */}
        {currentPrompt && promptStyle && (
          <div className="rounded-2xl p-5" style={{ background: promptStyle.bg, borderLeft:`4px solid ${promptStyle.border}` }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{promptStyle.icon}</span>
              <span className="font-semibold" style={{ color: promptStyle.border }}>{promptStyle.label}</span>
            </div>
            <p className="text-base leading-relaxed">{currentPrompt.text}</p>
          </div>
        )}

        {/* All teams */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 font-medium mb-3 tracking-wide">ALL TEAMS</p>
          <div className="space-y-2">
            {[...teams].sort((a,b)=>b.position-a.position).map((t,rank)=>(
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-300 w-4">{rank+1}</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: t.color?.bg||"#888" }}>{t.name[0]}</div>
                <span className={`flex-1 text-sm ${t.id===myTeamId?"font-semibold":"text-gray-600"}`}>
                  {t.name} {t.id===myTeamId&&"(you)"}
                </span>
                <span className="text-xs font-mono text-gray-400">{t.position}/14</span>
              </div>
            ))}
          </div>
        </div>

        {currentTile && currentTile.type !== "start" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">Your team is on</p>
            <span className="text-2xl">{currentTile.emoji}</span>
            <p className="font-medium mt-1">{currentTile.label} tile</p>
          </div>
        )}
      </div>
    </div>
  );
}