import { t, tr } from '../i18n/translate';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import SelectionImpactWidget from './SelectionImpactWidget';
import type { SelectionImpactTarget, fetchSelectionImpact } from './selection-impact';
import { changedAreas, loadChangeSet, loadFileImpactSymbols, localDiffCommand, validChangeRef } from './change-set';
import type { ChangeSetReading, ChangeSymbolSource } from './change-set';
import LocalEvidenceCommand from './LocalEvidenceCommand';
import './change-analysis.css';

export type ChangeAnalysisMode = 'selection' | 'worktree' | 'since-ref';
export interface ChangeAnalysisWorkspaceProps {
    project: string;
    selectedTarget?: SelectionImpactTarget;
    expectedGeneration?: string;
    client?: ChangeSymbolSource;
    onOpenSource: (target: SelectionImpactTarget) => void;
    onDiagnose?: () => void;
    onClose?: () => void;
    initialMode?: ChangeAnalysisMode;
    /** Tests can supply deferred readings without a daemon. */
    loadChanges?: typeof loadChangeSet;
    loadSymbols?: typeof loadFileImpactSymbols;
    loadImpact?: typeof fetchSelectionImpact;
}

/** One shared, full-size flow for a selected declaration and an actual Git change set. */
export default function ChangeAnalysisWorkspace({ project, selectedTarget, expectedGeneration, client,
    onOpenSource, onDiagnose, onClose, initialMode, loadChanges = loadChangeSet, loadSymbols = loadFileImpactSymbols, loadImpact,
}: ChangeAnalysisWorkspaceProps) {
    const [mode, setMode] = useState<ChangeAnalysisMode>(initialMode ?? (selectedTarget?.filePath ? 'selection' : 'worktree'));
    const [ref, setRef] = useState('HEAD');
    const [appliedRef, setAppliedRef] = useState('HEAD');
    const [refresh, setRefresh] = useState(0);
    const [filter, setFilter] = useState('');
    const [chosen, setChosen] = useState<{ owner: string; target: SelectionImpactTarget }>();
    const [reading, setReading] = useState<{ key: string; data?: ChangeSetReading; error?: string; loading: boolean }>();
    const [symbols, setSymbols] = useState<{ key: string; rows: SelectionImpactTarget[]; error?: string }>();
    const workspace = useRef<HTMLElement>(null);
    const selectionIdentity = JSON.stringify([project, selectedTarget?.filePath, selectedTarget?.qualifiedName, selectedTarget?.id]);
    const base = mode === 'worktree' ? 'HEAD' : appliedRef;
    const readingKey = JSON.stringify([project, mode, base, refresh]);
    const ownedReading = reading?.key === readingKey ? reading : undefined;
    const target = chosen?.owner === selectionIdentity ? chosen.target : selectedTarget;
    const symbolKey = JSON.stringify([project, target?.filePath, expectedGeneration]);
    const ownedSymbols = symbols?.key === symbolKey ? symbols : undefined;

    useLayoutEffect(() => {
        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
        (workspace.current?.querySelector<HTMLElement>('button') ?? workspace.current)?.focus();
        return () => { if (previous?.isConnected) previous.focus(); };
    }, []);
    const keyboard = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape' && onClose) { event.preventDefault(); event.stopPropagation(); onClose(); return; }
        if (event.key !== 'Tab' || !workspace.current) return;
        const controls = [...workspace.current.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, summary, [tabindex="0"]')]
            .filter(element => element.getClientRects().length > 0 && !element.closest('[hidden]'));
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last && first) { event.preventDefault(); first.focus(); }
    };

    useEffect(() => {
        setChosen(selectedTarget?.filePath ? { owner: selectionIdentity, target: selectedTarget } : undefined);
        setFilter('');
    }, [selectionIdentity]); // Stable identity, not a new callback-created prop object.
    useEffect(() => {
        if (mode === 'selection' || !project) return;
        const controller = new AbortController();
        setReading({ key: readingKey, loading: true });
        void loadChanges(project, base, controller.signal).then(data => {
            if (!controller.signal.aborted) setReading({ key: readingKey, data, loading: false });
        }, error => {
            if (!controller.signal.aborted) setReading({ key: readingKey, loading: false,
                error: error instanceof Error ? error.message : String(error) });
        });
        return () => controller.abort();
    }, [project, mode, base, refresh, loadChanges, readingKey]);
    useEffect(() => {
        if (!client || !target?.filePath) return;
        let current = true;
        const file = target.filePath;
        void loadSymbols(client, project, file).then(rows => {
            if (current) setSymbols({ key: symbolKey, rows });
        }, error => {
            if (current) setSymbols({ key: symbolKey, rows: [], error: error instanceof Error ? error.message : String(error) });
        });
        return () => { current = false; };
    }, [client, project, target?.filePath, expectedGeneration, symbolKey, loadSymbols]);
    const areas = useMemo(() => changedAreas((ownedReading?.data?.files ?? []).filter(file => file.toLowerCase().includes(filter.toLowerCase())),
        selectedTarget?.filePath), [ownedReading?.data, filter, selectedTarget?.filePath]);
    const select = (next: SelectionImpactTarget) => setChosen({ owner: selectionIdentity, target: next });
    const selectedChanged = ownedReading?.data?.files.includes(target?.filePath ?? '');

    return <section ref={workspace} tabIndex={-1} onKeyDown={keyboard} className="change-analysis" data-testid="change-analysis-workspace" aria-label={t("Change impact workspace")}>
        <header className="change-analysis-header"><h2>{t("Change impact")}</h2>
            {onClose && <button type="button" onClick={onClose}>{t("Close change impact")}</button>}</header>
        <div className="change-analysis-toolbar">
            <div role="tablist" aria-label={t("Change analysis scope")}>{([
                ['selection', t("Current selection")], ['worktree', t("Working tree")], ['since-ref', t("Since ref")],
            ] as const).map(([value, label]) => <button role="tab" type="button" key={value} aria-selected={mode === value}
                onClick={() => setMode(value)}>{label}</button>)}</div>
            {mode === 'since-ref' && <form onSubmit={event => { event.preventDefault(); if (validChangeRef(ref)) { setAppliedRef(ref); setRefresh(value => value + 1); } }}>
                <label>{t("Baseline revision ")}<input value={ref} onChange={event => setRef(event.currentTarget.value)} placeholder={t("HEAD~1 or branch name")} /></label>
                <button type="submit" disabled={!validChangeRef(ref)}>{t("Read changes")}</button></form>}
            {mode !== 'selection' && <button type="button" onClick={() => setRefresh(value => value + 1)} disabled={ownedReading?.loading}>{t("Refresh changes")}</button>}
            <span>{project || t("No project selected")}</span>
        </div>
        <div className="change-analysis-columns" data-has-changes={mode !== 'selection'}>
            {mode !== 'selection' && <aside className="change-analysis-files" aria-label={t("Changed files")}>
                <h3>{mode === 'worktree' ? t("Uncommitted changes") : tr`Changes since ${appliedRef}`}</h3>
                <p>{mode === 'worktree' ? t("Compared explicitly with HEAD; staged, unstaged and untracked paths are included.")
                    : t("The daemon compares the merge base with HEAD and includes current worktree changes.")}</p>
                {(!ownedReading || ownedReading.loading) && <p role="status">{t("Reading the local Git change set…")}</p>}
                {ownedReading?.error && <p role="alert">{t("Change set unavailable: ")}{ownedReading.error}{t(" No low-risk result was inferred.")}</p>}
                {ownedReading?.data && <>
                    <p><strong>{ownedReading.data.files.length}{t(" of ")}{ownedReading.data.totalFiles}{t(" changed paths loaded")}</strong></p>
                    <details><summary>{t("Change-set revision and limits")}</summary><p>{t("Baseline ")}{ownedReading.data.base}{t(" · merge base ")}<code>{ownedReading.data.mergeBase}</code><br />{t("Read ")}{ownedReading.data.checkedAt}</p>
                        <p>{t("Changes may continue while this view is open. Refresh before relying on the scope. File-level selection analyzes all indexed declarations, not only edited lines.")}</p>
                        {ownedReading.data.limitations.map(note => <p key={note}>{note}</p>)}</details>
                    {!ownedReading.data.complete && <p role="alert">{t("The changed-file listing is incomplete. Missing files are not evidence of safety.")}</p>}
                    {ownedReading.data.totalFiles === 0 && <p>{t("No changed paths were reported for this revision. Select a file from the repository to inspect its dependencies.")}</p>}
                    <label className="change-analysis-filter">{t("Filter changed paths")}<input type="search" value={filter} onChange={event => setFilter(event.currentTarget.value)} /></label>
                    <p className="change-analysis-note">{t("Areas are grouped by path and ordered by changed-file count, with the current selection first. These counts measure scope, not risk.")}</p>
                    {areas.map(area => <details className="change-analysis-area" key={area.path} open={areas.length <= 3 || area.files.includes(selectedTarget?.filePath ?? '')}>
                        <summary>{area.path} · {area.files.length}{t(" changed paths")}</summary>
                        {area.files.map(file => <button type="button" key={file} aria-pressed={target?.filePath === file}
                            onClick={() => select({ filePath: file, name: file.split('/').at(-1) })}>{file}</button>)}
                    </details>)}
                    {areas.length === 0 && ownedReading.data.totalFiles > 0 && <p>{t("No changed path matches this filter.")}</p>}
                </>}
            </aside>}
            <main className="change-analysis-evidence">
                <div className="change-analysis-selection">
                    {selectedTarget?.filePath && <button type="button" onClick={() => select(selectedTarget)}>{t("Use current editor selection")}</button>}
                    {target?.filePath ? <>
                        <strong>{target.filePath}</strong>
                        <label>{t("Analysis scope ")}<select aria-label={t("Analysis scope")} value={target.qualifiedName ?? ''} onChange={event => {
                            const next = ownedSymbols?.rows.find(row => row.qualifiedName === event.currentTarget.value);
                            select(next ?? { filePath: target.filePath, name: target.filePath.split('/').at(-1) });
                        }}><option value="">{t("Entire indexed file")}</option>
                            {target.qualifiedName && !ownedSymbols?.rows.some(row => row.qualifiedName === target.qualifiedName)
                                && <option value={target.qualifiedName}>{target.name ?? target.qualifiedName}</option>}
                            {ownedSymbols?.rows.map(row => <option key={row.qualifiedName} value={row.qualifiedName}>{row.name}{t(" · line ")}{row.line ?? '?'}</option>)}
                        </select></label>
                        <button type="button" onClick={() => onOpenSource(target)}>{t("Open source evidence")}</button>
                        {client && !ownedSymbols && <small role="status">{t("Reading indexed function and method choices…")}</small>}
                        {mode !== 'selection' && ownedReading?.data && <>
                            <span>{selectedChanged ? t("This file is in the detected change set.") : t("This selection is outside the loaded changed-file list.")}</span>
                            <small>{target.qualifiedName ? t("This symbol was selected manually; edited lines are not automatically mapped to declarations.")
                                : t("Whole-file impact includes unchanged declarations. Select a function or method to refine the graph scope.")}</small>
                            <details className="change-analysis-diff"><summary>{t("Inspect this file’s local diff")}</summary>
                                <LocalEvidenceCommand command={localDiffCommand(ownedReading.data.mergeBase, target.filePath)} label={t("Copy local diff command")} />
                                <small>{t("Git diff shows tracked changes. For an untracked path, inspect its source and Git status.")}</small></details>
                        </>}
                        {ownedSymbols?.error && <p role="alert">{t("Symbol choices unavailable: ")}{ownedSymbols.error}{t(". Whole-file analysis remains available.")}</p>}
                        {ownedSymbols && ownedSymbols.rows.length >= 200 && <small>{t("Symbol choices are bounded to the first 200 functions and 200 methods.")}</small>}
                    </> : <p>{t("Select a changed file or open a repository file to start the analysis.")}</p>}
                </div>
                <SelectionImpactWidget project={project} target={target} expectedGeneration={expectedGeneration}
                    onOpen={onOpenSource} onDiagnose={onDiagnose} load={loadImpact} compact />
            </main>
        </div>
    </section>;
}
