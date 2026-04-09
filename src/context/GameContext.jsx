// ============================================================
// GameContext.jsx — Central state management for the game
// Firebase Realtime Database for real-time multiplayer sync
// ============================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { DEFAULT_PROMPTS } from "../data/prompts";
import { BOARD_TILES, TOTAL_TILES, TEAM_COLORS } from "../data/board";
import { ref, set, get, onValue, update } from "firebase/database";
import { db } from "../firebase.js";

const GameContext = createContext(null);

// ── Generate a unique 6-char session code ──────────────────
const genSessionCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// ── Initial state ───────────────────────────────────────────
const initialState = {
  sessionCode: null,
  phase: "lobby",
  hostId: null,
  teams: [],
  currentTeamIndex: 0,
  diceValue: null,
  isRolling: false,
  currentPrompt: null,
  usedPromptIds: [],
  timerActive: false,
  timerSeconds: 0,
  players: {},
  prompts: DEFAULT_PROMPTS,
};

// ── Reducer ─────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case "CREATE_SESSION": {
      const { teamNames, hostId, sessionCode } = action.payload;
      const teams = teamNames.map((name, i) => ({
        id: `team-${i}`,
        name,
        position: 0,
        color: TEAM_COLORS[i % TEAM_COLORS.length],
        players: [],
        captainId: null,
      }));
      return {
        ...initialState,
        sessionCode,
        hostId,
        teams,
        phase: "lobby",
        prompts: state.prompts,
      };
    }

    case "LOAD_SESSION": {
      // Merge carefully — don't overwrite local prompts with Firebase prompts
      // (prompts are admin-only local config, not synced to Firebase)
      const { prompts: _ignoredPrompts, ...remoteState } = action.payload;
      return { ...state, ...remoteState };
    }

    case "JOIN_GAME": {
      const { playerId, playerName, teamId } = action.payload;
      const teams = state.teams.map(t => {
        if (t.id !== teamId) return t;
        if (t.players.includes(playerId)) return t; // already joined, don't duplicate
        const isCaptain = t.players.length === 0;
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
      return { ...state, teams, players };
    }

    case "START_GAME": {
      return { ...state, phase: "playing", currentTeamIndex: 0, diceValue: null, currentPrompt: null };
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

      return { ...state, isRolling: false, teams, currentPrompt, usedPromptIds };
    }

    case "NEXT_TURN": {
      const nextIndex = (state.currentTeamIndex + 1) % state.teams.length;
      return {
        ...state,
        currentTeamIndex: nextIndex,
        diceValue: null,
        currentPrompt: null,
        timerActive: false,
        timerSeconds: 0,
      };
    }

    case "END_GAME": {
      return { ...state, phase: "ended", timerActive: false };
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
      return { ...state, prompts: action.payload };
    }

    case "RESET": {
      return { ...initialState, prompts: state.prompts };
    }

    default:
      return state;
  }
}

