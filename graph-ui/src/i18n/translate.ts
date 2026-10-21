import { getLocale } from './locale';
import { zh } from './zh';

/** UI copy only, including configuration metadata. Never repository content or raw logs. */
export function t(english: string): string {
    if (getLocale() !== 'zh') return english;
    if (Object.hasOwn(zh, english)) return zh[english];
    const trimmed = english.trim();
    if (!Object.hasOwn(zh, trimmed)) return english;
    return english.slice(0, english.indexOf(trimmed)) + zh[trimmed] + english.slice(english.indexOf(trimmed) + trimmed.length);
}

/** Substitute after translation, so names, paths and code are preserved byte for byte. */
export function tr(parts: TemplateStringsArray, ...values: unknown[]): string {
    const key = parts.map((part, index) => part + (index < values.length ? `{${index}}` : '')).join('');
    return t(key).replace(/\{(\d+)\}/g, (placeholder, index: string) => Number(index) < values.length ? String(values[Number(index)]) : placeholder);
}
