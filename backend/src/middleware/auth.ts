// FILE: backend/src/middleware/auth.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: JWT authentication middleware and Telegram initData verification
//   SCOPE: Telegram initData HMAC-SHA256 verification, JWT sign/verify, user lookup/creation
//   DEPENDS: M-DB, jsonwebtoken, crypto
//   LINKS: M-AUTH, V-M-AUTH
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AuthUser - interface for authenticated user payload
//   verifyTelegramInitData - validates Telegram WebApp initData signature
//   authMiddleware - Express middleware: validates Bearer JWT token
//   loginHandler - Express handler: verifies initData, creates user, returns JWT
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation; fixed stats.user_id FK to use internal users.id
// END_CHANGE_SUMMARY

import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { getDb } from '../db'

const JWT_SECRET = process.env.JWT_SECRET || 'merge-tap-dev-secret'
const BOT_TOKEN = process.env.BOT_TOKEN || ''

export interface AuthUser {
  id: number
  telegram_id: number
  username: string | null
  first_name: string | null
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

// START_METHOD_verifyTelegramInitData
// START_CONTRACT: verifyTelegramInitData
//   PURPOSE: Verify Telegram WebApp initData HMAC-SHA256 signature and parse user
//   INPUTS: { initData: string - raw query string from Telegram.WebApp.initData }
//   OUTPUTS: { id: number; username?: string; first_name?: string } | null
//   SIDE_EFFECTS: None
//   LINKS: M-AUTH
// END_CONTRACT: verifyTelegramInitData
function verifyTelegramInitData(initData: string): { id: number; username?: string; first_name?: string } | null {
  // START_BLOCK_PARSE_PARAMS
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null
  // END_BLOCK_PARSE_PARAMS

  // START_BLOCK_BUILD_CHECK_STRING
  const dataCheckString = Array.from(params.entries())
    .filter(([k]) => k !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => k + '=' + v)
    .join('\n')
  // END_BLOCK_BUILD_CHECK_STRING

  // START_BLOCK_COMPUTE_HMAC
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
  // END_BLOCK_COMPUTE_HMAC

  // START_BLOCK_VERIFY_HASH
  if (computedHash !== hash) return null
  // END_BLOCK_VERIFY_HASH

  // START_BLOCK_PARSE_USER
  const userStr = params.get('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
  // END_BLOCK_PARSE_USER
}
// END_METHOD_verifyTelegramInitData

// START_METHOD_authMiddleware
// START_CONTRACT: authMiddleware
//   PURPOSE: Express middleware — validate Bearer JWT token and attach user to request
//   INPUTS: { req: Request, res: Response, next: () => void }
//   OUTPUTS: void (calls next() on success, sends 401 on failure)
//   SIDE_EFFECTS: Sets req.user on success
//   LINKS: M-AUTH
// END_CONTRACT: authMiddleware
export function authMiddleware(req: Request, res: Response, next: () => void) {
  // START_BLOCK_CHECK_AUTH_HEADER
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' })
    return
  }
  // END_BLOCK_CHECK_AUTH_HEADER

  // START_BLOCK_VERIFY_JWT
  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
  // END_BLOCK_VERIFY_JWT
}
// END_METHOD_authMiddleware

// START_METHOD_loginHandler
// START_CONTRACT: loginHandler
//   PURPOSE: Handle POST /api/auth/login — verify initData, find/create user, return JWT
//   INPUTS: { req: Request (body: { initData: string }), res: Response }
//   OUTPUTS: void (sends JSON with token or error)
//   SIDE_EFFECTS: Creates user and stats row on first login
//   LINKS: M-AUTH, DF-001
// END_CONTRACT: loginHandler
export function loginHandler(req: Request, res: Response) {
  // START_BLOCK_VALIDATE_INPUT
  const { initData } = req.body
  if (!initData) {
    res.status(400).json({ message: 'initData required' })
    return
  }
  // END_BLOCK_VALIDATE_INPUT

  // START_BLOCK_VERIFY_TELEGRAM
  const tgUser = verifyTelegramInitData(initData)
  if (!tgUser) {
    res.status(401).json({ message: 'Invalid Telegram data' })
    return
  }
  // END_BLOCK_VERIFY_TELEGRAM

  const db = getDb()

  // START_BLOCK_FIND_EXISTING_USER
  const stmt = db.prepare('SELECT id, telegram_id, username, first_name FROM users WHERE telegram_id = ?')
  stmt.bind([tgUser.id])
  let user: AuthUser | undefined
  if (stmt.step()) {
    const row = stmt.getAsObject() as any
    user = { id: row.id, telegram_id: row.telegram_id, username: row.username, first_name: row.first_name }
  }
  stmt.free()
  // END_BLOCK_FIND_EXISTING_USER

  // START_BLOCK_CREATE_USER
  if (!user) {
    db.run('INSERT INTO users (telegram_id, username, first_name) VALUES (?, ?, ?)', [
      tgUser.id, tgUser.username || null, tgUser.first_name || null,
    ])

    const stmt2 = db.prepare('SELECT id, telegram_id, username, first_name FROM users WHERE telegram_id = ?')
    stmt2.bind([tgUser.id])
    stmt2.step()
    const row = stmt2.getAsObject() as any
    user = { id: row.id, telegram_id: row.telegram_id, username: row.username, first_name: row.first_name }
    stmt2.free()

    db.run('INSERT INTO stats (user_id) VALUES (?)', [user.id])
  }
  // END_BLOCK_CREATE_USER

  // START_BLOCK_SIGN_JWT
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
  // END_BLOCK_SIGN_JWT
}
// END_METHOD_loginHandler