// FILE: backend/src/routes/users.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: User profile API route
//   SCOPE: GET /me — return authenticated user data from JWT payload
//   DEPENDS: M-AUTH
//   LINKS: M-BACKEND_ROUTES, V-M-BACKEND_ROUTES
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   GET /me - returns current user AuthUser payload
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// START_METHOD_profileHandler
// START_CONTRACT: profileHandler
//   PURPOSE: Return authenticated user's profile data
//   INPUTS: { req: Request, res: Response }
//   OUTPUTS: void (sends AuthUser object)
//   SIDE_EFFECTS: None
//   LINKS: M-BACKEND_ROUTES
// END_CONTRACT: profileHandler
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  res.json(req.user)
})
// END_METHOD_profileHandler

export default router