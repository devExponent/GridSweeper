import React from "react";
import type { GameStats, GameStatus } from "../types/game";
import { formatTime } from "../hooks/useTimer";

interface GameOverlayProps {
  status: GameStatus;
  stats: GameStats;
  onRestart: () => void;
  onGoToMenu: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({
  status,
  stats,
  onRestart,
  onGoToMenu,
}) => {
  if (status !== "won" && status !== "lost") return null;

  const isWin = status === "won";

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center
                 bg-black/60 backdrop-blur-sm rounded-2xl animate-fade-in"
    >
      <div
        className={`relative flex flex-col items-center gap-5 px-8 py-7 rounded-2xl
          border shadow-2xl animate-slide-up
          ${
            isWin
              ? "bg-emerald-950/95 border-emerald-600/60 shadow-emerald-900/50"
              : "bg-red-950/95 border-red-600/60 shadow-red-900/50"
          }`}
      >
        <div
          className={`absolute -inset-px rounded-2xl opacity-40 blur-sm pointer-events-none
            ${isWin ? "bg-emerald-500" : "bg-red-500"}`}
        />

        <span className="text-6xl leading-none">{isWin ? "🏆" : "💥"}</span>

        <div className="text-center">
          <h2
            className={`text-2xl font-extrabold tracking-tight ${
              isWin ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {isWin ? "Field Cleared!" : "Boom!"}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isWin
              ? "You swept every mine. Impressive."
              : "You triggered a mine. Try again."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <StatCard
            icon="⏱"
            label="Time"
            value={formatTime(stats.timeElapsed)}
          />
          <StatCard icon="👆" label="Moves" value={stats.movesCount} />
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onRestart}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm
              transition-all duration-150 active:scale-95 border
              ${
                isWin
                  ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"
                  : "bg-red-600 hover:bg-red-500 border-red-500 text-white"
              }`}
          >
            Play Again
          </button>
          <button
            onClick={onGoToMenu}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm
              bg-slate-700 hover:bg-slate-600 border border-slate-600
              text-slate-200 transition-all duration-150 active:scale-95"
          >
            Menu
          </button>
        </div>

        <p className="text-slate-600 text-xs">Press R to restart</p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-1 bg-slate-800/60 rounded-lg p-3 border border-slate-700/40">
    <span className="text-xl">{icon}</span>
    <span className="text-white font-mono font-bold text-lg leading-none">
      {value}
    </span>
    <span className="text-slate-500 text-[10px] uppercase tracking-wider">
      {label}
    </span>
  </div>
);

export default GameOverlay;
