// FILE: frontend/src/App.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Root React component — orchestrates auth, game state, and UI layout
//   SCOPE: Telegram WebApp auth, game board rendering, score/action bars, leaderboard modal
//   DEPENDS: M-USE_GAME, M-API, M-COMPONENTS, M-BOARD_LOGIC
//   LINKS: M-APP, V-M-APP
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   App - root component with auth flow and game UI composition
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import { useState, useEffect } from 'react'
import { Board } from './components/Board'
import { ScoreBar } from './components/ScoreBar'
import { ActionBar } from './components/ActionBar'
import { Leaderboard } from './components/Leaderboard'
import { useGame } from './hooks/useGame'
import { api } from './api/client'
import { countCells } from './game/board'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        initData: string
        initDataUnsafe: { user?: { id: number; username?: string; first_name?: string } }
        close: () => void
      }
    }
  }
}

// START_METHOD_App
// START_CONTRACT: App
//   PURPOSE: Root component — Telegram auth on mount, renders ScoreBar, Board, ActionBar, Leaderboard
//   INPUTS: none
//   OUTPUTS: JSX.Element
//   SIDE_EFFECTS: Calls api.login on mount with Telegram initData, manages auth state
//   LINKS: M-APP, DF-001
// END_CONTRACT: App
function App() {
  const game = useGame()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [authDone, setAuthDone] = useState(false)

  // START_BLOCK_AUTH_FLOW
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      const initData = tg.initData
      if (initData) {
        api.login(initData)
          .then(res => { localStorage.setItem('token', res.token); setAuthDone(true) })
          .catch(() => setAuthDone(true))
      } else {
        setAuthDone(true)
      }
    } else {
      setAuthDone(true)
    }
  }, [])
  // END_BLOCK_AUTH_FLOW

  const cellCount = countCells(game.board)

  return (
    <div className="app">
      <ScoreBar score={game.score} maxLevel={game.maxLevel} cellCount={cellCount} saved={game.saved} />
      <Board board={game.board} selectedCell={game.selectedCell} mergeCount={game.mergeCount} removeMode={game.removeMode} onCellClick={game.tapCell} />
      <ActionBar removeMode={game.removeMode} onToggleRemove={game.toggleRemoveMode} onSave={game.saveGame} onLoad={game.loadGame} onReset={game.resetGame} onLeaderboard={() => setShowLeaderboard(true)} />
      {!authDone && <div className="loading-overlay"><p>Authenticating...</p></div>}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  )
}
// END_METHOD_App

export default App