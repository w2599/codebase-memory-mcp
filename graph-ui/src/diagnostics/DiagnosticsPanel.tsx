import { t } from '../i18n/translate';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { loadCoverage, loadPathCoverage, type CoverageReading } from '../app/coverage-source';
import type { CoverageIndex } from '../app/tree-model';
import type { RpcIntelligenceClient } from '../provider/rpc-client';
import { DIAGNOSTIC_LABELS, diagnosticAction, diagnosticCategory, diagnosticRecords, freshnessText, localDiagnosticReport, type LocalDiagnosis } from './diagnostics-model';
import './diagnostics.css';

export interface DiagnosticsPanelProps {
    project: string;
    client: RpcIntelligenceClient;
    coverage?: CoverageIndex | null;
    coverageError?: string | null;
    active: boolean;
    path?: string;
    indexDetails?: ReactNode;
    onNavigate: (path: string) => void;
    /** App can update its shared coverage reading from the same diagnosis. */
    onCoverage?: (reading: CoverageReading) => void;
}

export default function DiagnosticsPanel({ project, client, coverage, coverageError, active, path, indexDetails, onNavigate, onCoverage }: DiagnosticsPanelProps) {
    const [diagnosis, setDiagnosis] = useState<LocalDiagnosis | null>(null);
    const [report, setReport] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [recordLimit, setRecordLimit] = useState(100);
    const request = useRef(0);
    useEffect(() => {
        request.current += 1;
        setDiagnosis(null); setReport(''); setBusy(false); setError(null); setStatus(''); setRecordLimit(100);
        return () => { request.current += 1; };
    }, [project, path, active]);
    const index = diagnosis?.reading.index ?? coverage;
    const records = useMemo(() => diagnosticRecords(index), [index]);
    const run = async () => {
        const ticket = ++request.current;
        setBusy(true); setError(null); setStatus('');
        try {
            const reading = await loadCoverage(client, project);
            if (ticket !== request.current) return;
            const pathAnswer = path ? await loadPathCoverage(client, project, path) : undefined;
            if (ticket !== request.current) return;
            const result: LocalDiagnosis = { project, requestedPath: path, checkedAt: new Date().toISOString(), reading, pathAnswer };
            setDiagnosis(result); setReport(localDiagnosticReport(result)); onCoverage?.(reading);
        } catch (reason) {
            if (ticket === request.current) setError(reason instanceof Error ? reason.message : String(reason));
        } finally {
            if (ticket === request.current) setBusy(false);
        }
    };
    const copy = async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error(t("Clipboard unavailable; select the draft and copy it manually."));
            await navigator.clipboard.writeText(report); setStatus(t("Edited report copied locally. Nothing was sent."));
        } catch (reason) { setStatus(reason instanceof Error ? reason.message : String(reason)); }
    };
    const download = () => {
        const url = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }));
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'local-index-diagnosis.txt';
        anchor.click(); URL.revokeObjectURL(url); setStatus(t("Edited report downloaded locally. Nothing was sent."));
    };
    if (!active) return null;
    return <section className="diagnostics-panel" aria-label={t("Coverage")} data-testid="diagnostics-panel">
        <header><div><p className="diagnostics-eyebrow">{project}</p><h2>{t("Coverage")}</h2>{path && <p>{t("Selected ")}<code>{path}</code></p>}</div></header>
        <p>{t("The map can omit excluded files, unsupported inputs and failed or partial parses. Inspect the recorded reasons before relying on missing graph relationships.")}</p>
        {(error || coverageError) && <p role="alert" className="diagnostics-error">{t("Coverage reading failed: ")}{error || coverageError}. {index ? t("Previous records remain visible; this is not a fresh reading.") : t("Completeness is unknown.")}</p>}
        <div className="diagnostics-actions"><button type="button" disabled={busy || !project} onClick={() => { void run(); }}>{busy ? t("Reading local diagnosis…") : t("Run local diagnosis")}</button><span>{t("Reads existing coverage metadata through this daemon. No agent, upload or issue creation.")}</span></div>
        {!index && <p>{t("Coverage evidence has not been loaded. Run a local diagnosis to inspect the index records.")}</p>}
        {index && <>
            <div className="diagnostics-counts">{(['partial', 'excluded', 'unsupported', 'skipped', 'unknown'] as const).map((category) => <span key={category}>{DIAGNOSTIC_LABELS[category]}: <strong>{records.filter((record) => diagnosticCategory(record) === category).length}</strong></span>)}</div>
            <p className="diagnostics-caveat">{t("Counts describe returned path records, including directories. They do not measure all repository files. Unsupported inputs and files never discovered may be absent from these records.")}</p>
            <p className="diagnostics-caveat">{t("Partial parses mark source ranges the index parser could not interpret reliably. Grammar or preprocessor limitations and malformed source can cause this; a partial parse alone does not establish a build or runtime failure. Exclusions follow indexing rules.")}</p>
            {index.listingComplete && <p className="diagnostics-caveat">{t("All recorded coverage entries have been loaded. The parser limitations and exclusions listed below still apply.")}</p>}
            {index.truncations.map((note) => <p key={note} className="diagnostics-caveat">{t("Incomplete list: ")}{note}</p>)}
        </>}
        {indexDetails && <details className="diagnostics-inventory"><summary>{t("Index inventory and legend")}</summary>{indexDetails}</details>}
        {diagnosis && <div className="diagnostics-reading"><p>{t("Checked ")}{diagnosis.checkedAt}{t(" · Index generation ")}<code>{diagnosis.reading.answer.metadata.generation || t("unavailable")}</code>{t(" · Recording ")}{diagnosis.reading.answer.metadata.recordingStatus || t("unavailable")}</p>
            {!diagnosis.reading.answer.metadata.generationMatches && <p className="diagnostics-error">{t("Coverage generation does not confirm the current index. Treat the map as potentially stale.")}</p>}
            {path && <p>{diagnosis.pathAnswer ? freshnessText(diagnosis.pathAnswer.freshness) : t("No path-specific evidence returned. Freshness is unknown.")}</p>}
            {diagnosis.pathAnswer?.coverage.map((row, i) => <p key={`${row.path}:${i}`}><code>{row.path}</code> · {row.kind} · {row.detail || t("No detail recorded")}</p>)}
            {diagnosis.reading.answer.caveat && <p className="diagnostics-caveat">{diagnosis.reading.answer.caveat}</p>}
        </div>}
        {records.length > 0 && <details><summary>{t("Recorded paths · ")}{records.length}</summary>
            <ol className="diagnostics-records">{records.slice(0, recordLimit).map((record) => <li key={record.path} className={`diagnostics-record-${diagnosticCategory(record)}`}>
                <div><strong>{DIAGNOSTIC_LABELS[diagnosticCategory(record)]}</strong> · {record.kind} <button type="button" onClick={() => onNavigate(record.path)}><code>{record.path}</code></button></div>
                <p><strong>{t("Recorded reason:")}</strong> {record.reason || t("No reason recorded")}</p>
                <p><strong>{t("Evidence:")}</strong> {record.sources.join(', ') || t("Source not reported")}</p>
                <p>{diagnosticAction(record)}</p>
            </li>)}</ol><p className="diagnostics-caveat">{t("Showing ")}{Math.min(recordLimit, records.length)}{t(" of ")}{records.length}{t(" records.")}</p>
            {recordLimit < records.length && <button type="button" onClick={() => setRecordLimit(limit => limit + 100)}>{t("Show more paths")}</button>}</details>}
        {index && records.length === 0 && <p>{t("No gap records returned. This does not prove complete indexing; undiscovered or unsupported files may be unrecorded.")}</p>}
        {diagnosis && <section aria-label={t("Local diagnostic report")}><h3>{t("Review the local report")}</h3><p>{t("This draft contains paths and recorded reasons. Edit it before sharing. Copy and download stay local; publication would require a separate, explicit action outside this panel.")}</p>
            <textarea aria-label={t("Editable local diagnostic report")} value={report} onChange={(event) => setReport(event.currentTarget.value)} spellCheck={false} />
            <div className="diagnostics-actions"><button type="button" onClick={() => { void copy(); }}>{t("Copy edited report")}</button><button type="button" onClick={download}>{t("Download edited report")}</button><span role="status">{status}</span></div>
        </section>}
    </section>;
}
