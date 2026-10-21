import { t, tr } from '../i18n/translate';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { AtlasApi } from '../app/atlas-api';
import type { ProjectEntry } from '../provider/rpc-schemas';
import IndexesPanel, { type IndexesApi } from './IndexesPanel';
import { collapseRepeats, cpuText, logLevel, memoryLabel, memoryText, repeatTitle } from './system-model';
import { useSystemPoll, type SystemReading } from './useSystemPoll';
import './system.css';

export interface SystemWorkspaceProps {
    api: Pick<AtlasApi, 'processes' | 'logs' | 'indexJobs'> & IndexesApi;
    onOpenProjects: () => void;
    active?: boolean;
    version?: string;
    pollMs?: number;
    project?: string;
    configuration?: ReactNode | ((active: boolean) => ReactNode);
    listProjects?: () => Promise<ProjectEntry[]>;
}

type SystemTab = 'overview' | 'configuration' | 'indexes' | 'logs';
const TABS: SystemTab[] = ['overview', 'configuration', 'indexes', 'logs'];
const TAB_LABELS: Record<SystemTab, string> = { overview: 'Overview', configuration: 'Configuration', indexes: 'Indexes', logs: 'Logs' };

function ReadStatus({ reading, paused }: { reading: SystemReading<unknown>; paused: boolean }) {
    return <div className="system-read-status">
        <span className={reading.error ? 'system-warning' : ''}>
            {reading.error ? reading.data ? t("Update failed · showing last reading") : t("Update failed") : paused ? t("Live updates paused") : reading.loading ? t("Updating…") : t("Live updates on")}
        </span>
        <span>{reading.updatedAt === null ? t("No reading yet") : <>{t("Updated ")}<time dateTime={new Date(reading.updatedAt).toISOString()}>{new Date(reading.updatedAt).toLocaleTimeString()}</time></>}</span>
        {reading.error && <p role="alert">{reading.error}</p>}
    </div>;
}

