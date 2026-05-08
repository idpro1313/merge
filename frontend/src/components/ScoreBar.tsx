// FILE: frontend/src/components/ScoreBar.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Displays game stats: score, max level, cell count, and save indicator
//   SCOPE: Pure presentational component for game statistics bar
//   DEPENDS: none
//   LINKS: M-COMPONENTS, V-M-COMPONENTS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ScoreBar - presentational component for score/maxLevel/cellCount/saved
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

interface ScoreBarProps {
  score: number
  maxLevel: number
  cellCount: number
  saved: boolean
}

// START_METHOD_ScoreBar
// START_CONTRACT: ScoreBar
//   PURPOSE: Render score, max level, cell count stats and optional Saved indicator
//   INPUTS: { score, maxLevel, cellCount, saved }
//   OUTPUTS: JSX.Element
//   SIDE_EFFECTS: None
//   LINKS: M-COMPONENTS
// END_CONTRACT: ScoreBar
export function ScoreBar({ score, maxLevel, cellCount, saved }: ScoreBarProps) {
  return (
    <div className="scorebar">
      <div className="scorebar__item">
        <span className="scorebar__label">Score</span>
        <span className="scorebar__value">{score}</span>
      </div>
      <div className="scorebar__item">
        <span className="scorebar__label">Max Level</span>
        <span className="scorebar__value">{maxLevel}</span>
      </div>
      <div className="scorebar__item">
        <span className="scorebar__label">Items</span>
        <span className="scorebar__value">{cellCount}/64</span>
      </div>
      {saved && <div className="scorebar__saved">Saved</div>}
    </div>
  )
}
// END_METHOD_ScoreBar