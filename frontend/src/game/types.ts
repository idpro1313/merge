// FILE: frontend/src/game/types.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Core type definitions for the merge game (board, cell, state, position)
//   SCOPE: Defines Cell, Board, GameState, Position interfaces/types and game constants
//   DEPENDS: none
//   LINKS: M-TYPES, V-M-TYPES
//   ROLE: TYPES
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   Cell - A single cell on the board with level and id
//   Board - 2D grid of Cell or null
//   GameState - Complete game state including board, score, selection, mode flags
//   Position - Row/col coordinates
//   BOARD_SIZE - Board dimension constant (8)
//   MERGE_REQUIRED - Cells needed for merge (3)
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

export interface Cell {
  level: number
  id: string
}

export type Board = (Cell | null)[][]

export interface GameState {
  board: Board
  score: number
  selectedCell: Position | null
  mergeTarget: Position | null
  mergeCount: number
  maxLevel: number
  removeMode: boolean
  saved: boolean
}

export interface Position {
  row: number
  col: number
}

export const BOARD_SIZE = 8
export const MERGE_REQUIRED = 3