// FILE: backend/src/routes/leaderboard.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Leaderboard API route — top 20 players by score
//   SCOPE: GET / — query top 20 scores from stats JOIN users
//   DEPENDS: M-DB
//   LINKS: M-BACKEND_ROUTES, V-M-BACKEND_ROUTES, DF-003
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   GET / - returns top 20 players with rank
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation; fixed unquoted SQL query string
// END_CHANGE_SUMMARY

import { Router, Request, Response } from 'express'
import { getDb } from '../db'

const router = Router()

// START_METHOD_leaderboardHandler
// START_CONTRACT: leaderboardHandler
//   PURPOSE: Return top 20 players ordered by top_score descending
//   INPUTS: { _req: Request, res: Response }
//   OUTPUTS: void (sends array of { telegram_id, username, score, rank })
//   SIDE_EFFECTS: None
//   LINKS: M-BACKEND_ROUTES, DF-003
// END_CONTRACT: leaderboardHandler
router.get('/', (_req: Request, res: Response) => {
  const db = getDb()

  // START_BLOCK_QUERY_LEADERBOARD
  const results = db.exec(
    "SELECT u.telegram_id, u.username, s.top_score as score " +
    "FROM stats s " +
    "JOIN users u ON u.id = s.user_id " +
    "WHERE s.top_score > 0 " +
    "ORDER BY s.top_score DESC " +
    "LIMIT 20"
  )
  // END_BLOCK_QUERY_LEADERBOARD

  // START_BLOCK_CHECK_EMPTY
  if (results.length === 0 || results[0].values.length === 0) {
    res.json([])
    return
  }
  // END_BLOCK_CHECK_EMPTY

  // START_BLOCK_MAP_RESULTS
  const entries = results[0].values.map((row: any[], i: number) => ({
    telegram_id: row[0],
    username: row[1],
    score: row[2],
    rank: i + 1,
  }))
  // END_BLOCK_MAP_RESULTS

  res.json(entries)
})
// END_METHOD_leaderboardHandler

export default router