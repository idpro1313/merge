// FILE: frontend/src/components/Board.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Renders the game board grid as a 2D layout of Cell components
//   SCOPE: Maps board array to Cell components with selection/merge/remove state
//   DEPENDS: M-TYPES, M-COMPONENTS (Cell)
//   LINKS: M-COMPONENTS, V-M-COMPONENTS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   Board - grid component rendering BOARD_SIZE x BOARD_SIZE cells
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import type { Board as BoardType, Position } from '../game/types'
import { BOARD_SIZE } from '../game/types'
import { Cell } from './Cell'

interface BoardProps {
  board: BoardType
  selectedCell: Position | null
  mergeCount: number
  removeMode: boolean
  onCellClick: (pos: Position) => void
}

// START_METHOD_Board
// START_CONTRACT: Board
//   PURPOSE: Render BOARD_SIZE x BOARD_SIZE grid of Cell components
//   INPUTS: { board, selectedCell, mergeCount, removeMode, onCellClick }
//   OUTPUTS: JSX.Element
//   SIDE_EFFECTS: None
//   LINKS: M-COMPONENTS
// END_CONTRACT: Board
export function Board({ board, selectedCell, mergeCount, removeMode, onCellClick }: BoardProps) {
  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={r + '-' + c}
            cell={cell}
            row={r}
            col={c}
            isSelected={selectedCell?.row === r && selectedCell?.col === c}
            isMergeProgress={false}
            removeMode={removeMode}
            onClick={onCellClick}
          />
        ))
      )}
    </div>
  )
}
// END_METHOD_Board