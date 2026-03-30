// ============================================================
// utils/boardUtils.ts — Pure functions for board logic
// ============================================================

import type { Board, Cell, GameConfig, Position } from "../types/game";

/** Create an empty board with all cells hidden and no mines */
export function createEmptyBoard(config: GameConfig): Board {
  return Array.from({ length: config.rows }, (_, row) =>
    Array.from({ length: config.cols }, (_, col): Cell => ({
      row,
      col,
      isMine: false,
      state: "hidden",
      adjacentMines: 0,
      revealIndex: 0,
    }))
  );
}

/** Place mines randomly, avoiding the first-click cell and its neighbours */
export function placeMines(
  board: Board,
  config: GameConfig,
  safeCell: Position
): Board {
  const newBoard = deepCloneBoard(board);
  const safeCells = new Set<string>();

  // Protect first-click area (3×3 around the clicked cell)
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeCell.row + dr;
      const c = safeCell.col + dc;
      if (r >= 0 && r < config.rows && c >= 0 && c < config.cols) {
        safeCells.add(`${r},${c}`);
      }
    }
  }

  let minesPlaced = 0;
  while (minesPlaced < config.mines) {
    const row = Math.floor(Math.random() * config.rows);
    const col = Math.floor(Math.random() * config.cols);
    const key = `${row},${col}`;
    if (!newBoard[row][col].isMine && !safeCells.has(key)) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Compute adjacent mine counts for every cell
  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].adjacentMines = countAdjacentMines(newBoard, r, c, config);
      }
    }
  }

  return newBoard;
}

/** Count mines in the 8 cells surrounding (row, col) */
export function countAdjacentMines(
  board: Board,
  row: number,
  col: number,
  config: GameConfig
): number {
  return getNeighbours({ row, col }, config).filter(
    ({ row: r, col: c }) => board[r][c].isMine
  ).length;
}

/** Return valid neighbour positions for a cell */
export function getNeighbours(pos: Position, config: GameConfig): Position[] {
  const neighbours: Position[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = pos.row + dr;
      const c = pos.col + dc;
      if (r >= 0 && r < config.rows && c >= 0 && c < config.cols) {
        neighbours.push({ row: r, col: c });
      }
    }
  }
  return neighbours;
}

/**
 * Flood-fill reveal: reveal (row,col) and recursively reveal all connected
 * empty (0 adjacent mines) cells. Returns the updated board and the count
 * of newly revealed cells (for animation staggering).
 */
export function revealCells(
  board: Board,
  row: number,
  col: number,
  config: GameConfig
): { board: Board; revealCount: number } {
  const newBoard = deepCloneBoard(board);
  let revealCount = 0;

  const queue: Position[] = [{ row, col }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { row: r, col: c } = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = newBoard[r][c];
    if (cell.state !== "hidden") continue;

    cell.state = "revealed";
    cell.revealIndex = revealCount++;

    // Only propagate if cell has no adjacent mines
    if (cell.adjacentMines === 0 && !cell.isMine) {
      getNeighbours({ row: r, col: c }, config).forEach((nb) => {
        if (newBoard[nb.row][nb.col].state === "hidden") {
          queue.push(nb);
        }
      });
    }
  }

  return { board: newBoard, revealCount };
}

/** Reveal ALL mine cells (used on game over) */
export function revealAllMines(board: Board, triggeredPos: Position): Board {
  const newBoard = deepCloneBoard(board);
  for (const row of newBoard) {
    for (const cell of row) {
      if (cell.isMine) {
        if (cell.row === triggeredPos.row && cell.col === triggeredPos.col) {
          cell.state = "exploded";
        } else if (cell.state !== "flagged") {
          cell.state = "revealed";
        }
      }
    }
  }
  return newBoard;
}

/** Check win: all non-mine cells are revealed */
export function checkWin(board: Board, config: GameConfig): boolean {
  const totalSafe = config.rows * config.cols - config.mines;
  let revealedSafe = 0;
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && cell.state === "revealed") revealedSafe++;
    }
  }
  return revealedSafe === totalSafe;
}

/** Deep clone a board (avoids mutation bugs across state updates) */
export function deepCloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

/** Count flags currently placed on the board */
export function countFlags(board: Board): number {
  return board.flat().filter((c) => c.state === "flagged").length;
}
