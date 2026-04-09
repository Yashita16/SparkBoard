// ============================================================
// GameContext.jsx — Central state management for the game
// Uses localStorage to persist sessions across page refreshes
// ============================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { DEFAULT_PROMPTS, getRandomPrompt } from "../data/prompts";
import { BOARD_TILES, TOTAL_TILES, TEAM_COLORS } from "../data/board";

const GameContext = createContext(null);

// ── Generate a unique 6-char session code ────────────────────
const genSessionCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// ── Initial state ─────────────────────────────────────────────
const initialState = {
  // Session
  sessionCode: null,
  phase: "lobby",          // lobby | playing | ended
  hostId: null,

  // Teams
  teams: [],               // [{ id, name, position, color, players, captainId }]
  currentTeamIndex: 0,

  // Turn state
  diceValue: null,
  isRolling: false,
  currentPrompt: null,     // { id, type, text }
  usedPromptIds: [],

  // Timer
  timerActive: false,
  timerSeconds: 0,

  // Players (keyed by playerId)
  players: {},             // { [playerId]: { name, teamId, isCaptain } }

  // Prompts (for admin editing)
  prompts: DEFAULT_PROMPTS,
};

// ── Reducer ───────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case "CREATE_SESSION": {
      const { teamNames, hostId } = action.payload;
      const code = genSessionCode();
      const teams = teamNames.map((name, i) => ({
        id: `team-${i}`,
        name,
        position: 0,
        color: TEAM_COLORS[i % TEAM_COLORS.length],
        players: [],
        captainId: null,
      }));
      const newState = {
        ...initialState,
        sessionCode: code,
        hostId,
        teams,
        phase: "lobby",
        prompts: state.prompts, // preserve admin edits
      };
      saveToStorage(code, newState);
      return newState;
    }

    case "LOAD_SESSION": {
      return { ...state, ...action.payload };
    }

    case "JOIN_GAME": {
      const { playerId, playerName, teamId } = action.payload;
      const teams = state.teams.map(t => {
        if (t.id !== teamId) return t;
        const isCaptain = t.players.length === 0; // first joiner is captain
        return {
          ...t,
          players: [...t.players, playerId],
          captainId: isCaptain ? playerId : t.captainId,
        };
      });
      const players = {
        ...state.players,
        [playerId]: {
          name: playerName,
          teamId,
          isCaptain: teams.find(t => t.id === teamId)?.captainId === playerId,
        },
      };
      const newState = { ...state, teams, players };
      saveToStorage(state.sessionCode, newState);
      return newState;
    }

    case "START_GAME": {
      const newState = { ...state, phase: "playing", currentTeamIndex: 0, diceValue: null, currentPrompt: null };
      saveToStorage(state.sessionCode, newState);
      return newState;
    }

    case "ROLL_DICE": {
      const value = Math.floor(Math.random() * 6) + 1;
      return { ...state, isRolling: true, diceValue: value, currentPrompt: null };
    }

    case "FINISH_ROLL": {
      const { diceValue } = state;
      const currentTeam = state.teams[state.currentTeamIndex];
      const rawNewPos = currentTeam.position + diceValue;
      const newPosition = Math.min(rawNewPos, TOTAL_TILES);
      const landedTile = BOARD_TILES[newPosition];

      // Get prompt based on tile type
      let currentPrompt = null;
      if (landedTile.type !== "start" && landedTile.type !== "finish") {
        const promptType = landedTile.type === "wildcard" ? "wildcard" : landedTile.type;
        currentPrompt = getRandomPromptFromList(state.prompts, promptType, state.usedPromptIds);
      }

      const usedPromptIds = currentPrompt
        ? [...state.usedPromptIds, currentPrompt.id]
        : state.usedPromptIds;

      const teams = state.teams.map((t, i) =>
        i === state.currentTeamIndex ? { ...t, position: newPosition } : t
      );

      const newState = {
        ...state,
        isRolling: false,
        teams,
        currentPrompt,
        usedPromptIds,
      };
      saveToStorage(state.sessionCode, newState);
      return newState;
    }

    case "NEXT_TURN": {
      const nextIndex = (state.currentTeamIndex + 1) % state.teams.length;
      const newState = {
        ...state,
        currentTeamIndex: nextIndex,
        diceValue: null,
        currentPrompt: null,
        timerActive: false,
        timerSeconds: 0,
      };
      saveToStorage(state.sessionCode, newState);
      return newState;
    }

    case "END_GAME": {
      const newState = { ...state, phase: "ended", timerActive: false };
      saveToStorage(state.sessionCode, newState);
      return newState;
    }

    case "START_TIMER": {
      return { ...state, timerActive: true, timerSeconds: action.payload.seconds };
    }

    case "TICK_TIMER": {
      if (state.timerSeconds <= 0) return { ...state, timerActive: false };
      return { ...state, timerSeconds: state.timerSeconds - 1 };
    }

    case "STOP_TIMER": {
      return { ...state, timerActive: false, timerSeconds: 0 };
    }

    case "UPDATE_PROMPTS": {
      const newState = { ...state, prompts: action.payload };
      if (state.sessionCode) saveToStorage(state.sessionCode, newState);
      localStorage.setItem("vx_prompts", JSON.stringify(action.payload));
      return newState;
    }

    case "RESET": {
      return { ...initialState, prompts: state.prompts };
    }

    default:
      return state;
  }
}

