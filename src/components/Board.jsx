// components/Board.jsx
// Renders the game board with tiles and team tokens
import React from "react";
import { BOARD_TILES, TILE_COLORS } from "../data/board";

// Dice faces as unicode
const DICE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const TILE_CLASS = {
  start:    "bg-green-50 border-green-400",
  finish:   "bg-green-50 border-green-400",
  move:     "bg-amber-50 border-amber-400",
  talk:     "bg-blue-50 border-blue-400",
  create:   "bg-violet-50 border-violet-400",
  wildcard: "bg-pink-50 border-pink-400",
};

export default function Board({ teams, currentTeamIndex, diceValue }) {
  const currentTeam = teams[currentTeamIndex];

  // Split tiles: top row (0-7) and bottom row (8-14, reversed)
  const topRow = BOARD_TILES.slice(0, 8);
  const bottomRow = [...BOARD_TILES.slice(8)].reverse();

  const renderTile = (tile) => {
    const teamsHere = teams.filter(t => t.position === tile.id);
    const isCurrent = currentTeam?.position === tile.id;

    return (
      <div
        key={tile.id}
        className={`
          rounded-xl border-2 p-2 flex flex-col items-center justify-center min-h-[72px] relative
          transition-all duration-300 text-center
          ${TILE_CLASS[tile.type] || "bg-gray-50 border-gray-200"}
          ${isCurrent && diceValue ? "ring-2 ring-gray-900 ring-offset-2 scale-105 z-10" : ""}
        `}
      >
        <span className="text-lg mb-0.5">{tile.emoji}</span>
        <span className="text-[10px] font-semibold leading-tight">{tile.label}</span>
        {/* Team tokens */}
        {teamsHere.length > 0 && (
          <div className="flex flex-wrap gap-0.5 justify-center mt-1">
            {teamsHere.map(t => (
              <div
                key={t.id}
                className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background: t.color.bg }}
                title={t.name}
              >
                <span className="text-white text-[7px] font-bold">{t.name[0]}</span>
              </div>
            ))}
          </div>
        )}
        {/* Tile number */}
        <span className="absolute top-1 left-1.5 text-[9px] text-gray-400 font-mono">{tile.id}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3">
      {/* Top row: 0-7 */}
      <div className="grid grid-cols-8 gap-1.5 mb-1.5">
        {topRow.map(renderTile)}
      </div>
      {/* Bottom row: 14-8 (reversed) */}
      <div className="grid grid-cols-8 gap-1.5">
        {/* Filler to align bottom row to right side */}
        <div />
        {bottomRow.map(renderTile)}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100 justify-center">
        {[
          { type: "move", label: "Move", color: "bg-amber-100 text-amber-800" },
          { type: "talk", label: "Talk", color: "bg-blue-100 text-blue-800" },
          { type: "create", label: "Create", color: "bg-violet-100 text-violet-800" },
          { type: "wildcard", label: "Wild", color: "bg-pink-100 text-pink-800" },
        ].map(({ type, label, color }) => (
          <span key={type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}