

export type CellState = "hidden" | "revealed" | "flagged" | "exploded";

export type GameStatus = "menu" | "playing" | "won" | "lost";

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
  
  revealIndex: number;
}

export type Board = Cell[][];

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface GameStats {
  timeElapsed: number;
  movesCount: number;
  flagsPlaced: number;
}

export interface Position {
  row: number;
  col: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  rows: 10,
  cols: 10,
  mines: 10,
};