// ── Helpers ───────────────────────────────────────────────────
const getRandomPromptFromList = (prompts, type, usedIds) => {
  const available = prompts.filter(
    p => p.type === type && p.enabled && !usedIds.includes(p.id)
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};

const STORAGE_KEY = "vx_game_";
const saveToStorage = (code, state) => {
  if (!code) return;
  try {
    localStorage.setItem(STORAGE_KEY + code, JSON.stringify(state));
  } catch (e) {}
};

const loadFromStorage = (code) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + code);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
};

// ── Provider ──────────────────────────────────────────────────
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load persisted prompts on mount
  useEffect(() => {
    const saved = localStorage.getItem("vx_prompts");
    if (saved) {
      try {
        dispatch({ type: "UPDATE_PROMPTS", payload: JSON.parse(saved) });
      } catch (e) {}
    }
  }, []);

  // Timer tick
  useEffect(() => {
    if (!state.timerActive) return;
    const interval = setInterval(() => dispatch({ type: "TICK_TIMER" }), 1000);
    return () => clearInterval(interval);
  }, [state.timerActive]);

  // ── Actions ───────────────────────────────────────────────
  const createSession = useCallback((teamNames) => {
    const hostId = `host-${Date.now()}`;
    dispatch({ type: "CREATE_SESSION", payload: { teamNames, hostId } });
    return hostId;
  }, []);

  const loadSession = useCallback((code) => {
    const saved = loadFromStorage(code.toUpperCase());
    if (saved) {
      dispatch({ type: "LOAD_SESSION", payload: saved });
      return true;
    }
    return false;
  }, []);

  const joinGame = useCallback((playerId, playerName, teamId) => {
    dispatch({ type: "JOIN_GAME", payload: { playerId, playerName, teamId } });
  }, []);

  const startGame = useCallback(() => dispatch({ type: "START_GAME" }), []);
  const endGame = useCallback(() => dispatch({ type: "END_GAME" }), []);

  const rollDice = useCallback(() => {
    dispatch({ type: "ROLL_DICE" });
    // Animate for 1.2s then apply movement
    setTimeout(() => dispatch({ type: "FINISH_ROLL" }), 1200);
  }, []);

  const nextTurn = useCallback(() => dispatch({ type: "NEXT_TURN" }), []);

  const startTimer = useCallback((seconds = 60) => {
    dispatch({ type: "START_TIMER", payload: { seconds } });
  }, []);

  const stopTimer = useCallback(() => dispatch({ type: "STOP_TIMER" }), []);

  const updatePrompts = useCallback((prompts) => {
    dispatch({ type: "UPDATE_PROMPTS", payload: prompts });
  }, []);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  // Derived helpers
  const currentTeam = state.teams[state.currentTeamIndex] || null;
  const getTeamForPlayer = (playerId) => {
    const player = state.players[playerId];
    if (!player) return null;
    return state.teams.find(t => t.id === player.teamId) || null;
  };

  return (
    <GameContext.Provider value={{
      ...state,
      currentTeam,
      getTeamForPlayer,
      // Actions
      createSession,
      loadSession,
      joinGame,
      startGame,
      endGame,
      rollDice,
      nextTurn,
      startTimer,
      stopTimer,
      updatePrompts,
      reset,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
};