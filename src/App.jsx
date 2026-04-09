// App.jsx — Main router for IceBreaker game
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GameProvider } from "./context/GameContext";

// Pages
import HomePage from "./pages/HomePage";
import SetupPage from "./pages/SetupPage";
import LobbyPage from "./pages/LobbyPage";
import JoinPage from "./pages/JoinPage";
import GameBoardPage from "./pages/GameBoardPage";
import PlayerViewPage from "./pages/PlayerViewPage";
import EndedPage from "./pages/EndedPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "inherit",
              fontSize: "14px",
              borderRadius: "10px",
            },
          }}
        />
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/setup"     element={<SetupPage />} />
          <Route path="/lobby"     element={<LobbyPage />} />
          <Route path="/join"      element={<JoinPage />} />
          <Route path="/join/:code" element={<JoinPage />} />
          <Route path="/game"      element={<GameBoardPage />} />
          <Route path="/player"    element={<PlayerViewPage />} />
          <Route path="/ended"     element={<EndedPage />} />
          <Route path="/admin"     element={<AdminPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}