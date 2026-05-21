$START_DEV_PLAN

**PURPOSE:** **Merge Tap** — Telegram Mini App: merge-головоломка (React/Vite + Express/sql.js + bot). **Версия:** `VERSION` (0.1.x).

**Стек:** React 18, Vite, TypeScript; Express, sql.js (SQLite in-memory + файл); node-telegram-bot-api.

**Принципы:** чистая логика доски в `board.ts`; JWT после верификации Telegram initData; GRACE-якоря в исходниках.

**Риски:** sql.js синхронный; без `saveDb()` — потеря БД при рестарте.

**Для людей:** `docs/README.md`.

---

## Модули

### Frontend — game core

| M-* | Путь | Назначение |
|-----|------|------------|
| M-TYPES | `frontend/src/game/types.ts` | Cell, Board, GameState, BOARD_SIZE=8, MERGE_REQUIRED=3 |
| M-BOARD_LOGIC | `frontend/src/game/board.ts` | create, spawn, remove, merge helpers |
| M-LEVELS | `frontend/src/game/levels.ts` | HSL-стили по уровню |
| M-API | `frontend/src/api/client.ts` | login, save, load, leaderboard |
| M-USE_GAME | `frontend/src/hooks/useGame.ts` | tap, remove mode, save/load |
| M-COMPONENTS | `frontend/src/components/` | Board, Cell, ScoreBar, ActionBar, Leaderboard |
| M-APP | `frontend/src/App.tsx` | Auth + UI composition |
| M-MAIN_ENTRY | `frontend/src/main.tsx` | React entry |

### Backend

| M-* | Путь | Назначение |
|-----|------|------------|
| M-DB | `backend/src/db.ts` | initDb, users/saves/stats |
| M-AUTH | `backend/src/middleware/auth.ts` | initData HMAC, JWT middleware |
| M-BACKEND_ROUTES | `backend/src/routes/` | game, users, leaderboard |
| M-BACKEND_ENTRY | `backend/src/index.ts` | Express, CORS, /api/health |

### Bot

| M-* | Путь | Назначение |
|-----|------|------------|
| M-BOT | `bot/src/index.ts` | /start, /top |

---

## Data flows

| ID | Описание |
|----|----------|
| DF-001 | Auth: WebApp initData → POST /api/auth/login → JWT |
| DF-002 | Save/Load: board, score, maxLevel → saves + top_score |
| DF-003 | Leaderboard: GET /api/leaderboard → top-20 |

---

## Phases

| # | Name | Status |
|---|------|--------|
| 1 | Foundation | done — types, board, levels, GRACE docs |
| 2 | Backend | done — SQLite, auth, REST |
| 3 | Frontend | done — UI, useGame, API client |
| 4 | Bot | done — /start, /top |
| 5 | Bugfixes+GRACE | current — SQL fixes, MODULE_CONTRACT markup |
| 6 | Testing | planned — board/levels/API tests |

---

### 1. Draft Code Graph

См. **`plans/AppGraph.xml`**.

```xml
<DraftCodeGraph>
  <frontend_main_tsx FILE="frontend/src/main.tsx" TYPE="ENTRY_POINT">
    <CrossLinks><Link TARGET="frontend_App_tsx" TYPE="RENDERS" /></CrossLinks>
  </frontend_main_tsx>
  <frontend_App_tsx FILE="frontend/src/App.tsx" TYPE="UI_ROOT">
    <CrossLinks>
      <Link TARGET="frontend_hooks_useGame_ts" TYPE="USES" />
      <Link TARGET="frontend_api_client_ts" TYPE="AUTH" />
    </CrossLinks>
  </frontend_App_tsx>
  <backend_index_ts FILE="backend/src/index.ts" TYPE="ENTRY_POINT">
    <CrossLinks>
      <Link TARGET="backend_db_ts" TYPE="INIT_DB" />
      <Link TARGET="backend_routes_DIR" TYPE="MOUNTS" />
    </CrossLinks>
  </backend_index_ts>
</DraftCodeGraph>
```

---

### 2. Step-by-step Data Flow

1. Игрок: `/start` в боте → inline «Open Game» → Mini App.
2. `App.tsx`: `api.login(initData)` → JWT в localStorage.
3. `useGame`: тапы → `board.ts` → при Save `api.saveGame`.
4. Leaderboard: `GET /api/leaderboard` из UI или `/top` в боте.

---

### 3. Acceptance Criteria

- [ ] Новый API: route + строка в `docs/README.md` + узел в AppGraph.
- [ ] `tsc --noEmit` в frontend/backend/bot.
- [ ] `tests/test_guide.md` при новых V-M-*.

$END_DEV_PLAN
