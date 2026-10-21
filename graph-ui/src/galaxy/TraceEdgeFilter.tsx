import { kindLabel } from '../i18n/presentation';
import { t, tr } from '../i18n/translate';
import type { EdgeKind } from './galaxy-legend';
import { FitLabel } from './toolbar-fit';

/** This changes which relationships traversal follows, not just their paint. */
export function TraceEdgeFilter({ kinds, availableTypes, selected, onChange }: {
    kinds: readonly EdgeKind[];
    /** Preserve relationships outside render limits when toggling a visible type. */
    availableTypes?: readonly string[];
    selected?: readonly string[];
    onChange: (types: string[] | undefined) => void;
}) {
    const included = new Set(selected ?? availableTypes ?? kinds.map(kind => kind.type));
    const includedCount = kinds.filter(kind => included.has(kind.type)).length;
    const shown = selected === undefined ? t('All') : includedCount === 0 ? t('None') : String(includedCount);
    return <details className="atlas-trace-edge-filter" onKeyDown={event => {
        if (event.key === 'Escape') {
            event.stopPropagation(); event.currentTarget.open = false;
            event.currentTarget.querySelector('summary')?.focus();
        }
    }}>
        {/* Review of K3: a narrow scoped toolbar shows "Types · All" (src/galaxy/toolbar-fit.tsx). */}
        <summary><FitLabel wide={tr`Edge types · ${shown}`} narrow={tr`Types · ${shown}`} /></summary>
        <div className="atlas-trace-edge-menu" role="group" aria-label={t("Trace edge types")}>
            <div className="atlas-trace-edge-actions">
                <button type="button" onClick={() => onChange(undefined)}>{t("All types")}</button>
                <button type="button" onClick={() => onChange([])}>{t("No types")}</button>
            </div>
            <small>{t("Rendered edges · All types restores hidden types.")}</small>
            {kinds.length === 0 && <small>{t("No edges in this view.")}</small>}
            {kinds.map(kind => <div className="atlas-trace-edge-row" key={kind.type}>
                <label><input type="checkbox" checked={included.has(kind.type)} onChange={() => {
                    const next = new Set(included);
                    if (!next.delete(kind.type)) next.add(kind.type);
                    onChange([...next].sort());
                }} /><i style={{ backgroundColor: kind.color }} aria-hidden="true" />{kindLabel(kind.type)}</label>
                <span className="atlas-trace-edge-count" aria-label={tr`${kind.count.toLocaleString()} rendered ${kindLabel(kind.type)} edges`}>{kind.count.toLocaleString()}</span>
                <button type="button" aria-label={tr`Only ${kindLabel(kind.type)}`} onClick={() => onChange([kind.type])}>{t("Only")}</button>
            </div>)}
        </div>
    </details>;
}
