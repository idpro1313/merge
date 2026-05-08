// FILE: frontend/src/hooks/useGame.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: React hook managing game state, merge logic, save/load, and UI interaction
//   SCOPE: Cell tap handling, remove mode, merge flow, save/load via API, reset
//   DEPENDS: M-BOARD_LOGIC, M-TYPES, M-API
//   LINKS: M-USE_GAME, V-M-USE_GAME
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   useGame - main hook returning game state and action handlers
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  type Board,
  type GameState,
  type Position,
  BOARD_SIZE,
  MERGE_REQUIRED,
} from '../game/types'
import {
  createEmptyBoard,
  spawnRandomCell,
  removeCell,
  spawnCellAt,
  findCellsByLevel,
  getMaxLevel,
  cloneBoard,
} from '../game/board'
import { api } from '../api/client'

// START_METHOD_initialState
// START_CONTRACT: initialState
//   PURPOSE: Create initial game state with empty board and 5 random cells
//   INPUTS: none
//   OUTPUTS: GameState
//   SIDE_EFFECTS: None
//   LINKS: M-USE_GAME
// END_CONTRACT: initialState
function initialState(): GameState {
  let board = createEmptyBoard()
  for (let i = 0; i < 5; i++) {
    board = spawnRandomCell(board) ?? board
  }
  return {
    board,
    score: 0,
    selectedCell: null,
    mergeTarget: null,
    mergeCount: 0,
    maxLevel: 1,
    removeMode: false,
    saved: false,
  }
}
// END_METHOD_initialState

