// FILE: frontend/src/components/ActionBar.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Action button bar for game operations: Remove, Save, Load, Reset, Rankings
//   SCOPE: Renders 5 action buttons with remove mode toggle state
//   DEPENDS: none
//   LINKS: M-COMPONENTS, V-M-COMPONENTS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   ActionBar - presentational component for game action buttons
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

interface ActionBarProps {
  removeMode: boolean
  onToggleRemove: () => void
  onSave: () => void
  onLoad: () => void
  onReset: () => void
  onLeaderboard: () => void
}

// START_METHOD_ActionBar
// START_CONTRACT: ActionBar
//   PURPOSE: Render game action buttons with remove mode toggle styling
//   INPUTS: { removeMode, onToggleRemove, onSave, onLoad, onReset, onLeaderboard }
//   OUTPUTS: JSX.Element
//   SIDE_EFFECTS: None
//   LINKS: M-COMPONENTS
// END_CONTRACT: ActionBar
export function ActionBar({
  removeMode, onToggleRemove, onSave, onLoad, onReset, onLeaderboard,
}: ActionBarProps) {
  return (
    <div className="actionbar">
      <button className={'actionbar__btn' + (removeMode ? ' actionbar__btn--active' : '')} onClick={onToggleRemove}>
        {removeMode ? 'Cancel Remove' : 'Remove'}
      </button>
      <button className="actionbar__btn" onClick={onSave}>Save</button>
      <button className="actionbar__btn" onClick={onLoad}>Load</button>
      <button className="actionbar__btn" onClick={onReset}>Reset</button>
      <button className="actionbar__btn" onClick={onLeaderboard}>Rankings</button>
    </div>
  )
}
// END_METHOD_ActionBar