// ============================================================
// components/GameBoard.tsx — Renders the 10×10 mine grid
// ============================================================

import React from "react";
import type { Board, Position } from "../types/game";
import Cell from "./Cell";

interface GameBoardProps {
  board: Board;
  focusedCell: Position;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  focusedCell,
  onReveal,
  onFlag,
}) => {
  return (
    <div
      className="inline-block p-3 rounded-xl bg-slate-900/80 backdrop-blur-sm
                 border border-slate-700/50 shadow-2xl shadow-black/60"
      role="grid"
      aria-label="GridSweep game board"
    >
      {board.map((row, rIdx) => (
        <div
          key={rIdx}
          role="row"
          className="flex gap-[2px] mb-[2px] last:mb-0"
        >
          {row.map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              isFocused={
                focusedCell.row === cell.row && focusedCell.col === cell.col
              }
              onReveal={onReveal}
              onFlag={onFlag}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default React.memo(GameBoard);
