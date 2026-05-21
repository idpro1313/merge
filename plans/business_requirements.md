# Business requirements — Merge Tap

## Project

**Merge Tap** — игра на слияние ячеек в Telegram Mini App (React + Express + bot).

**Keywords:** merge-tap, Telegram, merge, 2048-like, Mini App.

## Actors

- **Player** — игра через Mini App.
- **TelegramBot** — /start, /top, inline-кнопка.
- **Backend** — Express + SQLite (sql.js).

## Use cases

| UC | Actor | Goal | Flow |
|----|-------|------|------|
| UC-001 | Player | Старт через /start | Inline «Open Game» |
| UC-002 | Player | Тап и слияние 3+ ячеек | DF-002 (gameplay) |
| UC-003 | Player | Remove mode | Удалить ячейку, spawn новой |
| UC-004 | Player | Сохранение | DF-002 |
| UC-005 | Player | Лидерборд | DF-003 |

## Non-goals

- Публичный API для сторонних приложений (v1).
- Мультиплеер / real-time sync.

## Constraints

- SQLite на одной инсталляции сервера.
- `JWT_SECRET`, `BOT_TOKEN` не в логах.
- GRACE-разметка в исходниках (MODULE_CONTRACT, BLOCK).

## Risks

- sql.js — синхронные операции, нет конкурентности.
- Потеря БД без `saveDb()` при рестарте.

## Open questions

- Нужны ли multiple save slots?
