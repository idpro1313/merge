// FILE: bot/src/index.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Telegram bot for Merge Tap Mini App interaction
//   SCOPE: /start command with inline Mini App button, /top command with leaderboard
//   DEPENDS: node-telegram-bot-api, backend API
//   LINKS: M-BOT, UC-001
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   bot - TelegramBot instance configuration
//   /start handler - welcome message with Mini App button
//   /top handler - leaderboard display
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

import TelegramBot from 'node-telegram-bot-api'

const BOT_TOKEN = process.env.BOT_TOKEN || ''
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://merge-tap.example.com'

// START_BLOCK_VALIDATE_CONFIG
if (!BOT_TOKEN) {
  console.error('BOT_TOKEN environment variable is required')
  process.exit(1)
}
// END_BLOCK_VALIDATE_CONFIG

// START_BLOCK_BOT_SETUP
// START_METHOD_botSetup
// START_CONTRACT: botSetup
//   PURPOSE: Create and configure TelegramBot instance with polling
//   INPUTS: { BOT_TOKEN: string - Telegram bot token from env }
//   OUTPUTS: { TelegramBot - configured bot instance }
//   SIDE_EFFECTS: starts long polling
//   LINKS: M-BOT
// END_CONTRACT: botSetup
const bot = new TelegramBot(BOT_TOKEN, { polling: true })
// END_METHOD_botSetup
// END_BLOCK_BOT_SETUP

// START_METHOD_startHandler
// START_CONTRACT: startHandler
//   PURPOSE: Handle /start command - send welcome message with Mini App launch button
//   INPUTS: { msg: TelegramBot.Message - incoming message with chat context }
//   OUTPUTS: { Promise<void> - sends Telegram message with inline keyboard }
//   SIDE_EFFECTS: sends message to Telegram chat
//   LINKS: M-BOT, UC-001
// END_CONTRACT: startHandler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  // START_BLOCK_SEND_WELCOME
  bot.sendMessage(chatId, 'Welcome to Merge Tap! Merge 3 items to level up.', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Open Game', web_app: { url: MINI_APP_URL } }
      ]]
    }
  })
  // END_BLOCK_SEND_WELCOME
})
// END_METHOD_startHandler

// START_METHOD_topHandler
// START_CONTRACT: topHandler
//   PURPOSE: Handle /top command - fetch and display leaderboard from backend API
//   INPUTS: { msg: TelegramBot.Message - incoming message with chat context }
//   OUTPUTS: { Promise<void> - sends leaderboard message or error to Telegram chat }
//   SIDE_EFFECTS: sends message to Telegram chat, makes HTTP request to backend API
//   LINKS: M-BOT, UC-001
// END_CONTRACT: topHandler
bot.onText(/\/top/, async (msg) => {
  const chatId = msg.chat.id
  // START_BLOCK_FETCH_LEADERBOARD
  try {
    const baseUrl = MINI_APP_URL.replace('/game', '')
    const res = await fetch(baseUrl + '/api/leaderboard')
    const data = await res.json() as any[]
    // END_BLOCK_FETCH_LEADERBOARD
    // START_BLOCK_CHECK_EMPTY
    if (data.length === 0) {
      bot.sendMessage(chatId, 'No scores yet. Play the game to get on the leaderboard!')
      return
    }
    // END_BLOCK_CHECK_EMPTY
    // START_BLOCK_FORMAT_LEADERBOARD
    const lines = data.map((e: any, i: number) => (i + 1) + '. ' + (e.username || 'Anonymous') + ' \u2014 ' + e.score)
    bot.sendMessage(chatId, '\uD83C\uDFC6 Leaderboard\n\n' + lines.join('\n'))
    // END_BLOCK_FORMAT_LEADERBOARD
  // START_BLOCK_HANDLE_ERROR
  } catch {
    bot.sendMessage(chatId, 'Failed to load leaderboard.')
  }
  // END_BLOCK_HANDLE_ERROR
})
// END_METHOD_topHandler

// START_BLOCK_INIT_DONE
console.log('Bot started')
// END_BLOCK_INIT_DONE