/** Daemon readings and configuration; project indexing uses the existing dialog. */
export default function SystemWorkspace({ api, onOpenProjects, active = true, version, pollMs = 3000, project, configuration, listProjects }: SystemWorkspaceProps) {
    const [tab, setTab] = useState<SystemTab>('overview');
    const [paused, setPaused] = useState(false);
    const [level, setLevel] = useState<'all' | 'error' | 'warn' | 'info'>('all');
    const [scope, setScope] = useState<'daemon' | 'project' | 'unattributed'>('daemon');
    const [copyStatus, setCopyStatus] = useState('');
    const [followTail, setFollowTail] = useState(true);
    const [indexesRefresh, setIndexesRefresh] = useState(0);
    const logRef = useRef<HTMLDivElement>(null);
    const readProcesses = useCallback(() => api.processes(), [api]);
    const selectedProject = scope === 'project' ? project : undefined;
    const readLogs = useCallback(async () => {
        if (scope === 'project' && !selectedProject) throw new Error(t("Select a project to read its attributed events."));
        const data = await api.logs(200, level === 'all' ? undefined : level, selectedProject, {
            ...(scope === 'unattributed' ? { scope: 'unattributed' as const } : {}),
        });
        if ((scope !== 'daemon' || level !== 'all') && data.persistent !== true) throw new Error(t("Persistent history is unavailable. Filters require the daemon journal."));
        if (scope === 'project' && (data.scope !== 'project' || data.project !== selectedProject)) throw new Error(t("The daemon did not confirm this project scope."));
        if (scope === 'unattributed' && data.scope !== 'unattributed') throw new Error(t("The daemon did not confirm unattributed scope."));
        return data;
    }, [api, level, selectedProject, scope]);
    const readJobs = useCallback(() => api.indexJobs(), [api]);
    const processes = useSystemPoll(readProcesses, active, paused, pollMs);
    const logs = useSystemPoll(readLogs, active && tab === 'logs', paused, pollMs);
    const jobs = useSystemPoll(readJobs, active && tab === 'indexes', paused, pollMs);
    const report = processes.data;
    const self = report?.processes.find((process) => process.isSelf);
    const visibleLines = logs.data?.lines ?? [];
    const visibleRecords = logs.data?.records;
    // Identical messages read as one line with a count; a repeated warning cannot push the rest out of view.
    const logRows = useMemo(() => visibleRecords ? collapseRepeats(visibleRecords) : undefined, [visibleRecords]);
    const selectedReading = tab === 'logs' ? logs : tab === 'indexes' ? jobs : processes;

    useEffect(() => {
        if (followTail && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs.data, followTail, tab]);
    useEffect(() => { setCopyStatus(''); }, [level, logs.data]);

    const copyLogs = async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error(t("Clipboard access is unavailable. Select and copy the visible text."));
            await navigator.clipboard.writeText(logRows ? logRows.map(({ record, count }) => `${record.ts} ${record.level.toUpperCase()} ${record.source} #${record.id}${count > 1 ? ` ×${count}` : ''}\n${record.message}`).join('\n') : visibleLines.join('\n'));
            setCopyStatus(t("Visible lines copied"));
        } catch (error) {
            setCopyStatus(error instanceof Error ? error.message : t("Could not copy the log."));
        }
    };
    const moveTab = (event: KeyboardEvent<HTMLButtonElement>, current: SystemTab) => {
        const index = TABS.indexOf(current);
        const target = event.key === 'ArrowDown' ? TABS[(index + 1) % TABS.length]
            : event.key === 'ArrowUp' ? TABS[(index + TABS.length - 1) % TABS.length]
            : event.key === 'Home' ? TABS[0] : event.key === 'End' ? TABS[TABS.length - 1] : undefined;
        if (!target) return;
        event.preventDefault();
        setTab(target);
        document.getElementById(`system-tab-${target}`)?.focus();
    };

    return <section className="system-workspace" aria-label={t("System")} hidden={!active} data-testid="system-workspace">
        <header className="system-heading">
            <div><p className="system-eyebrow">{t("DAEMON")}</p><h1>{t("System")}</h1><p>{t("Configuration, processes, indexes, and events.")}</p></div>
            <div className="system-heading-actions">
                {version && <span className="system-version">{version}</span>}
                {tab !== 'configuration' && <>
                    <button type="button" onClick={() => { selectedReading.refresh(); if (tab === 'indexes') setIndexesRefresh(value => value + 1); }} disabled={selectedReading.loading}>{t("Refresh")}</button>
                    <button type="button" aria-label={paused ? t("Resume live updates") : t("Pause live updates")} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? t("Resume live") : t("Pause live")}</button>
                </>}
            </div>
        </header>
        <div className="system-layout">
        <div className="system-tabs" role="tablist" aria-label={t("System views")} aria-orientation="vertical">
            {TABS.map((name) => <button key={name} id={`system-tab-${name}`} type="button" role="tab" aria-selected={tab === name} aria-controls={`system-panel-${name}`} tabIndex={tab === name ? 0 : -1} onKeyDown={(event) => moveTab(event, name)} onClick={() => setTab(name)}>{t(TAB_LABELS[name])}</button>)}
        </div>
        <div className="system-view">
        {tab !== 'configuration' && tab !== 'indexes' && <ReadStatus reading={selectedReading} paused={paused} />}

        <div id="system-panel-overview" role="tabpanel" aria-labelledby="system-tab-overview" hidden={tab !== 'overview'}>
            <div className="system-metrics">
                <article><span>{t("Serving process")}</span><strong>{report && report.selfPid > 0 ? tr`PID ${report.selfPid}` : t("Unavailable")}</strong><small>{self?.elapsed ? tr`Running ${self.elapsed}` : t("Uptime unavailable")}</small></article>
                <article><span>{memoryLabel(report?.telemetry?.selfMemoryKind)}</span><strong>{memoryText(report?.telemetry?.selfMemoryMb)}</strong><small>{t("Serving daemon")}</small></article>
                <article><span>{report?.telemetry?.cpuUnit === 'seconds' ? t("CPU time") : t("CPU")}</span><strong>{cpuText(self?.telemetry?.cpu, report?.telemetry?.cpuUnit)}</strong><small>{report?.telemetry?.cpuUnit === 'seconds' ? t("Cumulative process time") : report?.telemetry?.cpuUnit === 'percent' ? t("Reported by the host process monitor") : t("Server did not specify a unit")}</small></article>
                <article><span>{t("Processes listed")}</span><strong>{report ? report.processes.length : t("Unavailable")}</strong><small>{t("Visible to the serving daemon")}</small></article>
            </div>
            <section className="system-section" aria-label={t("Daemon processes")}>
                <div className="system-section-heading"><h2>{t("Processes")}</h2><span>{memoryLabel(report?.telemetry?.memoryKind)}{t(" · MiB")}</span></div>
                <div className="system-table-wrap"><table><thead><tr><th>{t("Process")}</th><th>{t("CPU")}</th><th>{t("Memory")}</th><th>{t("Uptime")}</th><th>{t("Command")}</th></tr></thead><tbody>
                    {report?.processes.map((process, index) => <tr key={`${process.pid}-${index}`}>
                        <th scope="row">{process.pid > 0 ? process.pid : t("Unavailable")} {process.isSelf && <span className="system-tag">{t("Serving")}</span>}</th>
                        <td>{cpuText(process.telemetry?.cpu, report.telemetry?.cpuUnit)}</td><td>{memoryText(process.telemetry?.memoryMb)}</td><td>{process.elapsed || t("Unavailable")}</td><td><code>{process.command || t("Unavailable")}</code></td>
                    </tr>)}
                </tbody></table></div>
                {!report && <p className="system-empty">{processes.loading ? t("Reading processes…") : t("No process reading available.")}</p>}
                {report?.processes.length === 0 && <p className="system-empty">{t("The server returned no process entries.")}</p>}
            </section>
        </div>

        <div id="system-panel-configuration" role="tabpanel" aria-labelledby="system-tab-configuration" hidden={tab !== 'configuration'}>
            {(typeof configuration === 'function' ? configuration(active && tab === 'configuration') : configuration) ?? <p className="system-empty">{t("Configuration is unavailable.")}</p>}
        </div>

        <div id="system-panel-indexes" role="tabpanel" aria-labelledby="system-tab-indexes" hidden={tab !== 'indexes'}>
            <IndexesPanel api={api} listProjects={listProjects} active={active && tab === 'indexes'} paused={paused} refreshToken={indexesRefresh} onOpenProjects={onOpenProjects} />
            <details className="system-index-activity">
                <summary>{t("Recent indexing activity")}{jobs.data ? tr` · ${jobs.data.length} job slots` : ''}</summary><p className="system-muted">{t("Current daemon job slots. Slots may be reused; this is not a complete history.")}</p>
                <div className="system-table-wrap"><table><thead><tr><th>{t("Repository")}</th><th>{t("State")}</th><th>{t("Details")}</th></tr></thead><tbody>
                    {jobs.data?.map((job, index) => <tr key={`${job.slot}-${index}`}><th scope="row"><code>{job.path || t("Path unavailable")}</code></th><td><span className={`system-job-state system-job-${job.status}`}>{job.status === 'indexing' ? t("Indexing") : job.status === 'done' ? t("Complete") : job.status === 'error' ? t("Failed") : t("Unknown")}</span></td><td>{job.error || t("No details reported")}</td></tr>)}
                </tbody></table></div>
                {jobs.data?.length === 0 && <p className="system-empty">{t("No index activity reported by this daemon.")}</p>}
                {!jobs.data && <p className="system-empty">{jobs.loading ? t("Reading index activity…") : t("No index reading available.")}</p>}
                {jobs.error && <p className="system-warning" role="alert">{t("Could not update job activity: ")}{jobs.error}</p>}
            </details>
        </div>

        <div id="system-panel-logs" role="tabpanel" aria-labelledby="system-tab-logs" hidden={tab !== 'logs'}>
            <section className="system-section">
                <div className="system-section-heading"><div><h2>{t("Errors and logs")}</h2><p>{report && report.selfPid > 0 ? tr`Serving process ${report.selfPid}` : t("Serving daemon")}{t(" · Latest 200 matching events")}</p></div><button type="button" disabled={(visibleRecords?.length ?? visibleLines.length) === 0} onClick={() => { void copyLogs(); }}>{t("Copy visible")}</button></div>
                {logs.data && <p className="system-muted">{logs.data.persistent === true ? tr`SQLite history · ${logs.data.retentionLimit ?? t("bounded")} event retention limit · survives daemon restarts` : t("Persistent history unavailable; this tail may not survive a restart.")}{t(" Events identify affected paths or jobs only when the daemon recorded them.")}</p>}
                <div className="system-log-controls">
                    <label><span>{t("Scope")}</span><select aria-label={t("Log scope")} value={scope} onChange={(event) => setScope(event.currentTarget.value as typeof scope)}>
                        <option value="daemon">{t("All daemon projects")}</option>
                        <option value="project" disabled={!project}>{t("Current project")}{project ? ` · ${project}` : t(" · none selected")}</option>
                        <option value="unattributed">{t("Unattributed events")}</option>
                    </select></label>
                    <label><span>{t("Severity")}</span><select aria-label={t("Log severity")} value={level} onChange={(event) => setLevel(event.currentTarget.value as typeof level)}>
                        <option value="all">{t("All levels")}</option><option value="info">{t("Info and above")}</option>
                        <option value="warn">{t("Warnings and errors")}</option><option value="error">{t("Errors")}</option>
                    </select></label>
                    <label className="system-tail-toggle"><input type="checkbox" checked={followTail} onChange={(event) => setFollowTail(event.currentTarget.checked)} />{t(" Follow tail")}</label>
                </div>
                <p className="system-muted">{t("Scope, severity and search filter the retained SQLite history before the 200-event display limit. ")}{scope === 'project' ? tr`Only explicitly attributed events for ${project ?? t("the selected project")}.` : scope === 'unattributed' ? t("Project ownership was not recorded; no project is inferred from a path.") : t("Includes all projects and events with unknown ownership.")}</p>
                <div className="system-log-meta"><span>{visibleRecords?.length ?? visibleLines.length}{t(" shown · ")}{logs.data?.total ?? t("Unknown")}{t(" matching retained events")}</span><span role="status">{copyStatus}</span></div>
                <div className="system-log" aria-label={t("Daemon log lines")} tabIndex={0} ref={logRef} onScroll={() => {
                    const element = logRef.current;
                    if (element && element.scrollHeight - element.scrollTop - element.clientHeight > 32) setFollowTail(false);
                }}>
                    {logRows ? logRows.map((row) => { const { record } = row; return <div className={`system-log-line system-log-record system-log-${logLevel(`level=${record.level}`)}`} key={`${logs.data?.generation ?? ''}:${record.id}`}><strong>{record.level.toUpperCase() || t("UNCLASSIFIED")}</strong> · <time dateTime={record.ts}>{record.ts || t("Time unavailable")}</time> · {record.source || t("Source unavailable")}{t(" · Event #")}{record.id} · {record.project ? tr`Project: ${record.project}` : t("Project not recorded")}{row.count > 1 && <> · <span className="system-log-repeat" title={repeatTitle(row)}>×{row.count}</span></>}<pre>{record.message}</pre></div>; }) : visibleLines.map((line, index) => <div className={`system-log-line system-log-${logLevel(line)}`} key={index}>{line || '\u00a0'}</div>)}
                    {(visibleRecords?.length ?? visibleLines.length) === 0 && <p>{logs.loading ? t("Reading log…") : !logs.data ? t("No log reading available.") : t("No retained events match these filters.")}</p>}
                </div>
            </section>
        </div>
        </div>
        </div>
    </section>;
}
