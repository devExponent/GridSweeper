import React from "react";

interface MenuScreenProps {
  onStart: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center gap-8 py-6 animate-fade-in">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <span className="text-7xl leading-none select-none">💣</span>

          <span className="absolute inset-0 text-7xl leading-none blur-xl opacity-40 select-none">
            💣
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mt-2">
          Grid<span className="text-amber-400">Sweep</span>
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">
          10 × 10 · 10 Mines
        </p>
      </div>

      <div className="w-full max-w-xs bg-slate-800/60 rounded-xl border border-slate-700/50 p-5 space-y-2.5">
        <h2 className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-3">
          How to Play
        </h2>
        {[
          { icon: "🖱️", text: "Left-click to reveal a cell" },
          { icon: "🚩", text: "Right-click to flag a mine" },
          { icon: "⌨️", text: "Arrow keys to navigate" },
          { icon: "↵", text: "Enter or Space to reveal focused cell" },
          { icon: "F", text: "F key to flag focused cell" },
          { icon: "R", text: "R key to restart at any time" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm">
            <span className="w-7 text-center text-base shrink-0 font-mono text-amber-400 font-bold">
              {icon}
            </span>
            <span className="text-slate-300">{text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="px-10 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95
                   text-slate-900 font-extrabold text-lg rounded-xl
                   transition-all duration-150 shadow-lg shadow-amber-900/40
                   border border-amber-400/60"
      >
        Start Game
      </button>

      <p className="text-slate-600 text-xs">Clear all safe cells to win</p>
    </div>
  );
};

export default MenuScreen;
