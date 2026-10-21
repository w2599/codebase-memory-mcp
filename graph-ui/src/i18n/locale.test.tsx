// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.documentElement.lang = 'en';
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('UI language initialization', () => {
    it('loads the pinned server language before constructing the catalogs', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ lang: 'zh' }) }));
        const { initializeLocale } = await import('./locale');
        await initializeLocale();
        const { messages } = await import('./messages');
        const { workspaceStrings } = await import('../app/workspace-strings');
        expect(document.documentElement.lang).toBe('zh-CN');
        expect(messages.explorer.title).toBe('文件浏览');
        expect(messages.app.noProject).toBe('未选择项目');
        expect(workspaceStrings.workspaces.map(item => item.id)).toContain('architecture');
        expect(workspaceStrings.workspaces.find(item => item.id === 'architecture')?.label).toBe('架构');
        expect(messages.menu.items.map(item => item.key)).toEqual(['a', '?']);
        expect(workspaceStrings.briefValue).toBe('brief');
        expect(workspaceStrings.explainedValue).toBe('explained');
        const { activityStrings } = await import('../agents/activity-strings');
        expect(activityStrings.kinds).toEqual(['read', 'write', 'search', 'test', 'other']);
    });

    it('lets a browser preference override server settings without making a request', async () => {
        localStorage.setItem('cbm.ui.language', 'en');
        const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
        const { initializeLocale } = await import('./locale');
        await initializeLocale();
        const { messages } = await import('./messages');
        expect(document.documentElement.lang).toBe('en');
        expect(messages.explorer.title).toBe('EXPLORER');
        expect(fetch).not.toHaveBeenCalled();
    });

    it.each(['rejected', 'invalid', 'http error'])('starts with the browser language if config is %s', async failure => {
        vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['zh-CN']);
        vi.stubGlobal('fetch', failure === 'rejected' ? vi.fn().mockRejectedValue(new Error('offline'))
            : vi.fn().mockResolvedValue({ ok: failure !== 'http error', json: async () => ({ lang: 'unknown' }) }));
        localStorage.setItem('cbm.ui.language', 'invalid');
        const { initializeLocale, getLocalePreference } = await import('./locale');
        await initializeLocale();
        expect(document.documentElement.lang).toBe('zh-CN');
        expect(getLocalePreference()).toBe('auto');
    });

    it('continues if browser storage is blocked', async () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ lang: 'zh' }) }));
        const { initializeLocale, setLocalePreference, getLocalePreference } = await import('./locale');
        await initializeLocale();
        expect(document.documentElement.lang).toBe('zh-CN');
        expect(() => setLocalePreference('en')).not.toThrow();
        expect(getLocalePreference()).toBe('en');
    });

    it('keeps paths, selectors and placeholder-like user data intact', async () => {
        localStorage.setItem('cbm.ui.language', 'zh');
        const { initializeLocale } = await import('./locale'); await initializeLocale();
        const { messages } = await import('./messages');
        const { t, tr } = await import('./translate');
        const path = '/代码/close {1}/Hook.x';
        expect(messages.app.closeTab(path)).toBe(`关闭 ${path}`);
        expect(tr`Open source: ${'-setA:b:'}`).toBe('打开源码：-setA:b:');
        expect(tr`Calls ${1} to ${2} of ${3}${''}${''}`).toBe('调用 1 至 2，共 3 个');
        expect(t('unlisted upstream diagnostic')).toBe('unlisted upstream diagnostic');
        expect(t('Updated ')).toBe('已更新 ');
        expect(t('__proto__')).toBe('__proto__');
    });

    it('renders Chinese project controls and keeps filesystem paths unchanged', async () => {
        localStorage.setItem('cbm.ui.language', 'zh');
        const { initializeLocale } = await import('./locale'); await initializeLocale();
        const { default: AddProject } = await import('../projects/AddProjectIndexDialog');
        const container = document.createElement('div'); document.body.appendChild(container);
        const root = createRoot(container);
        const source = { browse: vi.fn().mockResolvedValue({ path: '/Users/test', parent: '/Users', roots: ['/Users/test'], dirs: ['Hook.x'] }),
            listProjects: vi.fn().mockResolvedValue([]), startIndex: vi.fn(), indexJobs: vi.fn(), projectHealth: vi.fn() };
        try {
            await act(async () => root.render(<AddProject open source={source} onClose={vi.fn()} onOpenProject={vi.fn()} />));
            expect(container.querySelector('h2')?.textContent).toBe('添加项目索引');
            expect(container.querySelector('input')?.placeholder).toBe('输入本地文件夹路径');
            expect(container.textContent).toContain('使用此文件夹');
            expect(container.textContent).toContain('/Users/test');
            expect(container.querySelector('[aria-label="打开文件夹 Hook.x"]')).not.toBeNull();
        } finally { await act(async () => root.unmount()); container.remove(); }
    });

    it('exposes an accessible language selector and remembers selection', async () => {
        localStorage.setItem('cbm.ui.language', 'zh');
        const { initializeLocale, setLocalePreference } = await import('./locale'); await initializeLocale();
        const { LanguageSelect } = await import('./LanguageSelect');
        const container = document.createElement('div'); const root = createRoot(container);
        try {
            await act(async () => root.render(<LanguageSelect />));
            const select = container.querySelector('select')!;
            expect(select.getAttribute('aria-label')).toBe('界面语言');
            expect(select.value).toBe('zh');
            expect([...select.options].map(option => option.value)).toEqual(['auto', 'zh', 'en']);
            setLocalePreference('en');
            expect(localStorage.getItem('cbm.ui.language')).toBe('en');
        } finally { await act(async () => root.unmount()); }
    });
});

it('keeps every translated template compatible with its English placeholders', async () => {
    const { zh } = await import('./zh');
    for (const [english, chinese] of Object.entries(zh)) {
        expect(chinese.trim(), english).not.toBe('');
        const placeholders = new Set(english.match(/\{\d+\}/g) ?? []);
        for (const placeholder of chinese.match(/\{\d+\}/g) ?? []) {
            expect(placeholders.has(placeholder), `${english}: ${placeholder}`).toBe(true);
        }
    }
});
