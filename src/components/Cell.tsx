import React, { useCallback } from "react";
import type { Cell as CellType } from "../types/game";
import { getNumberColor } from "../utils/cellColors";

interface CellProps {
  cell: CellType;
  isFocused: boolean;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, isFocused, onReveal, onFlag }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onReveal(cell.row, cell.col);
    },
    [cell.row, cell.col, onReveal],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onFlag(cell.row, cell.col);
    },
    [cell.row, cell.col, onFlag],
  );

  // ── Derive appearance ───────────────────────────────────
  const isRevealed = cell.state === "revealed";
  const isFlagged = cell.state === "flagged";
  const isExploded = cell.state === "exploded";
  const isHidden = cell.state === "hidden";

  const revealDelay = `${Math.min(cell.revealIndex * 18, 600)}ms`;

  // ── Base classes ─────────────────────────────────────────
  let containerCls =
    "relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 select-none cursor-pointer " +
    "border border-slate-700/60 flex items-center justify-center " +
    "text-xs sm:text-sm font-bold transition-all duration-150 overflow-hidden " +
    "rounded-[3px] ";

  if (isFocused) {
    containerCls +=
      "ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 z-10 ";
  }

  if (isRevealed || isExploded) {
    containerCls += isExploded
      ? "bg-red-600 border-red-500 animate-explode "
      : "bg-slate-800/80 border-slate-700/40 cursor-default ";
  } else if (isFlagged) {
    containerCls +=
      "bg-slate-700/80 hover:bg-slate-600/80 border-slate-600/60 ";
  } else {
    containerCls +=
      "bg-slate-700/70 hover:bg-slate-600/70 active:bg-slate-500/70 " +
      "border-t-slate-600/80 border-l-slate-600/80 border-b-slate-800/80 border-r-slate-800/80 ";
  }

  let content: React.ReactNode = null;

  if (isExploded) {
    content = <span className="text-lg leading-none drop-shadow-glow">💥</span>;
  } else if (isRevealed && cell.isMine) {
    content = <span className="text-base leading-none">💣</span>;
  } else if (isRevealed && cell.adjacentMines > 0) {
    content = (
      <span
        className={`${getNumberColor(cell.adjacentMines)} font-extrabold tracking-tight`}
      >
        {cell.adjacentMines}
      </span>
    );
  } else if (isFlagged) {
    content = (
      <span
        className="text-base leading-none"
        style={{ filter: "drop-shadow(0 0 4px rgba(239,68,68,0.8))" }}
      >
        🚩
      </span>
    );
  }

  const shimmer =
    isRevealed && !cell.isMine && !isExploded ? (
      <span
        className="absolute inset-0 bg-white/10 rounded-[3px] animate-cell-reveal"
        style={{ animationDelay: revealDelay }}
      />
    ) : null;

  return (
    <div
      role="button"
      aria-label={getCellAriaLabel(cell)}
      aria-pressed={isRevealed}
      tabIndex={isFocused ? 0 : -1}
      className={containerCls}
      style={
        isRevealed && !isExploded ? { animationDelay: revealDelay } : undefined
      }
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {shimmer}

      {isHidden && (
        <span className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[3px] pointer-events-none" />
      )}
      {content}
    </div>
  );
};

function getCellAriaLabel(cell: CellType): string {
  if (cell.state === "flagged")
    return `Row ${cell.row + 1}, Col ${cell.col + 1}: Flagged`;
  if (cell.state === "hidden")
    return `Row ${cell.row + 1}, Col ${cell.col + 1}: Hidden`;
  if (cell.state === "exploded")
    return `Row ${cell.row + 1}, Col ${cell.col + 1}: Mine exploded`;
  if (cell.isMine) return `Row ${cell.row + 1}, Col ${cell.col + 1}: Mine`;
  if (cell.adjacentMines > 0)
    return `Row ${cell.row + 1}, Col ${cell.col + 1}: ${cell.adjacentMines} adjacent mines`;
  return `Row ${cell.row + 1}, Col ${cell.col + 1}: Empty`;
}

export default React.memo(Cell);
