// FILE: bot/src/index.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Telegram bot for Merge Tap Mini App interaction
//   SCOPE: /start command with inline Mini App button, /top command with leaderboard
//   DEPENDS: node-telegram-bot-api
//   LINKS: M-BOT, UC-001
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   init - validates config, creates bot instance, registers handlers, signals ready
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup; fixed BLOCK/METHOD nesting
// END_CHANGE_SUMMARY

import TelegramBot from 'node-telegram-bot-api'

const BOT_TOKEN = process.env.BOT_TOKEN || ''
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://merge-tap.example.com'

// START_METHOD_init
// START_CONTRACT: init
//   PURPOSE: Validate config, create bot, register /start and /top handlers
//   INPUTS: none (uses process.env)
//   OUTPUTS: void
//   SIDE_EFFECTS: Exits process on missing config, creates TelegramBot with polling, logs startup
//   LINKS: M-BOT
// END_CONTRACT: init

// START_BLOCK_VALIDATE_CONFIG
if (!BOT_TOKEN) {
  console.error('BOT_TOKEN environment variable is required')
  process.exit(1)
}
// END_BLOCK_VALIDATE_CONFIG

// START_BLOCK_CREATE_BOT
const bot = new TelegramBot(BOT_TOKEN, { polling: true })
// END_BLOCK_CREATE_BOT

// START_BLOCK_REGISTER_START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Welcome to Merge Tap! Merge 3 items to level up.', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Open Game', web_app: { url: MINI_APP_URL } }
      ]]
    }
  })
})
// END_BLOCK_REGISTER_START

// START_BLOCK_REGISTER_TOP
bot.onText(/\/top/, async (msg) => {
  const chatId = msg.chat.id
  try {
    const baseUrl = MINI_APP_URL.replace('/game', '')
    const res = await fetch(baseUrl + '/api/leaderboard')
    const data = await res.json() as any[]
    if (data.length === 0) {
      bot.sendMessage(chatId, 'No scores yet. Play the game to get on the leaderboard!')
      return
    }
    const lines = data.map((e: any, i: number) => (i + 1) + '. ' + (e.username || 'Anonymous') + ' \u2014 ' + e.score)
    bot.sendMessage(chatId, '\uD83C\uDFC6 Leaderboard\n\n' + lines.join('\n'))
  } catch {
    bot.sendMessage(chatId, 'Failed to load leaderboard.')
  }
})
// END_BLOCK_REGISTER_TOP

// START_BLOCK_INIT_DONE
console.log('Bot started')
// END_BLOCK_INIT_DONE

// END_METHOD_init