// FILE: frontend/src/game/board.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Board manipulation utilities for the merge game
//   SCOPE: Creating, cloning, reading, and modifying the game board (cells, spawning, removal, queries)
//   DEPENDS: M-TYPES (BOARD_SIZE, Board, Cell)
//   LINKS: M-BOARD_LOGIC, V-M-BOARD_LOGIC
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   createId - Generates unique cell ID string
//   createCell - Creates a Cell object with given level
//   createEmptyBoard - Creates an 8x8 board filled with nulls
//   getEmptyCells - Returns positions of all null cells on the board
//   spawnRandomCell - Places a level-1 cell on a random empty cell, returns new board or null
//   spawnCellAt - Places a cell at specific coordinates with given level
//   removeCell - Sets a board cell to null at given coordinates
//   findCellsByLevel - Finds all cell positions matching a level
//   countCells - Counts non-null cells on the board
//   getMaxLevel - Returns the highest cell level on the board
//   cloneBoard - Deep-clones the board (cells are shallow-cloned)
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import { BOARD_SIZE, type Board, type Cell } from './types'

let idCounter = 0

// START_METHOD_createId
// START_CONTRACT: createId
//   PURPOSE: Generate unique cell ID using incrementing counter
//   INPUTS: none
//   OUTPUTS: string - unique ID like "cell-1", "cell-2", etc.
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: createId
export function createId(): string {
  return 'cell-' + (++idCounter)
}
// END_METHOD_createId

// START_METHOD_createCell
// START_CONTRACT: createCell
//   PURPOSE: Create a Cell object with given level and unique ID
//   INPUTS: { level: number }
//   OUTPUTS: Cell
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: createCell
export function createCell(level: number): Cell {
  return { level, id: createId() }
}
// END_METHOD_createCell

// START_METHOD_createEmptyBoard
// START_CONTRACT: createEmptyBoard
//   PURPOSE: Create an empty BOARD_SIZE x BOARD_SIZE grid filled with null
//   INPUTS: none
//   OUTPUTS: Board
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: createEmptyBoard
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  )
}
// END_METHOD_createEmptyBoard

// START_METHOD_getEmptyCells
// START_CONTRACT: getEmptyCells
//   PURPOSE: Find all empty (null) cell positions on the board
//   INPUTS: { board: Board }
//   OUTPUTS: { row: number; col: number }[]
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: getEmptyCells
export function getEmptyCells(board: Board): { row: number; col: number }[] {
  const empty: { row: number; col: number }[] = []
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!board[r][c]) empty.push({ row: r, col: c })
    }
  }
  return empty
}
// END_METHOD_getEmptyCells

// START_METHOD_spawnRandomCell
// START_CONTRACT: spawnRandomCell
//   PURPOSE: Place a level-1 cell on a random empty cell
//   INPUTS: { board: Board }
//   OUTPUTS: Board | null - null if board is full
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: spawnRandomCell
export function spawnRandomCell(board: Board): Board | null {
  const empty = getEmptyCells(board)
  if (empty.length === 0) return null
  const pos = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map(row => [...row])
  next[pos.row][pos.col] = createCell(1)
  return next
}
// END_METHOD_spawnRandomCell

// START_METHOD_spawnCellAt
// START_CONTRACT: spawnCellAt
//   PURPOSE: Place a cell at specific coordinates with given level
//   INPUTS: { board: Board, row: number, col: number, level: number }
//   OUTPUTS: Board
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: spawnCellAt
export function spawnCellAt(board: Board, row: number, col: number, level: number): Board {
  const next = board.map(r => [...r])
  next[row][col] = createCell(level)
  return next
}
// END_METHOD_spawnCellAt

// START_METHOD_removeCell
// START_CONTRACT: removeCell
//   PURPOSE: Remove a cell at given coordinates by setting it to null
//   INPUTS: { board: Board, row: number, col: number }
//   OUTPUTS: Board
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: removeCell
export function removeCell(board: Board, row: number, col: number): Board {
  const next = board.map(r => [...r])
  next[row][col] = null
  return next
}
// END_METHOD_removeCell

// START_METHOD_findCellsByLevel
// START_CONTRACT: findCellsByLevel
//   PURPOSE: Find all cell positions that match a given level
//   INPUTS: { board: Board, level: number }
//   OUTPUTS: { row: number; col: number }[]
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: findCellsByLevel
export function findCellsByLevel(board: Board, level: number): { row: number; col: number }[] {
  const found: { row: number; col: number }[] = []
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]?.level === level) found.push({ row: r, col: c })
    }
  }
  return found
}
// END_METHOD_findCellsByLevel

// START_METHOD_countCells
// START_CONTRACT: countCells
//   PURPOSE: Count number of non-null cells on the board
//   INPUTS: { board: Board }
//   OUTPUTS: number
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: countCells
export function countCells(board: Board): number {
  let count = 0
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]) count++
    }
  }
  return count
}
// END_METHOD_countCells

// START_METHOD_getMaxLevel
// START_CONTRACT: getMaxLevel
//   PURPOSE: Determine the highest cell level on the board
//   INPUTS: { board: Board }
//   OUTPUTS: number - 0 if board is empty
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: getMaxLevel
export function getMaxLevel(board: Board): number {
  let max = 0
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] && board[r][c]!.level > max) max = board[r][c]!.level
    }
  }
  return max
}
// END_METHOD_getMaxLevel

// START_METHOD_cloneBoard
// START_CONTRACT: cloneBoard
//   PURPOSE: Deep-clone the board (cells are shallow-cloned)
//   INPUTS: { board: Board }
//   OUTPUTS: Board
//   SIDE_EFFECTES: None
//   LINKS: M-BOARD_LOGIC
// END_CONTRACT: cloneBoard
export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)))
}
// END_METHOD_cloneBoard