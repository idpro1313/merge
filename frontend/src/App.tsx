// FILE: frontend/src/App.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Root React component — orchestrates Telegram auth, theme sync, game UI layout
//   SCOPE: Telegram WebApp expand/ready/themeParams, auth, MainButton, game board/score/actions/leaderboard
//   DEPENDS: M-USE_GAME, M-API, M-COMPONENTS, M-BOARD_LOGIC
//   LINKS: M-APP, V-M-APP
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   App - root component with Telegram integration, auth flow, and game UI composition
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - added Telegram.WebApp.expand(), themeParams sync, MainButton for save
// END_CHANGE_SUMMARY

import { useState, useEffect } from 'react'
import { Board } from './components/Board'
import { ScoreBar } from './components/ScoreBar'
import { ActionBar } from './components/ActionBar'
import { Leaderboard } from './components/Leaderboard'
import { useGame } from './hooks/useGame'
import { api } from './api/client'
import { countCells } from './game/board'

// START_BLOCK_TELEGRAM_GLOBAL
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        initData: string
        initDataUnsafe: { user?: { id: number; username?: string; first_name?: string } }
        close: () => void
        themeParams: {
          bg_color?: string
          secondary_bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
          setText: (text: string) => void
          enable: () => void
          disable: () => void
        }
      }
    }
  }
}
// END_BLOCK_TELEGRAM_GLOBAL

// START_METHOD_setThemeCSS
// START_CONTRACT: setThemeCSS
//   PURPOSE: Apply Telegram themeParams as CSS custom properties, fallback to dark defaults
//   INPUTS: { tg: NonNullable<Window["Telegram"]>["WebApp"] }
//   OUTPUTS: void
//   SIDE_EFFECTS: Sets --tg-* CSS variables on documentElement
//   LINKS: M-APP
// END_CONTRACT: setThemeCSS
function setThemeCSS(tg: NonNullable<Window['Telegram']>['WebApp']) {
  const tp = tg.themeParams
  const root = document.documentElement.style
  root.setProperty('--tg-bg', tp.bg_color || '#17212b')
  root.setProperty('--tg-secondary-bg', tp.secondary_bg_color || '#242f3d')
  root.setProperty('--tg-text', tp.text_color || '#ffffff')
  root.setProperty('--tg-hint', tp.hint_color || '#8b9eb0')
  root.setProperty('--tg-link', tp.link_color || '#6ab2f2')
  root.setProperty('--tg-button', tp.button_color || '#2ea6ff')
  root.setProperty('--tg-button-text', tp.button_text_color || '#ffffff')
}
// END_METHOD_setThemeCSS

// START_METHOD_App
// START_CONTRACT: App
//   PURPOSE: Root component — Telegram expand/ready, theme sync, auth, MainButton, game UI
//   INPUTS: none
//   OUTPUTS: JSX.Element
//   SIDE_EFFECTS: Calls api.login, configures MainButton, syncs theme CSS
//   LINKS: M-APP, DF-001
// END_CONTRACT: App
function App() {
  const game = useGame()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [authDone, setAuthDone] = useState(false)

  // START_BLOCK_TELEGRAM_INIT
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.expand()
      tg.ready()
      setThemeCSS(tg)

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
  // END_BLOCK_TELEGRAM_INIT

  // START_BLOCK_MAIN_BUTTON
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    const mb = tg.MainButton
    mb.setText('Save Game')
    mb.onClick(() => game.saveGame())

    if (authDone && !game.saved) {
      mb.show()
      mb.enable()
    } else {
      mb.hide()
    }

    return () => {
      mb.offClick(() => game.saveGame())
    }
  }, [authDone, game.saved, game.saveGame])
  // END_BLOCK_MAIN_BUTTON

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