# Примеры Кода

Используйте эти файлы как few-shot примеры для агентов. Это не канонические стартовые шаблоны, их не нужно копировать вслепую.

Примеры могут быть богаче шаблонов. Они могут показывать строгие поля контрактов, strict LDD markers, **различимые маркеры на разных ветках выполнения**, доменные invariants или языковые стили комментариев.

## Слои разметки (канон v0.1.1+)

Снаружи внутрь:

1. **`START_CLASS_<Symbol>` … `END_CLASS_<Symbol>`** — весь класс (или страница/компонент в HTML-примере как аналог «символа»).
2. **`START_METHOD_<symbol>` … `END_METHOD_<symbol>`** — вся модульная функция или метод; контракт **`START_CONTRACT` … `END_CONTRACT`** лежит **внутри** этой пары, сразу перед `def` / `func` / `export function` и т.д.
3. **`START_BLOCK_*` … `END_BLOCK_*`** — регионы внутри тела.

**Миграция:** старый стиль «только контракт перед `def` без `START_METHOD_*`» устарел для governed-кода; при обновлении файлов оборачивайте символ целиком парой `METHOD`/`CLASS`, не удаляя контракты и блоки.

| Язык | Файл | Что показывает |
|---|---|---|
| TypeScript | `module.typescript.example.ts` | METHOD + CONTRACT, strict LDD, blocks. |
| Python | `module.python.example.py` | CLASS/METHOD, docstring-style контракты, LDD. |
| JavaScript | `module.javascript.example.js` | METHOD + blocks, browser bridge. |
| Go | `module.go.example.go` | CLASS для типа, METHOD для package-level функции, blocks. |
| HTML | `module.html.example.html` | CLASS вокруг документа, markup blocks. |
| Java | `module.java.example.java` | CLASS сервиса, METHOD статических функций, LDD. |

Когда создаете новый модуль, начинайте с `templates/code/`. Когда нужно показать агенту, как GRACE должен выглядеть на конкретном языке, добавляйте релевантный пример в контекст.
