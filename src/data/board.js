// ============================================================
// board.js — Board tile layout (15 tiles)
// Tile types: move | talk | create | wildcard | start | finish
// ============================================================

export const BOARD_TILES = [
  { id: 0,  type: "start",    label: "START",    emoji: "🚀", color: "#10b981" },
  { id: 1,  type: "move",     label: "Move",     emoji: "🏃", color: "#f59e0b" },
  { id: 2,  type: "talk",     label: "Talk",     emoji: "💬", color: "#3b82f6" },
  { id: 3,  type: "create",   label: "Create",   emoji: "🎨", color: "#8b5cf6" },
  { id: 4,  type: "move",     label: "Move",     emoji: "🏃", color: "#f59e0b" },
  { id: 5,  type: "wildcard", label: "Wild",     emoji: "🌀", color: "#ec4899" },
  { id: 6,  type: "talk",     label: "Talk",     emoji: "💬", color: "#3b82f6" },
  { id: 7,  type: "create",   label: "Create",   emoji: "🎨", color: "#8b5cf6" },
  { id: 8,  type: "move",     label: "Move",     emoji: "🏃", color: "#f59e0b" },
  { id: 9,  type: "talk",     label: "Talk",     emoji: "💬", color: "#3b82f6" },
  { id: 10, type: "wildcard", label: "Wild",     emoji: "🌀", color: "#ec4899" },
  { id: 11, type: "create",   label: "Create",   emoji: "🎨", color: "#8b5cf6" },
  { id: 12, type: "move",     label: "Move",     emoji: "🏃", color: "#f59e0b" },
  { id: 13, type: "talk",     label: "Talk",     emoji: "💬", color: "#3b82f6" },
  { id: 14, type: "finish",   label: "FINISH",   emoji: "🎉", color: "#10b981" },
];

export const TOTAL_TILES = BOARD_TILES.length - 1; // 0–14

export const TILE_COLORS = {
  start:    { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
  finish:   { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
  move:     { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  talk:     { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a8a" },
  create:   { bg: "#ede9fe", border: "#8b5cf6", text: "#4c1d95" },
  wildcard: { bg: "#fce7f3", border: "#ec4899", text: "#9d174d" },
};

// Team token colors — assigned in order
export const TEAM_COLORS = [
  { bg: "#ef4444", text: "#fff", name: "Red"    },
  { bg: "#3b82f6", text: "#fff", name: "Blue"   },
  { bg: "#10b981", text: "#fff", name: "Green"  },
  { bg: "#f59e0b", text: "#000", name: "Yellow" },
  { bg: "#8b5cf6", text: "#fff", name: "Purple" },
  { bg: "#ec4899", text: "#fff", name: "Pink"   },
];