// START_METHOD_useGame
// START_CONTRACT: useGame
//   PURPOSE: Main game state hook — manages board, score, selection, merge, save/load
//   INPUTS: none
//   OUTPUTS: GameState & { tapCell, toggleRemoveMode, saveGame, loadGame, resetGame }
//   SIDE_EFFECTS: Uses refs for merge tracking, calls API on save/load
//   LINKS: M-USE_GAME
// END_CONTRACT: useGame
export function useGame() {
  const [state, setState] = useState<GameState>(initialState)
  const mergeOriginRef = useRef<Position | null>(null)
  const mergeSecondRef = useRef<Position | null>(null)

  useEffect(() => {
    setState(prev => ({ ...prev, maxLevel: getMaxLevel(prev.board) }))
  }, [state.board])

  // START_METHOD_tapCell
  // START_CONTRACT: tapCell
  //   PURPOSE: Handle cell tap — remove mode removes cell, normal mode selects/merges
  //   INPUTS: { pos: Position }
  //   OUTPUTS: void (updates state via setState)
  //   SIDE_EFFECTS: Modifies refs (mergeOriginRef, mergeSecondRef)
  //   LINKS: M-USE_GAME, UC-002, UC-003
  // END_CONTRACT: tapCell
  const tapCell = useCallback((pos: Position) => {
    setState(prev => {
      // START_BLOCK_REMOVE_MODE
      if (prev.removeMode) {
        const cell = prev.board[pos.row][pos.col]
        if (!cell) return prev
        let board = removeCell(prev.board, pos.row, pos.col)
        board = spawnRandomCell(board) ?? board
        return {
          ...prev,
          board,
          selectedCell: null,
          mergeTarget: null,
          mergeCount: 0,
          maxLevel: getMaxLevel(board),
        }
      }
      // END_BLOCK_REMOVE_MODE

      // START_BLOCK_CLICK_EMPTY
      const clickedCell = prev.board[pos.row][pos.col]
      if (!clickedCell) return { ...prev, selectedCell: null, mergeTarget: null, mergeCount: 0 }
      // END_BLOCK_CLICK_EMPTY

      const level = clickedCell.level

      // START_BLOCK_FIRST_SELECT
      if (!prev.selectedCell) {
        return { ...prev, selectedCell: pos, mergeTarget: null, mergeCount: 0 }
      }
      // END_BLOCK_FIRST_SELECT

      // START_BLOCK_DESELECT
      if (prev.selectedCell.row === pos.row && prev.selectedCell.col === pos.col) {
        return { ...prev, selectedCell: null, mergeTarget: null, mergeCount: 0 }
      }
      // END_BLOCK_DESELECT

      // START_BLOCK_LEVEL_MISMATCH
      const selected = prev.board[prev.selectedCell.row][prev.selectedCell.col]
      if (!selected || selected.level !== level) {
        return { ...prev, selectedCell: pos, mergeTarget: null, mergeCount: 0 }
      }
      // END_BLOCK_LEVEL_MISMATCH

      // START_BLOCK_SECOND_SELECT
      if (prev.mergeCount === 0) {
        let board = cloneBoard(prev.board)
        board[prev.selectedCell.row][prev.selectedCell.col] = null
        board[pos.row][pos.col] = null
        mergeOriginRef.current = prev.selectedCell
        mergeSecondRef.current = pos
        return {
          ...prev,
          board,
          selectedCell: null,
          mergeTarget: null,
          mergeCount: 1,
        }
      }
      // END_BLOCK_SECOND_SELECT

      // START_BLOCK_MERGE_EXECUTE
      if (prev.mergeCount === 1) {
        let board = cloneBoard(prev.board)
        board[pos.row][pos.col] = null
        board = spawnCellAt(board, pos.row, pos.col, level + 1)
        board = spawnRandomCell(board) ?? board
        mergeOriginRef.current = null
        mergeSecondRef.current = null
        return {
          ...prev,
          board,
          score: prev.score + 10 * level,
          selectedCell: null,
          mergeTarget: null,
          mergeCount: 0,
          maxLevel: getMaxLevel(board),
          saved: false,
        }
      }
      // END_BLOCK_MERGE_EXECUTE

      return prev
    })
  }, [])
  // END_METHOD_tapCell

  // START_METHOD_toggleRemoveMode
  // START_CONTRACT: toggleRemoveMode
  //   PURPOSE: Toggle remove mode on/off and clear cell selection
  //   INPUTS: none
  //   OUTPUTS: void
  //   SIDE_EFFECTS: Updates state
  //   LINKS: M-USE_GAME, UC-003
  // END_CONTRACT: toggleRemoveMode
  const toggleRemoveMode = useCallback(() => {
    setState(prev => ({ ...prev, removeMode: !prev.removeMode, selectedCell: null }))
  }, [])
  // END_METHOD_toggleRemoveMode

  // START_METHOD_saveGame
  // START_CONTRACT: saveGame
  //   PURPOSE: Save current game state to backend API
  //   INPUTS: none
  //   OUTPUTS: Promise<void>
  //   SIDE_EFFECTS: Calls API, sets saved flag on success
  //   LINKS: M-USE_GAME, UC-004, DF-002
  // END_CONTRACT: saveGame
  const saveGame = useCallback(async () => {
    try {
      await api.saveGame({
        board: state.board,
        score: state.score,
        maxLevel: state.maxLevel,
      })
      setState(prev => ({ ...prev, saved: true }))
    } catch {
    }
  }, [state.board, state.score, state.maxLevel])
  // END_METHOD_saveGame

  // START_METHOD_loadGame
  // START_CONTRACT: loadGame
  //   PURPOSE: Load saved game state from backend API
  //   INPUTS: none
  //   OUTPUTS: Promise<void>
  //   SIDE_EFFECTS: Calls API, updates state on success
  //   LINKS: M-USE_GAME, UC-004, DF-002
  // END_CONTRACT: loadGame
  const loadGame = useCallback(async () => {
    try {
      const data = await api.loadGame()
      if (data) {
        setState(prev => ({
          ...prev,
          board: data.board as Board,
          score: data.score,
          maxLevel: data.maxLevel,
          saved: true,
        }))
      }
    } catch {
    }
  }, [])
  // END_METHOD_loadGame

  // START_METHOD_resetGame
  // START_CONTRACT: resetGame
  //   PURPOSE: Reset game to initial state
  //   INPUTS: none
  //   OUTPUTS: void
  //   SIDE_EFFECTS: Replaces state with fresh initialState
  //   LINKS: M-USE_GAME
  // END_CONTRACT: resetGame
  const resetGame = useCallback(() => {
    setState(initialState())
  }, [])
  // END_METHOD_resetGame

  return {
    ...state,
    tapCell,
    toggleRemoveMode,
    saveGame,
    loadGame,
    resetGame,
  }
}
// END_METHOD_useGame