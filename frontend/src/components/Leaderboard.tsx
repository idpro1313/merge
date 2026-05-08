// FILE: frontend/src/components/Leaderboard.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Modal leaderboard showing top 20 players with ranks and scores
//   SCOPE: Fetches and displays leaderboard data inside a click-outside-to-close modal
//   DEPENDS: M-API (LeaderboardEntry)
//   LINKS: M-COMPONENTS, V-M-COMPONENTS, UC-005, DF-003
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   Leaderboard - modal component with leaderboard table
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import { useEffect, useState } from 'react'
import { api, type LeaderboardEntry } from '../api/client'

interface LeaderboardProps {
  onClose: () => void
}

// START_METHOD_Leaderboard
// START_CONTRACT: Leaderboard
//   PURPOSE: Render modal with leaderboard data fetched from API
//   INPUTS: { onClose: () => void }
//   OUTPUTS: JSX.Element
//   SIDE_EFFECTS: Fetches leaderboard on mount via api.getLeaderboard
//   LINKS: M-COMPONENTS, DF-003
// END_CONTRACT: Leaderboard
export function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getLeaderboard()
      .then(data => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Leaderboard</h2>
          <button className="modal__close" onClick={onClose}>\u2715</button>
        </div>
        {loading ? (
          <p className="modal__loading">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="modal__empty">No entries yet</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Score</th></tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.telegram_id}>
                  <td>{e.rank}</td>
                  <td>{e.username || 'User ' + e.telegram_id}</td>
                  <td>{e.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
// END_METHOD_Leaderboard