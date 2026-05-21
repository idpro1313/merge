# Test guide — Merge Tap (mode-qa)

## Политика

- Формат логов: `[Module][function][BLOCK_NAME] message`
- Phase 6: unit-тесты для `board.ts`, `levels.ts`, API (пока **planned**).
- Без логирования `JWT_SECRET`, `BOT_TOKEN`, initData.

## Команды

| Область | Команда |
|---------|---------|
| Typecheck (все пакеты) | `npm run build` или в каждой папке `npx tsc --noEmit` |
| Frontend | `cd frontend && npx tsc --noEmit` |
| Backend | `cd backend && npx tsc --noEmit` |
| Bot | `cd bot && npx tsc --noEmit` |
| Health smoke | `curl http://localhost:3001/api/health` → `{ "status": "ok" }` |

**Тесты в репозитории:** пока нет `tests/*.test.ts`; файлы из verification-plan — добавлять по Phase-6.

## Phase gates

| Gate | Checks |
|------|--------|
| Phase-5 | Нет trailing comma в SQL CREATE; leaderboard SQL quoted; `stats.user_id` → `users.id`; `tsc --noEmit` OK |

## V-M-* (кратко)

| Module | Focus |
|--------|--------|
| V-M-TYPES | BOARD_SIZE=8, MERGE_REQUIRED=3 |
| V-M-BOARD_LOGIC | spawn, remove, clone, full board |
| V-M-LEVELS | HSL per level |
| V-M-USE_GAME | tap merge, remove mode, save/load |
| V-M-API | login, save, load, leaderboard + Bearer |
| V-M-COMPONENTS | Board grid, Leaderboard modal |
| V-M-APP | login on mount, loading overlay |
| V-M-DB | users, saves, stats; foreign_keys |
| V-M-AUTH | initData HMAC, JWT 7d |
| V-M-BACKEND_ROUTES | save 400 без board, top-20 |
| V-M-BACKEND_ENTRY | /api/health, PORT 3001 |
| V-M-BOT | /start button, /top, exit без BOT_TOKEN |

## Критические потоки

| Flow | Steps |
|------|-------|
| DF-001 | initData → POST /api/auth/login → JWT |
| DF-002 | POST save, GET load, top_score update |
| DF-003 | GET /api/leaderboard → UI modal или bot /top |
