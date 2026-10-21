// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scanLocalization } from '../../tools/lib/localization-scan.mjs';

beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    localStorage.setItem('cbm.ui.language', 'zh');
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    const { initializeLocale } = await import('./locale');
    await initializeLocale();
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('Simplified Chinese coverage', () => {
    it('covers UI literals and every registered message template', () => {
        const audit = scanLocalization();
        expect(audit.files).toBeGreaterThan(300);
        expect(audit.issues).toEqual([]);
    });

    it('covers the singular and plural units used by every presentation counter', async () => {
        const { countWords, formatCount } = await import('./count');
        for (const word of scanLocalization().countUnits) expect(countWords[word], word).toMatch(/[\u3400-\u9fff]/);
        expect(formatCount(2, 'file', 'files')).toBe('2 个文件');
        expect(formatCount(1, 'call', 'calls')).toBe('1 次调用');
        const { galaxyLayerText } = await import('../galaxy/galaxy-strings');
        expect(galaxyLayerText.counts(2, 3)).toBe('2 个节点 · 3 条关系边');
        expect(formatCount(2000, 'node', 'nodes', '2,000')).toBe('2,000 个节点');
    });

    it.each([0, 1, 2, 3, 4] as const)('localizes reading level %i while preserving symbol targets', async depth => {
        const { CREATE_USER_IR, CORE_FACETS, presentation } = await import('../test-support/twin-fixtures');
        const { buildTwinViewModel, visibleTextOf } = await import('../twin/render-model');
        const { SECTION_ICONS } = await import('../twin/strings');
        const model = buildTwinViewModel(CREATE_USER_IR, presentation(depth, CORE_FACETS, 'plain'));
        const text = visibleTextOf(model);
        expect(text).toMatch(/[\u3400-\u9fff]/);
        expect(text).not.toMatch(/Nobody wrote|What this is for|What it does, in order|Where this index stops/);
        expect(CREATE_USER_IR.symbol.name).toBe('createUser');
        expect(Object.values(SECTION_ICONS).every(icon => icon.startsWith('codicon-'))).toBe(true);
        if (model.mode === 'guided') {
            expect(model.terms.length).toBeGreaterThan(0);
            for (const term of model.terms) {
                expect(term.term).toMatch(/[\u3400-\u9fff]/);
                expect(term.explanation).toMatch(/[\u3400-\u9fff]/);
            }
        }
    });

    it('localizes generated purpose text and preserves source-provided prose', async () => {
        const { CREATE_USER_IR } = await import('../test-support/twin-fixtures');
        const { purposeSentence } = await import('../ir/semantic-ir-builder');
        const { purposeSummary, kindLabel } = await import('./presentation');
        const ir = structuredClone(CREATE_USER_IR);
        ir.purpose.value = purposeSentence(ir.symbol, ir.steps.value.length, ir.reads.value.length, ir.throws.value.length);
        const raw = ir.purpose.value;
        expect(purposeSummary(ir)).toContain('函数 createUser');
        expect(purposeSummary(ir)).toContain('次调用');
        expect(ir.purpose.value).toBe(raw);
        ir.purpose.value = 'Author-provided documentation';
        expect(purposeSummary(ir)).toBe(ir.purpose.value);
        expect(kindLabel('CALLS')).toBe('调用');
        expect(kindLabel('Class')).toBe('类');
    });

    it('renders Chinese edge controls but sends the original graph type', async () => {
        const { TraceEdgeFilter } = await import('../galaxy/TraceEdgeFilter');
        const onChange = vi.fn();
        const container = document.createElement('div'); const root = createRoot(container);
        try {
            await act(async () => root.render(<TraceEdgeFilter kinds={[{ type: 'CALLS', count: 3, color: '#fff' }]} onChange={onChange} />));
            expect(container.textContent).toContain('调用');
            const only = container.querySelector<HTMLButtonElement>('button[aria-label="仅 调用"]');
            expect(only).not.toBeNull();
            await act(async () => only!.click());
            expect(onChange).toHaveBeenCalledWith(['CALLS']);
        } finally { await act(async () => root.unmount()); }
    });

    it('passes UI language to the model worker independently of prompt content', async () => {
        const requests: Record<string, unknown>[] = [];
        class WorkerMock {
            onmessage?: (event: { data: Record<string, unknown> }) => void;
            terminate = vi.fn();
            postMessage(request: Record<string, unknown>) {
                requests.push(request);
                queueMicrotask(() => this.onmessage?.({ data: { id: request.id, kind: 'ready' } }));
            }
        }
        vi.stubGlobal('Worker', WorkerMock);
        const { createBrowserChatRuntime } = await import('../browser-ai/browser-ai-runtime');
        const runtime = createBrowserChatRuntime();
        try {
            await runtime.prepare(vi.fn());
            expect(requests[0].uiLanguage).toBe('zh');
            expect(requests[0].kind).toBe('prepare');
            expect(requests[0].messages).toBeUndefined();
        } finally { runtime.dispose(); }
    });

    it('localizes configuration choices while retaining saved enum values', async () => {
        const { default: ConfigPanel } = await import('../settings/ConfigPanel');
        const { DEFAULT_GRAPH_DISPLAY } = await import('../galaxy/density');
        const snapshot = { revision: '1', settings: [{ key: 'ui-lang', label: 'UI language', description: 'Language used by the web UI.', category: 'ui', type: 'enum' as const,
            options: ['auto', 'en', 'zh'], defaultValue: 'auto', value: 'zh', override: 'zh', effective: 'zh', source: 'override', applyMode: 'live', pendingRestart: false, editable: true }] };
        const service = { configuration: vi.fn().mockResolvedValue(snapshot), saveConfiguration: vi.fn().mockResolvedValue(snapshot) };
        const container = document.createElement('div'); const root = createRoot(container);
        try {
            await act(async () => root.render(<ConfigPanel embedded project="zh-test" service={service} display={DEFAULT_GRAPH_DISPLAY} onDisplay={vi.fn()} onOpenBrowserModels={vi.fn()} onOpenDisplay={vi.fn()} onClose={vi.fn()} />));
            const select = container.querySelector<HTMLSelectElement>('#config-ui-lang')!;
            expect(select.value).toBe('zh');
            expect(select.querySelector('option[value="auto"]')?.textContent).toBe('自动');
            expect(select.querySelector('option[value="zh"]')?.textContent).toBe('简体中文（zh）');
            await act(async () => { select.value = 'en'; select.dispatchEvent(new Event('change', { bubbles: true })); });
            const save = [...container.querySelectorAll('button')].find(button => button.textContent === '保存变更')!;
            await act(async () => save.click());
            expect(service.saveConfiguration).toHaveBeenCalledWith('1', { 'ui-lang': 'en' });
        } finally { await act(async () => root.unmount()); }
    });

    it('loads Monaco’s bundled Chinese strings before creating the editor', async () => {
        await import('monaco-editor/nls/lang/zh-cn');
        const nls = globalThis as typeof globalThis & { _VSCODE_NLS_MESSAGES?: string[]; _VSCODE_NLS_LANGUAGE?: string };
        expect(nls._VSCODE_NLS_LANGUAGE).toBe('zh-cn');
        expect(nls._VSCODE_NLS_MESSAGES?.[1003]).toMatch(/查找|替换/);
    });
});
