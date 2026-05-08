// FILE: frontend/src/components/Cell.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Individual game cell component with level display, selection, and remove states
//   SCOPE: Renders filled/empty cell with level number, color, selection/merge/remove indicators
//   DEPENDS: M-LEVELS, M-TYPES
//   LINKS: M-COMPONENTS, V-M-COMPONENTS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   Cell - memoized cell button with dynamic styling
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import React from 'react'
import { getLevelColor, getLevelTextColor } from '../game/levels'
import type { Cell as CellType, Position } from '../game/types'

interface CellProps {
  cell: CellType | null
  row: number
  col: number
  isSelected: boolean
  isMergeProgress: boolean
  removeMode: boolean
  onClick: (pos: Position) => void
}

// START_METHOD_CellInner
// START_CONTRACT: CellInner
//   PURPOSE: Render a single cell button with level number, HSL background, and state CSS classes
//   INPUTS: { cell, row, col, isSelected, isMergeProgress, removeMode, onClick }
//   OUTPUTS: JSX.Element
//   SIDE_EFFECTS: None
//   LINKS: M-COMPONENTS
// END_CONTRACT: CellInner
function CellInner({ cell, isSelected, isMergeProgress, removeMode, onClick, row, col }: CellProps) {
  const handleClick = () => onClick({ row, col })

  let style: React.CSSProperties = {}
  let className = 'cell'

  if (cell) {
    const bg = getLevelColor(cell.level)
    const textColor = getLevelTextColor(cell.level)
    style = { background: bg, color: textColor }
    className += ' cell--filled'
  } else {
    className += ' cell--empty'
  }

  if (isSelected) className += ' cell--selected'
  if (isMergeProgress) className += ' cell--merge-progress'
  if (removeMode) className += ' cell--remove-mode'

  return (
    <button className={className} style={style} onClick={handleClick}>
      {cell ? cell.level : ''}
      {removeMode && cell ? '\u2715' : ''}
      {isMergeProgress ? '?' : ''}
    </button>
  )
}
// END_METHOD_CellInner

export const Cell = React.memo(CellInner)