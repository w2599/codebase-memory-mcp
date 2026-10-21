# Native Theos Logos indexing

This local patch extends the built-in Objective-C Tree-sitter grammar. `.x` and
`.xm` files are discovered automatically and parsed directly from their original
bytes. No Logos executable, Theos installation, generated source tree, source
mapping database, or indexing Skill is required. The normal CBM cache and file
watcher own index storage and updates.

Supported syntax includes `%group`, `%hook`, `%subclass`, `%end`, `%hookf`, `%ctor`,
`%dtor`, `%new`, `%property`, `%config`, `%orig`, `&%orig`, `%c`, `%init` and `%log`.
Strings, comments and ordinary modulo expressions are handled by the grammar.
Missing block terminators remain visible in the normal parse diagnostics.

Groups become Module namespaces. Hook classes keep their original names inside
those namespaces. Hook methods use full signed selectors such as `-setA:b:` and
`+sharedInstance`, so groups, selector components and dispatch kinds do not
collapse into one symbol. Calls inside a hook belong to that hook. `%orig` is
not recorded as a recursive call to the replacement implementation. Ordinary
Objective-C method naming remains compatible with the existing indexer.

Paths, lines, source snippets and call byte offsets refer directly to the source
file. Objective-C markers in `.h` files select the Objective-C grammar; ordinary
C/C++ headers keep the existing C++ default. Custom extension mappings remain
available through CBM configuration.

## Limits

This is syntax indexing, not Logos code generation or runtime hook simulation.
`%init` class substitutions and dynamic dispatch do not prove runtime call edges.
`.xm` uses the existing Objective-C grammar, like `.mm`; arbitrary C++ constructs
may still produce partial-parse diagnostics. Headers containing isolated include
statement fragments, unexpanded SDK macros, and platform-specific assembly can
also have diagnostics. These are reported, not suppressed.

## Regenerating the grammar

The small extension lives in
`internal/cbm/vendored/grammars/objc/grammar.js`. `objc-base.js` is the MIT-licensed
tree-sitter-objc 3.0.2 grammar (commit
`181a81b8f23a2d593e7ab4259981f50122909fda`) from
<https://github.com/tree-sitter-grammars/tree-sitter-objc>.
Its pinned C grammar dependency is `tree-sitter-c` 0.23.4. With Tree-sitter CLI
0.25.10, run in the grammar directory:

```sh
npm ci --ignore-scripts
tree-sitter generate --abi 14
cp src/parser.c parser.c
cp src/tree_sitter/parser.h tree_sitter/parser.h
```

Remove the temporary `src/` and `node_modules/` directories after copying the
generated files; they are build inputs, not vendored runtime dependencies.
Refresh the corresponding SHA-256 entries in `scripts/vendored-checksums.txt`.
The generated C parser is compiled into the executable; npm and Tree-sitter CLI
are development dependencies only.

Build and test from the repository root:

```sh
scripts/build.sh --version 0.12.1-logos.1
scripts/test.sh --suites language,discover,extraction
```

Use a full native index of the original repository after switching from the old
snapshot-based adapter. Retire its project and `worker/logos-index` only after
checking original-file Hook coverage and native index diagnostics.

## Local validation (2026-10-21, macOS arm64)

- 851 language, discovery and extraction tests passed with ASan/UBSan.
- Vendored integrity and dangerous-call checks passed for all 1089 files.
- Native CLI fixtures passed with zero partial, unusable or skipped files.
- The original Theos project retained all 49 official Logos Hook definitions;
  all 144 File nodes matched current source metadata, and snippets returned
  original `.x` bytes and line numbers.
- The project retained 8 unrelated partial-parse diagnostics and 3 plist
  resource diagnostics; no diagnostics were suppressed by the Logos support.

This is a local patch on v0.12.1, not an upstream release. Keep this feature branch
when updating; installing an upstream binary replaces the local parser changes.
