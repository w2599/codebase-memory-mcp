import { t } from '../i18n/translate';
import { useEffect, useRef } from 'react';
import { edgeColor } from './edge-style';
import { useEdgeMotionPreference } from './edge-motion';
import './edge-style.css';

const KEY = [
    ['CALLS', 'Calls'], ['IMPORTS', 'Imports'], ['USAGE', 'Usage'], ['DATA_FLOWS', t("Data flow")],
    ['READS', 'Reads'], ['WRITES', 'Writes'],
    ['HTTP_CALLS', 'HTTP'], ['ASYNC_CALLS', 'Async'], ['INHERITS', 'Inheritance'], ['IMPLEMENTS', 'Implementation'],
    ['CONTAINS', 'Containment'], ['DEFINES', 'Definitions'], ['CONFIGURES', 'Configuration'], ['RAISES', 'Errors'],
    ['CALL_REFERENCE', t("Call references")], ['TESTS', 'Tests'],
    ['SIMILAR_TO', 'Similarity'], ['RELATIONSHIPS', 'Mixed / unknown'],
];

export default function GraphEdgeControls() {
    const { enabled, reduced, setEnabled } = useEdgeMotionPreference();
    const details = useRef<HTMLDetailsElement>(null);
    useEffect(() => {
        const close = (event: PointerEvent) => {
            if (details.current?.open && !details.current.contains(event.target as Node)) details.current.open = false;
        };
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    }, []);
    return <details ref={details} className="graph-edge-controls" onKeyDown={event => {
        if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); }
    }}>
        <summary title={t("3D graph edge colors and motion")}>{t("Edges")}</summary>
        <div className="graph-edge-settings" role="group" aria-label={t("3D edge appearance")}>
            <label><input type="checkbox" checked={enabled && !reduced} disabled={reduced} onChange={event => setEnabled(event.target.checked)} />{t("Direction pulse")}</label>
            <p>{reduced ? t("Motion is paused by your reduced-motion setting.") : t("A subtle pulse shows relationship direction across all 3D graphs.")}</p>
            <ul className="graph-edge-key" aria-label={t("Edge color key")}>{KEY.map(([type, label]) => <li key={type} title={type}><i style={{ backgroundColor: edgeColor(type) }} />{label}</li>)}</ul>
        </div>
    </details>;
}
