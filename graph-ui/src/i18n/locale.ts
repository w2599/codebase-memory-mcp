export type Locale = 'en' | 'zh';
export type LocalePreference = Locale | 'auto';

const STORAGE_KEY = 'cbm.ui.language';
let locale: Locale = 'en';
let preference: LocalePreference = 'auto';

export function getLocale(): Locale { return locale; }
export function getLocalePreference(): LocalePreference { return preference; }

/** Workers inherit UI language without browser storage or HTTP initialization. */
export function setRuntimeLocale(value: Locale): void { locale = value; }

export function setLocalePreference(value: LocalePreference): void {
    preference = value;
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* Storage can be disabled. */ }
}

export function browserLocale(languages: readonly string[]): Locale {
    return languages.some(language => /^zh(?:-|$)/i.test(language)) ? 'zh' : 'en';
}

/** Resolve language before importing modules that construct their UI catalogs. */
export async function initializeLocale(): Promise<void> {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        preference = saved === 'en' || saved === 'zh' ? saved : 'auto';
    } catch { preference = 'auto'; }
    locale = browserLocale(typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language]);
    if (preference !== 'auto') {
        locale = preference;
    } else {
        try {
            const response = await fetch('/api/ui-config', { signal: AbortSignal.timeout(3000) });
            if (response.ok) {
                const config: unknown = await response.json();
                if (config !== null && typeof config === 'object' && 'lang' in config && (config.lang === 'en' || config.lang === 'zh')) {
                    locale = config.lang;
                }
            }
        } catch { /* The workspace can still start when config is unavailable. */ }
    }
    if (typeof document !== 'undefined') document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
}
