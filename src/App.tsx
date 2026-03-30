// ============================================================
// App.tsx — Root component: wires all hooks and screens
// ============================================================

import React from "react";
import { DEFAULT_CONFIG } from "./types/game";
import { useGameState } from "./hooks/useGameState";
import { useKeyboard } from "./hooks/useKeyboard";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import GameOverlay from "./components/GameOverlay";
import MenuScreen from "./components/MenuScreen";
import KeyboardLegend from "./components/KeyboardLegend";

const App: React.FC = () => {
  const {
    board,
    status,
    stats,
    config,
    minesLeft,
    isSoundOn,
    revealCell,
    toggleFlag,
    startNewGame,
    toggleSound,
    goToMenu,
  } = useGameState(DEFAULT_CONFIG);

  // Keyboard support
  const { focusedCell } = useKeyboard({
    status,
    config,
    onRestart: startNewGame,
    onReveal: revealCell,
    onFlag: toggleFlag,
  });

  return (
    // Full-page gradient background
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center
                 bg-slate-950 relative overflow-hidden px-4 py-8"
    >
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full
                        bg-amber-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full
                        bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] rounded-full bg-slate-800/20 blur-3xl" />
      </div>

      {/* ── Main card ────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[480px]">
        {/* Brand title (always visible above card) */}
        {status !== "menu" && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl leading-none">💣</span>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              Grid<span className="text-amber-400">Sweep</span>
            </h1>
          </div>
        )}

        {/* ── Menu screen ─────────────────────────────────── */}
        {status === "menu" ? (
          <div className="w-full bg-slate-900/70 backdrop-blur-md rounded-2xl
                          border border-slate-700/50 shadow-2xl shadow-black/60 px-6 py-8">
            <MenuScreen onStart={startNewGame} />
          </div>
        ) : (
          // ── Game screen ────────────────────────────────── 
          <div className="w-full flex flex-col items-center">
            <Header
              status={status}
              stats={stats}
              minesLeft={minesLeft}
              isSoundOn={isSoundOn}
              onRestart={startNewGame}
              onToggleSound={toggleSound}
              onGoToMenu={goToMenu}
            />

            {/* Board wrapper — relative so overlay can cover it */}
            <div className="relative">
              <GameBoard
                board={board}
                focusedCell={focusedCell}
                onReveal={revealCell}
                onFlag={toggleFlag}
              />

              {/* Win / Lose overlay */}
              <GameOverlay
                status={status}
                stats={stats}
                onRestart={startNewGame}
                onGoToMenu={goToMenu}
              />
            </div>

            {/* Status message */}
            <div className="mt-3 h-6 flex items-center justify-center">
              {status === "playing" && (
                <p className="text-slate-500 text-xs">
                  Right-click or F to flag · First click is always safe
                </p>
              )}
            </div>

            {/* Keyboard legend */}
            <KeyboardLegend />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
