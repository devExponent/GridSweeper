import React from "react";
import type { GameStats, GameStatus } from "../types/game";
import { formatTime } from "../hooks/useTimer";

interface HeaderProps {
  status: GameStatus;
  stats: GameStats;
  minesLeft: number;
  isSoundOn: boolean;
  onRestart: () => void;
  onToggleSound: () => void;
  onGoToMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  status,
  stats,
  minesLeft,
  isSoundOn,
  onRestart,
  onToggleSound,
  onGoToMenu,
}) => {
  const statusEmoji = status === "won" ? "🏆" : status === "lost" ? "💀" : "😤";

  return (
    <div
      className="w-full flex items-center justify-between px-4 py-2
                 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50
                 rounded-xl shadow-lg mb-3"
    >
      <StatBadge icon="💣" value={Math.max(0, minesLeft)} label="mines" />

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onRestart}
          title="New game (R)"
          aria-label="Restart game"
          className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600
                     active:scale-90 border border-slate-600 text-xl
                     transition-all duration-150 flex items-center justify-center
                     shadow-inner shadow-black/40"
        >
          {statusEmoji}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <StatBadge
          icon="⏱"
          value={formatTime(stats.timeElapsed)}
          label="time"
        />
        <button
          onClick={onToggleSound}
          title={isSoundOn ? "Mute sound" : "Enable sound"}
          aria-label={isSoundOn ? "Mute sound" : "Enable sound"}
          className="w-8 h-8 rounded-full bg-slate-700/80 hover:bg-slate-600
                     border border-slate-600/60 text-sm flex items-center
                     justify-center transition-all duration-150 active:scale-90"
        >
          {isSoundOn ? "🔊" : "🔇"}
        </button>
        <button
          onClick={onGoToMenu}
          title="Back to menu"
          aria-label="Back to menu"
          className="w-8 h-8 rounded-full bg-slate-700/80 hover:bg-slate-600
                     border border-slate-600/60 text-sm flex items-center
                     justify-center transition-all duration-150 active:scale-90"
        >
          ☰
        </button>
      </div>
    </div>
  );
};

interface StatBadgeProps {
  icon: string;
  value: string | number;
  label: string;
}

const StatBadge: React.FC<StatBadgeProps> = ({ icon, value, label }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-base leading-none">{icon}</span>
    <div className="flex flex-col">
      <span className="text-white font-mono font-bold text-sm leading-none">
        {value}
      </span>
      <span className="text-slate-500 text-[10px] leading-none uppercase tracking-wider">
        {label}
      </span>
    </div>
  </div>
);

export default Header;
