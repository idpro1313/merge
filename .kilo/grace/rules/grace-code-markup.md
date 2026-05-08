# GRACE Code Markup Rules

Semantic markup is load-bearing structure for agents. It is not decorative commenting.

## Module Header

Every governed source file should begin with a module contract:

```text
START_MODULE_CONTRACT
  PURPOSE: одно предложение о том, что делает модуль
  SCOPE: операции, входящие в ответственность модуля
  DEPENDS: module IDs или внешние поверхности, от которых зависит модуль
  LINKS: knowledge graph IDs, verification refs или связанные контракты
  # Optional lint metadata, не входит в core 4-field contract:
  ROLE: optional file role for lint/review semantics
  MAP_MODE: optional rule for what MODULE_MAP should describe
END_MODULE_CONTRACT

START_MODULE_MAP
  exportedSymbol - краткое описание
END_MODULE_MAP

START_CHANGE_SUMMARY
  LAST_CHANGE: версия или дата - что изменилось и почему
END_CHANGE_SUMMARY
```

Adapt comment syntax to the language.

## Optional Lint Semantics

The core file-level `MODULE_CONTRACT` is the four-field contract: `PURPOSE`, `SCOPE`, `DEPENDS` и `LINKS`.

Use `ROLE` and `MAP_MODE` only when they help linting, review, or navigation. They are optional metadata, not part of the core four-field contract and not required noise for every small file.

Common roles:

- `RUNTIME`: normal source files with public APIs;
- `TEST`: tests where maps may describe helpers, fixtures, and assertions;
- `BARREL`: re-export aggregators;
- `CONFIG`: build or tool configuration files;
- `TYPES`: pure type/interface modules;
- `SCRIPT`: CLI, bootstrap, migration, or smoke scripts.

Common map modes:

- `EXPORTS`: `MODULE_MAP` describes public exports;
- `LOCALS`: `MODULE_MAP` describes important local helpers or fixtures;
- `SUMMARY`: `MODULE_MAP` summarizes grouped re-exports or entry points;
- `NONE`: `MODULE_MAP` can be omitted or kept minimal.

For fuller examples and role-specific guidance, see `references/semantic-markup.md`.

## Class and method wrappers (chunk / RAG anchors)

Pair tags **wrap the entire class or entire method/function body** (outer layer). They give stable boundaries for embedding, retrieval, and human chunking. Inner layers: **contract** (if present) then **`def` / `class`**, then **`START_BLOCK_*`** regions inside the body.

**Naming:** `START_CLASS_<Symbol>` / `END_CLASS_<Symbol>` and `START_METHOD_<symbol>` / `END_METHOD_<symbol>` where `<Symbol>` / `<symbol>` is the exact class or function/method name. Names must be **unique in the file** (same rule as `START_BLOCK_*`).

**Nesting (outside → inside):**

1. **`START_METHOD_foo`** — first line of the method’s markup region (same indentation as `def` for a method, column 0 for a top-level function).
2. Optionally **`START_CONTRACT: foo`** … **`END_CONTRACT: foo`** — still immediately **before** `def foo` / `async def foo`.
3. The **`def`** line and the **full method body** (including nested defs only if they are inner functions without their own `METHOD`—prefer giving inner functions their own `METHOD` when they are substantial).
4. **`END_METHOD_foo`** — on the line **after** the last line of the method body (paired with `START_METHOD_foo`; not before `def`).

For a **class**:

1. **`START_CLASS_Bar`** before any class-level contract or `class Bar`.
2. Optionally **`START_CONTRACT: Bar`** … **`END_CONTRACT: Bar`** before `class Bar`.
3. **`class Bar:`** and the **entire class body** (each method in the class wrapped in its own `START_METHOD_*` … `END_METHOD_*`).
4. **`END_CLASS_Bar`** after the last line of the class body.

**Module-level functions** use **`METHOD`** the same way as methods (treat as "module method"): `START_MODULE_CONTRACT` … then for each top-level function `START_METHOD_symbol` … `END_METHOD_symbol`.

**Decorators:** put `START_METHOD_name` **above** the decorator stack that applies to `def name`, so the wrapper includes decorators + `def` + body. For `@property`, the wrapped name is the **function** name under the decorator (e.g. `START_METHOD_radius` for `def radius(self)`).

**Logging:** prefer log lines that include both method/class scope and block, e.g. `[Module][ClassName.methodName][BLOCK_NAME]` or `[Module][functionName][BLOCK_NAME]` for free functions—align with `docs/verification-plan.xml` when paths matter.

## Function or Component Contracts

Every exported function/component and every critical local function must have a **contract** (unless the project explicitly waives it for a trivial symbol) **inside** the corresponding **`START_METHOD_*` … `END_METHOD_*`** region, **immediately before** `def` / `async def`:

```text
START_METHOD_symbolName
START_CONTRACT: symbolName
  PURPOSE:
  INPUTS:
  OUTPUTS:
  SIDE_EFFECTS:
  LINKS:
END_CONTRACT: symbolName
def symbolName(...):
  ...
END_METHOD_symbolName
```

For high-risk or high-autonomy code, add:

```text
  PRECONDITIONS:
  POSTCONDITIONS:
  INVARIANTS:
  FORBIDDEN_CHANGES:
  RATIONALE:
  KEYWORDS:
```

Every **exported class** and every **non-trivial class** should use **`START_CLASS_<Name>` … `END_CLASS_<Name>`** around the full class as in the section above. Trivial private helpers or nested one-liners may omit `CLASS`/`METHOD` only if the team documents the exception in `MAP_MODE` or local policy.

## Semantic Blocks

Use semantic blocks for important logic regions:

```text
START_BLOCK_VALIDATE_INPUT
...
END_BLOCK_VALIDATE_INPUT
```

Rules:

- block names describe what the block means, not how it is implemented;
- every `START_BLOCK_X` has a matching `END_BLOCK_X`;
- block names are unique inside a file;
- split blocks that grow too large for reliable local inspection;
- if a block is renamed, update log markers and verification refs;
- when behavior differs along branches (`if`/`else`, early `return`, distinct error paths), each **reachable outcome path** on critical modules should emit **distinguishable** log anchors (or one anchor with stable `branch` / `outcome` / `reasonCode` fields) aligned with `docs/verification-plan.xml` scenarios.

## Public and Private Context

Shared XML artifacts describe public module contracts and public interfaces.

File-local markup describes:

- private helpers;
- local orchestration;
- implementation-only types;
- subtle rationale;
- bug-fix context.

Do not mirror every private helper into `docs/knowledge-graph.xml`.

## Refactor Rules

- Preserve contracts unless the user approves a contract change.
- Preserve `START_CLASS_*` / `END_CLASS_*` and `START_METHOD_*` / `END_METHOD_*` pairs when moving code; rename tag suffixes if the symbol is renamed.
- Preserve block boundaries unless the refactor truly changes the structure.
- Update `MODULE_MAP` when public exports or important local surfaces change.
- Update `CHANGE_SUMMARY` after substantive changes.
- Add `BUG_FIX_CONTEXT` near complex or repeated bug fixes:

```text
BUG_FIX_CONTEXT: Previous approach failed because ...; this fix preserves ... by ...
```

## Legacy and Ambiguity

When behavior is unclear:

- preserve current behavior as much as possible;
- minimize changes;
- mark the ambiguity explicitly;
- do not invent business meaning.

Suggested marker:

```text
SEMANTIC_AMBIGUITY: behavior preserved; contract requires human clarification.
```
