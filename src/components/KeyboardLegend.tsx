import React from "react";

const shortcuts = [
  { key: "R", desc: "Restart" },
  { key: "↑↓←→", desc: "Navigate" },
  { key: "Enter", desc: "Reveal" },
  { key: "F", desc: "Flag" },
];

const KeyboardLegend: React.FC = () => (
  <div className="flex flex-wrap justify-center gap-2 mt-3">
    {shortcuts.map(({ key, desc }) => (
      <div key={key} className="flex items-center gap-1.5 text-xs">
        <kbd
          className="px-1.5 py-0.5 rounded bg-slate-700 border border-slate-600
                     text-slate-300 font-mono text-[11px] leading-none"
        >
          {key}
        </kbd>
        <span className="text-slate-500">{desc}</span>
      </div>
    ))}
  </div>
);

export default KeyboardLegend;
