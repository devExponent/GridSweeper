

import { useEffect, useState } from "react";
import type { GameStatus, Position } from "../types/game";
import type { GameConfig } from "../types/game";

interface UseKeyboardProps {
  status: GameStatus;
  config: GameConfig;
  onRestart: () => void;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

export function useKeyboard({
  status,
  config,
  onRestart,
  onReveal,
  onFlag,
}: UseKeyboardProps) {
  const [focusedCell, setFocusedCell] = useState<Position>({ row: 0, col: 0 });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key.toLowerCase()) {
        case "r":
          e.preventDefault();
          onRestart();
          break;

        case "arrowup":
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            row: Math.max(0, prev.row - 1),
          }));
          break;

        case "arrowdown":
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            row: Math.min(config.rows - 1, prev.row + 1),
          }));
          break;

        case "arrowleft":
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            col: Math.max(0, prev.col - 1),
          }));
          break;

        case "arrowright":
          e.preventDefault();
          setFocusedCell((prev) => ({
            ...prev,
            col: Math.min(config.cols - 1, prev.col + 1),
          }));
          break;

        case "enter":
        case " ":
          
          if (status === "playing" || status === "menu") {
            e.preventDefault();
            onReveal(focusedCell.row, focusedCell.col);
          }
          break;

        case "f":
          if (status === "playing") {
            e.preventDefault();
            onFlag(focusedCell.row, focusedCell.col);
          }
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, config, focusedCell, onRestart, onReveal, onFlag]);

  return { focusedCell };
}
