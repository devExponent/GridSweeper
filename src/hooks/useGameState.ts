// ============================================================
// hooks/useGameState.ts — Central game state & logic hook
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import type { Board, GameConfig, GameStatus, GameStats } from "../types/game";
import {
  createEmptyBoard,
  placeMines,
  revealCells,
  revealAllMines,
  checkWin,
  countFlags,
  deepCloneBoard,
} from "../utils/boardUtils";
import {
  playReveal,
  playFloodReveal,
  playFlag,
  playUnflag,
  playExplosion,
  playWin,
  playRestart,
} from "../audio/soundEngine";

interface UseGameStateReturn {
  board: Board;
  status: GameStatus;
  stats: GameStats;
  config: GameConfig;
  minesLeft: number;
  isSoundOn: boolean;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  startNewGame: () => void;
  toggleSound: () => void;
  goToMenu: () => void;
}

export function useGameState(config: GameConfig): UseGameStateReturn {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard(config));
  const [status, setStatus] = useState<GameStatus>("menu");
  const [isMinesPlaced, setIsMinesPlaced] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [stats, setStats] = useState<GameStats>({
    timeElapsed: 0,
    movesCount: 0,
    flagsPlaced: 0,
  });

  // Timer ref so we can clear it
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef(isSoundOn);
  soundRef.current = isSoundOn;

  const sound = useCallback(
    <T extends unknown[]>(fn: (...args: T) => void, ...args: T) => {
      if (soundRef.current) fn(...args);
    },
    []
  );

  // ── Timer ────────────────────────────────────────────────
  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setStats((s) => ({ ...s, timeElapsed: s.timeElapsed + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // ── Reveal ────────────────────────────────────────────────
  const revealCell = useCallback(
    (row: number, col: number) => {
      if (status !== "playing" && status !== "menu") return;

      setBoard((prev) => {
        const cell = prev[row][col];
        if (cell.state === "flagged" || cell.state === "revealed") return prev;

        let workingBoard = deepCloneBoard(prev);

        // First click: place mines around safe zone
        if (!isMinesPlaced) {
          workingBoard = placeMines(workingBoard, config, { row, col });
          setIsMinesPlaced(true);
          setStatus("playing");
        }

        if (workingBoard[row][col].isMine) {
          // Hit a mine — game over
          const explodedBoard = revealAllMines(workingBoard, { row, col });
          sound(playExplosion);
          setStatus("lost");
          return explodedBoard;
        }

        const { board: revealed, revealCount } = revealCells(
          workingBoard,
          row,
          col,
          config
        );

        if (revealCount > 1) {
          sound(playFloodReveal);
        } else {
          sound(playReveal);
        }

        setStats((s) => ({ ...s, movesCount: s.movesCount + 1 }));

        if (checkWin(revealed, config)) {
          setStatus("won");
          sound(playWin);
        }

        return revealed;
      });
    },
    [status, isMinesPlaced, config, sound]
  );

  // ── Flag toggle ───────────────────────────────────────────
  const toggleFlag = useCallback(
    (row: number, col: number) => {
      if (status !== "playing") return;

      setBoard((prev) => {
        const cell = prev[row][col];
        if (cell.state === "revealed") return prev;

        const newBoard = deepCloneBoard(prev);
        if (cell.state === "hidden") {
          newBoard[row][col].state = "flagged";
          sound(playFlag);
          setStats((s) => ({ ...s, flagsPlaced: s.flagsPlaced + 1 }));
        } else {
          newBoard[row][col].state = "hidden";
          sound(playUnflag);
          setStats((s) => ({
            ...s,
            flagsPlaced: Math.max(0, s.flagsPlaced - 1),
          }));
        }
        return newBoard;
      });
    },
    [status, sound]
  );

  // ── New game ──────────────────────────────────────────────
  const startNewGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBoard(createEmptyBoard(config));
    setStatus("playing");
    setIsMinesPlaced(false);
    setStats({ timeElapsed: 0, movesCount: 0, flagsPlaced: 0 });
    sound(playRestart);
  }, [config, sound]);

  const goToMenu = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBoard(createEmptyBoard(config));
    setStatus("menu");
    setIsMinesPlaced(false);
    setStats({ timeElapsed: 0, movesCount: 0, flagsPlaced: 0 });
  }, [config]);

  const toggleSound = useCallback(() => {
    setIsSoundOn((prev) => !prev);
  }, []);

  const minesLeft = config.mines - countFlags(board);

  return {
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
  };
}
