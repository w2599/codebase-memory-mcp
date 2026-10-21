/** Audit UI-owned copy; raw source, protocol tokens and language-specific model answers are excluded. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const ts = createRequire(import.meta.url)('typescript');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src');
const source = fs.readFileSync(path.join(root, 'i18n/zh.ts'), 'utf8');
const zh = JSON.parse(source.slice(source.indexOf('= ') + 2).replace(/;\s*$/, ''));
const attributes = new Set(['text', 'aria-description', 'aria-valuetext', 'caption', 'help', 'emptyText', 'loadingText', 'buttonLabel', 'title', 'placeholder', 'aria-label', 'alt', 'label', 'headline', 'note', 'empty', 'message', 'source']);
const properties = new Set(['title', 'label', 'message', 'hint', 'note', 'detail', 'description', 'headline', 'placeholder', 'empty', 'tooltip', 'subtitle', 'reason', 'summary', 'warning']);
const tokens = new Set(['id', 'key', 'intent', 'type', 'kind', 'side', 'icon', 'storageKey', 'briefValue', 'explainedValue', 'path', 'file_path', 'qualified_name', 'command', 'labelFilter', 'value', 'kinds', 'terminology']);
function catalog(n, file) {
  if (!/(?:strings|messages|why-model)\.ts$/.test(file)) return false;
  if (file.endsWith('/browser-ai/strings.ts')) {
    for (let p = n; p; p = p.parent) {
      if (ts.isVariableDeclaration(p)) return ['browserAiText', 'browserChatText'].includes(p.name.getText());
    }
    return false;
  }
  return true;
}
function blocked(n) {
  if (ts.isTaggedTemplateExpression(n.parent) || ts.isPropertyAssignment(n.parent) && n.parent.name === n) return true;
  for (let p = n.parent; p; p = p.parent) {
    if (ts.isTaggedTemplateExpression(p) && p.tag.getText() === 'tr') return false;
    if (ts.isTypeNode(p) || ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isCaseClause(p) && p.expression === n || ts.isElementAccessExpression(p)) return true;
    if (ts.isPropertyAssignment(p) && tokens.has(p.name.getText().replace(/['"]/g, ''))) return true;
    if (ts.isFunctionLike(p) || ts.isJsxExpression(p) || ts.isJsxElement(p) || ts.isJsxFragment(p)) break;
    if (ts.isBinaryExpression(p) && ![ts.SyntaxKind.PlusToken, ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(p.operatorToken.kind)) return true;
    if (ts.isCallExpression(p) || ts.isNewExpression(p)) {
      const name = p.expression.getText();
      if (name === 't' || !/^set[A-Za-z]*(?:Message|Detail|Hint|Error|Notice)$|^Error$|^countOf$|^confirm$|^window.confirm$/.test(name)) return true;
      return false;
    }
  }
  return false;
}
function context(n, file) {
  if (file.includes('/test-support/')) return false;
  if (blocked(n)) return false;
  if (/\/(?:app\/ui-log|ui\/tooltip\/tooltip-model|galaxy\/test-scope-fetch)\.ts$/.test(file)) return false;
  if (file.endsWith('/browser-ai/strings.ts') && !catalog(n, file)) return false;
  for (let p = n; p; p = p.parent) {
    if (ts.isVariableDeclaration(p) && /^(?:SAY_CLASS|SAY_TESTID|SECTION_ICONS|AVOIDED_WORDS)$/.test(p.name.getText())) return false;
    if ((ts.isFunctionDeclaration(p) || ts.isFunctionExpression(p)) && /^(?:allowedWorkspace|initialWorkspace|avoidedWordsIn)$/.test(p.name?.getText() ?? '')) return false;
    if (ts.isCallExpression(p) && p.expression.getText() === 'countOf') return false;
  }
  if (file.endsWith('/galaxy/GalaxyPanel.tsx')) {
    for (let p = n; p; p = p.parent) if (ts.isVariableDeclaration(p) && p.name.getText() === 'action') return false;
  }
  if (catalog(n, file)) return true;
  for (let p = n.parent; p; p = p.parent) if (ts.isTaggedTemplateExpression(p) && p.tag.getText() === 'tr') return true;
  for (let p = n; p; p = p.parent) {
    if (ts.isJsxAttribute(p)) return attributes.has(p.name.getText());
    if (ts.isJsxExpression(p)) return !ts.isJsxAttribute(p.parent) || attributes.has(p.parent.name.getText());
    if (ts.isJsxText(p)) return true;
    if (ts.isPropertyAssignment(p) && properties.has(p.name.getText().replace(/['"]/g, ''))) return true;
    if ((ts.isCallExpression(p) || ts.isNewExpression(p)) && /^set[A-Za-z]*(?:Message|Detail|Hint|Error|Notice)$|^Error$|^countOf$|^confirm$|^window.confirm$/.test(p.expression.getText())) return true;
  }
  return false;
}
function flatten(n) {
  if (ts.isParenthesizedExpression(n)) return flatten(n.expression);
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return {
    strings: [n.text],
    expr: []
  };
  if (ts.isTemplateExpression(n)) return {
    strings: [n.head.text, ...n.templateSpans.map(s => s.literal.text)],
    expr: n.templateSpans.map(s => s.expression)
  };
  if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    let l = flatten(n.left),
      r = flatten(n.right);
    if (!l && !r) return null;
    l ??= {
      strings: ['', ''],
      expr: [n.left]
    };
    r ??= {
      strings: ['', ''],
      expr: [n.right]
    };
    return {
      strings: [...l.strings.slice(0, -1), l.strings.at(-1) + r.strings[0], ...r.strings.slice(1)],
      expr: [...l.expr, ...r.expr]
    };
  }
  return null;
}
function jsxText(s) {
  const lines = s.replace(/\t/g, ' ').split(/\r?\n/),
    last = lines.findLastIndex(l => l.trim());
  return lines.map((line, i) => {
    if (i) line = line.replace(/^ +/, '');
    if (i < lines.length - 1) line = line.replace(/ +$/, '');
    return line + (line && i < last ? ' ' : '');
  }).join('');
}
function human(key) {
  const s = key.trim();
  return /[A-Za-z]{2}/.test(s) && !/^\{\d+\}(?:[\s·:→%-]*\{\d+\})*$/.test(s);
}
function known(key) {
  return Object.hasOwn(zh, key) || Object.hasOwn(zh, key.trim());
}
function technical(key, file) {
  const value = key.trim();
  if (/^(?:atlas-|codeatlas-|codicon-)[a-z0-9-]+$/.test(value)) return true;
  if (['CBM LENS', 'English', 'PostToolUse', 'thought-only', 'cbm-atlas-trace.py'].includes(value)) return true;
  if (/^(?:alt\+|enter|esc|\[Enter\]|⌘ \/ Ctrl K)$/.test(value)) return true;
  if (/^(?:https?:\/\/|\/api\/|\/absolute\/|\.claude\/|GET \/(?:props|v1\/models))/.test(value)) return true;
  if (/^llm\/(?:start|stop)\.sh(?: class-a)?$/.test(value) || value.startsWith('class-a | class-a-lfm |')) return true;
  if (/^model-\{\d+\}$/.test(value) || value === '{0} / {1} MB') return true;
  return file.endsWith('/traces/bug-wizard-strings.ts') && value.startsWith("echo '") && value.endsWith('cli ingest_traces');
}
export function scanLocalization() {
  const files = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, {
      withFileTypes: true
    })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);else if (/\.tsx?$/.test(file) && !/(?:\.test\.|\.fixture\.|\/test-support\/|\/i18n\/(?:zh|locale|translate|count)\.)/.test(file)) files.push(file);
    }
  }
  walk(root);
  const issues = [],
    countUnits = new Set();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const report = (node, key, rule) => issues.push({
      file: path.relative(root, file),
      line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
      key,
      rule
    });
    function visit(node) {
      if (ts.isCallExpression(node) && (node.expression.getText() === 'countOf' || file.endsWith('/galaxy/galaxy-strings.ts') && node.expression.getText() === 'count')) {
        for (const argument of node.arguments.slice(1)) if (ts.isStringLiteral(argument)) countUnits.add(argument.text);
      }
      const marked = ts.isCallExpression(node) && node.expression.getText() === 't' && node.arguments[0] && ts.isStringLiteral(node.arguments[0]) ? {
        strings: [node.arguments[0].text],
        expr: []
      } : ts.isTaggedTemplateExpression(node) && node.tag.getText() === 'tr' ? flatten(node.template) : null;
      if (marked) {
        const key = marked.strings.map((part, index) => part + (index < marked.expr.length ? `{${index}}` : '')).join('');
        if (!known(key) && !technical(key, file)) report(node, key, 'missing translation');
      }
      const shape = ts.isJsxText(node) ? {
        strings: [jsxText(node.text)],
        expr: []
      } : flatten(node);
      if (shape && context(node, file)) {
        const key = shape.strings.map((part, index) => part + (index < shape.expr.length ? `{${index}}` : '')).join('');
        if (human(key)) {
          if (!technical(key, file) && !/^#[0-9a-f]{3,8}$/i.test(key)) report(node, key, 'unlocalized UI literal');
          for (const expression of shape.expr) visit(expression);
          return;
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
  }
  return {
    issues,
    countUnits: [...countUnits],
    files: files.length
  };
}
