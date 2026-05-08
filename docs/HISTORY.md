# История изменений проекта Merge Tap


## 0.1.0 — GRACE integrity fixes (post-review)

- Исправлены критические markup-проблемы (аудит выявил 18 критических):
  - `main.tsx`: убрана некорректная декларация экспорта в MODULE_MAP, добавлен BLOCK
  - `Cell.tsx`: METHOD перенесён с приватной CellInner на экспортируемый Cell
  - `client.ts`: добавлен контракт для объекта api, убраны fn-аннотации для методов api (они не функции)
  - `bot/index.ts`: исправлена обратная вложенность BLOCK/METHOD, убран фиктивный METHOD_botSetup, все блоки вложены в METHOD_init
- Исправлена опечатка SIDE_EFFECTES (→ SIDE_EFFECTS) в 11 контрактах `board.ts`
- `knowledge-graph.xml`: исправлены depends (M-BOT), добавлены 12 CrossLinks, 5 модулей с аннотациями, типы и константы M-TYPES/M-API/M-LEVELS
- `development-plan.xml`: убран несуществующий M-CONFIG из Phase-1
- `technology.xml`: уникальные теги для dep/constraint/tool
- `verification-plan.xml`: gate-Phase-5
- Создан `docs/operational-packets.xml`

**Причина:** GRACE full-integrity review показал 18 критических проблем в markup, graph и XML-соглашениях.
**Затронутые файлы:** main.tsx, Cell.tsx, client.ts, bot/index.ts, board.ts, docs/*.xml (все 6)
---

## 0.1.0 — Инициализация GRACE-структуры

### Сессия 2 (текущая)

**Что сделано:**
- Исправлены критичные баги в backend:
  - `backend/src/db.ts`: удалены trailing commas в SQL CREATE TABLE
  - `backend/src/routes/leaderboard.ts`: исправлена SQL-строка (добавлены кавычки backtick)
  - `backend/src/middleware/auth.ts`: исправлен FK mismatch — stats.user_id теперь ссылается на internal users.id, не на telegram_id
- Созданы отсутствующие GRACE-артефакты: `docs/development-plan.xml`, `docs/verification-plan.xml`
- Добавлена GRACE-разметка во все 19 исходных файлов:
  - 6 файлов backend: index.ts, db.ts, middleware/auth.ts, routes/game.ts, routes/leaderboard.ts, routes/users.ts
  - 8 файлов frontend: App.tsx, main.tsx, Board.tsx, Cell.tsx, ScoreBar.tsx, ActionBar.tsx, Leaderboard.tsx, useGame.ts
  - 5 файлов frontend game/api: types.ts, board.ts, levels.ts, client.ts
  - 1 файл bot: index.ts
- Добавлены METHOD/BLOCK-теги в уже размеченные файлы (types.ts имел MODULE_CONTRACT без METHOD)
- Созданы конфиги: `bot/package.json`, `backend/tsconfig.json`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`

**Почему:**
- Требование `requirements.xml` constraint-3: все исходные файлы должны содержать GRACE-разметку
- Технические баги предотвращали запуск (SQL syntax errors, FK mismatch)

**Затронутые файлы:**
- `backend/src/db.ts`, `backend/src/routes/leaderboard.ts`, `backend/src/middleware/auth.ts`
- `docs/development-plan.xml`, `docs/verification-plan.xml`
- Все `.ts`/`.tsx` в `backend/src/`, `frontend/src/`, `bot/src/`
- `bot/package.json`, `backend/tsconfig.json`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`

**Коммиты в этой сессии:**
- Исправлены баги: SQL trailing commas, SQL quoting, FK mismatch
- Добавлена GRACE-разметка во все исходники
- Созданы конфиги package.json и tsconfig

---


## 0.1.0 — GRACE integrity fixes (post-review)

- Исправлены критические markup-проблемы (аудит выявил 18 критических):
  - `main.tsx`: убрана некорректная декларация экспорта в MODULE_MAP, добавлен BLOCK
  - `Cell.tsx`: METHOD перенесён с приватной CellInner на экспортируемый Cell
  - `client.ts`: добавлен контракт для объекта api, убраны fn-аннотации для методов api (они не функции)
  - `bot/index.ts`: исправлена обратная вложенность BLOCK/METHOD, убран фиктивный METHOD_botSetup, все блоки вложены в METHOD_init
- Исправлена опечатка SIDE_EFFECTES (→ SIDE_EFFECTS) в 11 контрактах `board.ts`
- `knowledge-graph.xml`: исправлены depends (M-BOT), добавлены 12 CrossLinks, 5 модулей с аннотациями, типы и константы M-TYPES/M-API/M-LEVELS
- `development-plan.xml`: убран несуществующий M-CONFIG из Phase-1
- `technology.xml`: уникальные теги для dep/constraint/tool
- `verification-plan.xml`: gate-Phase-5
- Создан `docs/operational-packets.xml`

**Причина:** GRACE full-integrity review показал 18 критических проблем в markup, graph и XML-соглашениях.
**Затронутые файлы:** main.tsx, Cell.tsx, client.ts, bot/index.ts, board.ts, docs/*.xml (все 6)
---

## 0.1.0 — Инициализация GRACE-структуры (предыдущая сессия)

- Создана корневая документация GRACE: `docs/` с артефактами requirements, technology, development-plan, verification-plan, knowledge-graph, operational-packets.
- Создан `VERSION` (SemVer 0.1.0) в корне проекта.
- Создан `AGENTS.md` с протоколом GRACE-инженерии для агентов.
- Добавлена GRACE-разметка (MODULE_CONTRACT, MODULE_MAP, CHANGE_SUMMARY, METHOD/CLASS/BLOCK-теги) во все исходные файлы.
- Удалён мусорный `test-file.ts`.
- **Причина:** приведение проекта в соответствие с правилами `.kilo/rules/agent.md` и GRACE-правилами.
- **Затронутые файлы:** `VERSION`, `AGENTS.md`, `docs/HISTORY.md`, `docs/*.xml`, все `.ts`/`.tsx` файлы в `backend/`, `frontend/`, `bot/`.