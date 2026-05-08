// FILE: backend/src/index.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Express server entry point — initializes DB, mounts routes, starts HTTP listener
//   SCOPE: Server bootstrap, route mounting, CORS/JSON middleware, health check
//   DEPENDS: M-DB, M-AUTH, M-BACKEND_ROUTES
//   LINKS: M-BACKEND_ENTRY, V-M-BACKEND_ENTRY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   main - async bootstrap: initDb, create Express app, mount routes, listen
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import express from 'express'
import cors from 'cors'
import { initDb } from './db'
import { loginHandler } from './middleware/auth'
import usersRouter from './routes/users'
import gameRouter from './routes/game'
import leaderboardRouter from './routes/leaderboard'

// START_METHOD_main
// START_CONTRACT: main
//   PURPOSE: Initialize database, configure Express app, mount all routes, start HTTP server
//   INPUTS: none (uses process.env.PORT)
//   OUTPUTS: Promise<void>
//   SIDE_EFFECTS: Creates HTTP server, initializes DB, logs to console
//   LINKS: M-BACKEND_ENTRY
// END_CONTRACT: main
async function main() {
  await initDb()

  const app = express()
  const PORT = parseInt(process.env.PORT || '3001', 10)

  app.use(cors())
  app.use(express.json())

  app.post('/api/auth/login', loginHandler)
  app.use('/api/users', usersRouter)
  app.use('/api/game', gameRouter)
  app.use('/api/leaderboard', leaderboardRouter)

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.listen(PORT, () => {
    console.log('Backend running on http://localhost:' + PORT)
  })
}
// END_METHOD_main

main().catch(console.error)