// FILE: backend/src/routes/game.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Game save/load API routes with auth middleware
//   SCOPE: POST /save (upsert board state), GET /load (retrieve saved game)
//   DEPENDS: M-AUTH, M-DB
//   LINKS: M-BACKEND_ROUTES, V-M-BACKEND_ROUTES, DF-002
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   POST /save - upsert game state, update top_score, persist DB to disk
//   GET /load - return saved board+score+maxLevel or null
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'
import { getDb, saveDb } from '../db'

const router = Router()

// START_METHOD_saveHandler
// START_CONTRACT: saveHandler
//   PURPOSE: Upsert game save — insert or update board, score, maxLevel; update top_score
//   INPUTS: { req: Request (body: { board, score, maxLevel }), res: Response }
//   OUTPUTS: void (sends { ok: true } or 400)
//   SIDE_EFFECTS: Writes to saves and stats tables, persists DB to disk
//   LINKS: M-BACKEND_ROUTES, DF-002
// END_CONTRACT: saveHandler
router.post('/save', authMiddleware, (req: Request, res: Response) => {
  // START_BLOCK_VALIDATE_INPUT
  const { board, score, maxLevel } = req.body
  if (!board) {
    res.status(400).json({ message: 'board required' })
    return
  }
  // END_BLOCK_VALIDATE_INPUT

  const db = getDb()
  const userId = req.user!.id

  // START_BLOCK_CHECK_EXISTING_SAVE
  const stmt = db.prepare('SELECT id FROM saves WHERE user_id = ?')
  stmt.bind([userId])
  const exists = stmt.step()
  stmt.free()
  // END_BLOCK_CHECK_EXISTING_SAVE

  // START_BLOCK_UPSERT_SAVE
  if (exists) {
    db.run('UPDATE saves SET board = ?, score = ?, max_level = ?, updated_at = datetime("now") WHERE user_id = ?', [
      JSON.stringify(board), score || 0, maxLevel || 1, userId,
    ])
  } else {
    db.run('INSERT INTO saves (user_id, board, score, max_level) VALUES (?, ?, ?, ?)', [
      userId, JSON.stringify(board), score || 0, maxLevel || 1,
    ])
  }
  // END_BLOCK_UPSERT_SAVE

  // START_BLOCK_UPDATE_TOP_SCORE
  const stmt2 = db.prepare('SELECT top_score FROM stats WHERE user_id = ?')
  stmt2.bind([userId])
  let topScore = 0
  if (stmt2.step()) {
    const row = stmt2.getAsObject() as any
    topScore = row.top_score || 0
  }
  stmt2.free()

  if ((score || 0) > topScore) {
    db.run('UPDATE stats SET top_score = ? WHERE user_id = ?', [score || 0, userId])
  }
  // END_BLOCK_UPDATE_TOP_SCORE

  // START_BLOCK_PERSIST_AND_RESPOND
  saveDb()
  res.json({ ok: true })
  // END_BLOCK_PERSIST_AND_RESPOND
})
// END_METHOD_saveHandler

// START_METHOD_loadHandler
// START_CONTRACT: loadHandler
//   PURPOSE: Load saved game state for authenticated user
//   INPUTS: { req: Request, res: Response }
//   OUTPUTS: void (sends { board, score, maxLevel } or null)
//   SIDE_EFFECTS: None
//   LINKS: M-BACKEND_ROUTES, DF-002
// END_CONTRACT: loadHandler
router.get('/load', authMiddleware, (req: Request, res: Response) => {
  const db = getDb()

  // START_BLOCK_QUERY_SAVE
  const stmt = db.prepare('SELECT board, score, max_level FROM saves WHERE user_id = ?')
  stmt.bind([req.user!.id])
  if (!stmt.step()) {
    stmt.free()
    res.json(null)
    return
  }
  const row = stmt.getAsObject() as any
  stmt.free()
  // END_BLOCK_QUERY_SAVE

  res.json({
    board: JSON.parse(row.board),
    score: row.score,
    maxLevel: row.max_level,
  })
})
// END_METHOD_loadHandler

export default router