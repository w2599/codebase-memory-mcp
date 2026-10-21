# Web UI languages

CBM Lens supports English and Simplified Chinese. The language selector in the
header offers Automatic, 简体中文, and English. Changing it reloads the page;
save any unsaved decision record or daemon settings first. The choice is a
browser preference, shared across projects, and does not create an index cache.

Automatic reads `GET /api/ui-config` before loading the workspace. The daemon's
`ui-lang` setting accepts `auto`, `zh`, or `en`:

```sh
codebase-memory-mcp config set ui-lang zh
```

With `ui-lang auto`, the server uses the request's `Accept-Language`. If the
configuration endpoint fails or times out, the UI falls back to browser
languages. An explicit browser selection takes precedence over the server.
Refresh an existing page after changing the daemon language setting.

Chinese copy covers navigation, indexing, coverage diagnostics, architecture,
change impact, all five reading levels, symbol details, generated flow and risk
explanations, tours, settings, chat controls, and Monaco's editor menus and
find/replace interface. Configuration choices and graph type names are
translated for display while their saved values and filter keys stay unchanged.
Source code, author-provided documentation, paths, selectors, identifiers, query
syntax, log records, raw server errors and model-generated answers are preserved.
Selecting a UI language does not change a model's prompting protocol.

UI literals use `t('English copy')`; dynamic messages use a tagged template such
as `` tr`Open source: ${name}` ``. Translations live in
`graph-ui/src/i18n/zh.ts`. Placeholders are substituted after translation so
inserted source data is never translated or interpreted as another placeholder.
Resolve the locale before importing catalogs that compute strings at module
initialization. New machine values must stay outside the translation helpers.

The Chinese Monaco language pack must load before importing the application:
editor modules initialize their menu labels at import time. The UI locale is
also sent separately to the browser model worker for its status and error copy.
Presentation counters share a singular/plural unit table. Source-provided prose
and semantic IR remain unchanged; only frontend-generated summaries are
localized for display.

`src/i18n/coverage.test.tsx` runs a read-only source audit covering UI literals,
message catalogs, templates, and counter units, plus Chinese rendering and
machine-value regression checks. Extend its scanner exceptions only for actual
source data, protocols or technical identifiers.

Validation:

```sh
cd graph-ui
npm run build
npm run test:unit
```

On Node versions exposing experimental global Web Storage, run the tests with
`NODE_OPTIONS=--no-experimental-webstorage` so jsdom supplies browser storage.