// ── Helper ───────────────────────────────────────────────────
const getRandomPromptFromList = (prompts, type, usedIds) => {
  const available = prompts.filter(
    p => p.type === type && p.enabled && !usedIds.includes(p.id)
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
};

// Strip prompts before saving to Firebase (they're local-only config)
const stateForFirebase = (state) => {
  const { prompts: _p, ...rest } = state;
  return rest;
};

// ── Provider ─────────────────────────────────────────────────
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Stable player ID (persisted in localStorage)
  const playerId = React.useMemo(() => {
    let id = localStorage.getItem("playerId");
    if (!id) {
      id = "player-" + Math.random().toString(36).slice(2, 9);
      localStorage.setItem("playerId", id);
    }
    return id;
  }, []);

  // Track whether this device is the host
  const isHost = state.hostId === playerId;

  // Ref to suppress re-entrancy: when we receive from Firebase and dispatch
  // LOAD_SESSION, that causes a state change which would trigger our "sync to
  // Firebase" effect — we use this flag to skip that one write.
  const receivingFromFirebase = useRef(false);

  // ── Timer tick ────────────────────────────────────────────
  useEffect(() => {
    if (!state.timerActive) return;
    const interval = setInterval(() => dispatch({ type: "TICK_TIMER" }), 1000);
    return () => clearInterval(interval);
  }, [state.timerActive]);

  // ── Firebase: listen for remote state changes ─────────────
  // Subscribes whenever sessionCode changes (e.g. after joining)
  useEffect(() => {
    if (!state.sessionCode) return;

    const sessionRef = ref(db, "sessions/" + state.sessionCode);
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      if (!snapshot.exists()) return;
      receivingFromFirebase.current = true;
      dispatch({ type: "LOAD_SESSION", payload: snapshot.val() });
      // Reset flag after dispatch has been processed
      setTimeout(() => { receivingFromFirebase.current = false; }, 0);
    });

    return () => unsubscribe();
  }, [state.sessionCode]);

  // ── Firebase: sync local state → Firebase (host only) ─────
  // Only the host writes to Firebase. Players just read via onValue.
  // We debounce by 200ms to batch rapid state changes (e.g. roll + finish).
  useEffect(() => {
    if (!state.sessionCode) return;
    if (!isHost) return;
    if (receivingFromFirebase.current) return; // don't echo back what we just received

    const timeout = setTimeout(() => {
      set(ref(db, "sessions/" + state.sessionCode), stateForFirebase(state));
    }, 200);

    return () => clearTimeout(timeout);
  }, [state, isHost]);

  // ── Actions ───────────────────────────────────────────────

  const createSession = useCallback((teamNames) => {
    const hostId = playerId;
    const sessionCode = genSessionCode();

    const action = {
      type: "CREATE_SESSION",
      payload: { teamNames, hostId, sessionCode },
    };

    // Calculate the new state directly so we can write to Firebase immediately
    const newState = gameReducer(initialState, action);

    // Write to Firebase BEFORE dispatch so the session exists when lobby loads
    set(ref(db, "sessions/" + sessionCode), stateForFirebase(newState));

    dispatch(action);
  }, [playerId]);

  const loadSession = useCallback(async (code) => {
    try {
      const snapshot = await get(ref(db, "sessions/" + code));
      if (snapshot.exists()) {
        dispatch({ type: "LOAD_SESSION", payload: snapshot.val() });
        return true;
      }
      return false;
    } catch (err) {
      console.error("loadSession error:", err);
      return false;
    }
  }, []);

  // joinGame: update state locally AND write the join to Firebase directly
  // so all devices (especially the host) see the new player immediately.
  const joinGame = useCallback(async (pId, playerName, teamId) => {
    dispatch({ type: "JOIN_GAME", payload: { playerId: pId, playerName, teamId } });

    if (!state.sessionCode) return;

    try {
      // Read fresh state from Firebase, apply the join, then write back
      const snapshot = await get(ref(db, "sessions/" + state.sessionCode));
      if (!snapshot.exists()) return;

      const remote = snapshot.val();

      // Update teams array
      const teams = (remote.teams || []).map(t => {
        if (t.id !== teamId) return t;
        const teams = state.teams.map(t => {
  if (t.id !== teamId) return t;
  if ((t.players || []).includes(playerId)) return t; // 

  const isCaptain = (t.players || []).length === 0;

  return {
    ...t,
    players: [...(t.players || []), playerId],
    captainId: isCaptain ? playerId : t.captainId,
  };
});
        const isCaptain = (t.players || []).length === 0;
        return {
          ...t,
          players: [...(t.players || []), pId],
          captainId: isCaptain ? pId : t.captainId,
        };
      });

      // Update players map
      const captainId = teams.find(t => t.id === teamId)?.captainId;
      const players = {
        ...(remote.players || {}),
        [pId]: {
          name: playerName,
          teamId,
          isCaptain: captainId === pId,
        },
      };

      await update(ref(db, "sessions/" + state.sessionCode), { teams, players });
    } catch (err) {
      console.error("joinGame Firebase write error:", err);
    }
  }, [state.sessionCode]);

  const startGame = useCallback(() => dispatch({ type: "START_GAME" }), []);
  const endGame   = useCallback(() => dispatch({ type: "END_GAME" }), []);

  const rollDice = useCallback(() => {
    dispatch({ type: "ROLL_DICE" });
    setTimeout(() => dispatch({ type: "FINISH_ROLL" }), 1200);
  }, []);

  const nextTurn = useCallback(() => dispatch({ type: "NEXT_TURN" }), []);

  const startTimer = useCallback((seconds = 60) => {
    dispatch({ type: "START_TIMER", payload: { seconds } });
  }, []);

  const stopTimer   = useCallback(() => dispatch({ type: "STOP_TIMER" }), []);
  const updatePrompts = useCallback((prompts) => dispatch({ type: "UPDATE_PROMPTS", payload: prompts }), []);
  const reset       = useCallback(() => dispatch({ type: "RESET" }), []);

  // Legacy helper kept for compatibility
  const setSessionCodeOnly = useCallback((code) => {
    dispatch({ type: "LOAD_SESSION", payload: { sessionCode: code } });
  }, []);

  // Derived
  const currentTeam = state.teams[state.currentTeamIndex] || null;
  const getTeamForPlayer = (pid) => {
    const player = state.players[pid];
    if (!player) return null;
    return state.teams.find(t => t.id === player.teamId) || null;
  };

  return (
    <GameContext.Provider value={{
      ...state,
      playerId,
      isHost,
      currentTeam,
      getTeamForPlayer,
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
      setSessionCodeOnly,
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