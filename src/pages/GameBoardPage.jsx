// pages/GameBoardPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import Board from "../components/Board";
import DiceRoller from "../components/DiceRoller";
import PromptCard from "../components/PromptCard";
import TeamList from "../components/TeamList";
import Timer from "../components/Timer";

export default function GameBoardPage() {
  const navigate = useNavigate();
  const {
    sessionCode, teams, currentTeam, currentTeamIndex,
    diceValue, currentPrompt, phase,
    rollDice, nextTurn, endGame,
    timerActive, timerSeconds, startTimer, stopTimer,
  } = useGame();

  useEffect(() => {
    if (!sessionCode) navigate("/");
  }, [sessionCode]);

  useEffect(() => {
    if (phase === "ended") navigate("/ended");
  }, [phase]);

  const handleEnd = () => {
    if (window.confirm("End the game session?")) {
      endGame();
      navigate("/ended");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎲</span>
          <span className="font-semibold text-lg">IceBreaker</span>
          <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm">{sessionCode}</span>
        </div>
        <button onClick={handleEnd}
          className="px-4 py-2 text-red-600 border border-red-200 rounded-xl text-sm hover:bg-red-50 transition-colors">
          End Game
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div>
          <Board teams={teams} currentTeamIndex={currentTeamIndex} diceValue={diceValue} />
          {currentPrompt && (
            <div className="mt-4">
              <PromptCard prompt={currentPrompt} teamName={currentTeam?.name} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium mb-2 tracking-wide">CURRENT TURN</p>
            {currentTeam && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: currentTeam.color?.bg || "#888" }}>
                  {currentTeam.name[0]}
                </div>
                <span className="font-medium">{currentTeam.name}</span>
              </div>
            )}
          </div>

          <DiceRoller onRoll={rollDice} onNext={nextTurn} diceValue={diceValue} disabled={!!diceValue} />
          <Timer active={timerActive} seconds={timerSeconds} onStart={startTimer} onStop={stopTimer} />
          <TeamList teams={teams} currentTeamIndex={currentTeamIndex} />
        </div>
      </div>
    </div>
  );
}