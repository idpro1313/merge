// FILE: frontend/src/api/client.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: HTTP API client for backend communication (auth, game save/load, leaderboard)
//   SCOPE: Login, profile retrieval, game save/load, leaderboard fetching via authenticated requests
//   DEPENDS: none (uses fetch API)
//   LINKS: M-API, V-M-API
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   SaveData - Serialized board data for save/load API
//   LeaderboardEntry - Leaderboard entry from API
//   UserProfile - User profile from API
//   api.login - Authenticates via Telegram initData, returns token
//   api.getProfile - Fetches current user profile
//   api.saveGame - Saves current game state to backend
//   api.loadGame - Loads saved game state from backend
//   api.getLeaderboard - Fetches leaderboard entries
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

const API_BASE = '/api'

// START_METHOD_request
// START_CONTRACT: request
//   PURPOSE: Generic authenticated HTTP request helper
//   INPUTS: { path: string, options?: RequestInit }
//   OUTPUTS: Promise<T>
//   SIDE_EFFECTS: Reads token from localStorage, throws on non-ok response
//   LINKS: M-API
// END_CONTRACT: request
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(API_BASE + path, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}
// END_METHOD_request

export interface SaveData {
  board: (null | { level: number; id: string })[][]
  score: number
  maxLevel: number
}

export interface LeaderboardEntry {
  telegram_id: number
  username: string | null
  score: number
  rank: number
}

export interface UserProfile {
  id: number
  telegram_id: number
  username: string | null
  first_name: string | null
}

export const api = {
  login: (initData: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ initData }),
    }),

  getProfile: () => request<UserProfile>('/users/me'),

  saveGame: (data: SaveData) =>
    request<{ ok: boolean }>('/game/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loadGame: () => request<SaveData | null>('/game/load'),

  getLeaderboard: () => request<LeaderboardEntry[]>('/leaderboard'),
}