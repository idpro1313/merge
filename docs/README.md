# Документация проекта

> Для агентов карта — **plans/** (Grace 2). Этот файл — для людей.

## Обзор

**Merge Tap** — игра «слияние» (merge) как **Telegram Mini App**: фронтенд на React/Vite, бэкенд API, отдельный бот. Состояние игры, лидерборд, сохранения через API.

## Стек

- **Frontend:** TypeScript, React, Vite (`frontend/`)
- **Backend:** TypeScript, Node (`backend/`)
- **Bot:** TypeScript (`bot/`)
- **Деплой:** по настройкам репозитория; локально — см. README в каталогах сервисов

## Структура репозитория

| Путь | Назначение |
|------|------------|
| `frontend/` | UI Mini App, `Telegram.WebApp`, игровая доска |
| `backend/` | REST API, БД, auth |
| `bot/` | Telegram-бот |
| `docs/` | `README.md`, `HISTORY.md` |
| `plans/` | Grace 2: `DevelopmentPlan.md`, `AppGraph.xml`, `business_requirements.md` |
| `tests/` | `test_guide.md` — V-M-*, phase gates |
| `work/` | Вспомогательные артефакты агента (отчёты, черновики); **не в git** |
| `.cursor/`, `.kilocode/` | Grace 2 rules и skills `mode-*` |

## Версия

Файл **`VERSION`** в корне (SemVer).

## Правила агента

- **Grace 2:** `.cursor/rules/grace-2-framework.mdc`, `.kilocode/rules/rules.md`; skills `mode-architect` → `mode-code` → `mode-debug` → `mode-qa`.
- **Ops:** `.cursor/rules/agent-rules.mdc` — журнал в `docs/HISTORY.md` до коммита; subject **`X.Y.Z: описание`**; PowerShell.

