import { t, tr } from '../i18n/translate';
import type { CoverageReading } from '../app/coverage-source';
import type { CoverageIndex, CoveragePathAnswer, CoverageRecord } from '../app/tree-model';

export type DiagnosticCategory = 'partial' | 'excluded' | 'unsupported' | 'skipped' | 'unknown';
export const DIAGNOSTIC_LABELS: Record<DiagnosticCategory, string> = {
    partial: t("Partial parse"), excluded: t("Excluded by index rules"), unsupported: t("Unsupported language"),
    skipped: t("Indexing skipped"), unknown: t("Unclassified coverage record"),
};

/** Display the existing coverage join; only a specific recorded reason identifies unsupported input. */
export function diagnosticCategory(record: CoverageRecord): DiagnosticCategory {
    if (record.state === 'partial') return 'partial';
    if (record.state === 'ignored' || record.state === 'not-indexed') return 'excluded';
    // cbm.c emits this exact error; don't guess support from a file extension.
    if (record.state === 'skipped' && /^unsupported language(?:\s*\/|$)/.test(record.reason)) return 'unsupported';
    return record.state === 'skipped' ? 'skipped' : 'unknown';
}

export function diagnosticAction(record: CoverageRecord): string {
    const category = diagnosticCategory(record);
    if (category === 'partial') return t("Read the reported source ranges; verify missing symbols before relying on graph paths.");
    if (category === 'excluded') return t("Review the recorded exclusion rule; open the source directly or adjust that rule before reindexing.");
    if (category === 'unsupported') return t("Read this file directly; check parser support before requesting another index run.");
    if (category === 'skipped') return t("Inspect the recorded reason and source; correct the cause before reindexing.");
    return t("Inspect the existing coverage evidence; completeness cannot be inferred from this record.");
}

export function diagnosticRecords(index: CoverageIndex | null | undefined): CoverageRecord[] {
    const priority: Record<DiagnosticCategory, number> = { partial: 0, skipped: 1, unsupported: 2, unknown: 3, excluded: 4 };
    return [...(index?.records.values() ?? [])].sort((a, b) => priority[diagnosticCategory(a)] - priority[diagnosticCategory(b)] || a.path.localeCompare(b.path));
}

export function freshnessText(freshness: string): string {
    if (freshness === 'metadata_match') return t("File size and modification time match the index record. This is not a content-hash guarantee.");
    if (freshness === 'metadata_changed') return t("File size or modification time changed since indexing. Read the current source and reindex.");
    if (freshness === 'not_tracked') return t("No indexed file metadata exists for this path. It may be unindexed; pending work is not confirmed.");
    if (freshness === 'missing') return t("The requested file is missing on disk.");
    if (freshness === 'outside_project') return t("This path is outside the selected project.");
    return t("Freshness is unavailable. Missing evidence is not a clean result.");
}

export interface LocalDiagnosis {
    project: string;
    requestedPath?: string;
    checkedAt: string;
    reading: CoverageReading;
    pathAnswer?: CoveragePathAnswer;
}

/** A bounded, deterministic draft produced only after a user's local diagnosis action. */
export function localDiagnosticReport(diagnosis: LocalDiagnosis): string {
    const { reading, pathAnswer } = diagnosis;
    const records = diagnosticRecords(reading.index);
    const metadata = reading.answer.metadata;
    const lines = [
        t("# Local index diagnosis: review before sharing"), '',
        tr`Project: ${diagnosis.project}`, tr`Checked locally: ${diagnosis.checkedAt}`,
        tr`Index generation: ${metadata.generation || t("unavailable")}`,
        tr`Coverage recorded at: ${metadata.recordedAt || t("unavailable")}`,
        tr`Recording status: ${metadata.recordingStatus || t("unavailable")}`,
        tr`Coverage generation matches index: ${metadata.generationMatches ? t("yes") : t("not confirmed")}`,
        t("Evidence: existing index_status + check_index_coverage. No source text or daemon log is attached."),
        t("This is a best-effort record, not a repository-wide coverage percentage."),
        t("Paths and reasons below may be sensitive. Edit this draft before sharing it."), '',
    ];
    if (diagnosis.requestedPath) {
        lines.push(tr`Selected path: ${diagnosis.requestedPath}`);
        lines.push(pathAnswer ? tr`Path status: ${pathAnswer.status || t("unavailable")}; freshness: ${pathAnswer.freshness || t("unavailable")}` : t("The daemon returned no evidence for the selected path."));
        if (pathAnswer) {
            lines.push(freshnessText(pathAnswer.freshness), tr`Reported next action: ${pathAnswer.recommendedAction || t("unavailable")}`);
            for (const row of pathAnswer.coverage) lines.push(tr`Path evidence: ${row.path} | ${row.kind} | ${row.detail || t("No detail recorded")}`);
        }
        lines.push('');
    }
    lines.push(tr`Recorded paths: ${records.length} (files and directories; not a file-coverage denominator).`);
    lines.push(tr`Ignored file records stored: ${metadata.ignoredFilesStored}; total reported: ${metadata.ignoredFilesTotal}.`);
    for (const note of reading.index.truncations) lines.push(tr`Incomplete list: ${note}`);
    if (reading.answer.caveat) lines.push(tr`Daemon caveat: ${reading.answer.caveat}`);
    if (!records.length) lines.push(t("No gap records returned. Discovery omissions and unsupported files may be unrecorded."));
    for (const record of records.slice(0, 200)) {
        lines.push('', `- ${record.path} (${record.kind}): ${DIAGNOSTIC_LABELS[diagnosticCategory(record)]}`,
            tr`  Recorded reason: ${record.reason || t("No reason recorded")}`,
            tr`  Evidence source: ${record.sources.join(', ') || t("Not reported")}`,
            tr`  Next check: ${diagnosticAction(record)}`);
    }
    if (records.length > 200) lines.push('', tr`Report limited to 200 of ${records.length} recorded paths.`);
    return lines.join('\n');
}
