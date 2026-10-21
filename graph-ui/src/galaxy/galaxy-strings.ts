import { formatCount } from '../i18n/count';
import { kindLabel } from '../i18n/presentation';
import { t, tr } from '../i18n/translate';
import type { ExpandOutlook } from './graph-scope';

/**
 * The words of the Galaxy path view, beside the view like the other domain
 * copy (agents/agent-strings.ts, architecture/strings.ts).
 *
 * One rule for every sentence here: a path is counted in hops over the
 * relationships that are loaded in this scope, nothing more. It is not a
 * runtime trace and it does not claim that nothing else connects the two.
 */
export const galaxyPathText = {
    pathTo: t("Path to…"),
    pathToTitle: t("Highlight the shortest path from the root to a node in this scope"),
    pathSearch: t("Find a path target"),
    pathSearchPlaceholder: t("Node in this scope…"),
    pathNoMatch: t("No matching node in the loaded scope."),
    pathMore: (count: number) => tr`${count.toLocaleString()} more, type to narrow`,
    callOrder: t("Call order"),
    /** The short labels of a narrow toolbar (review of K3). */
    pathToNarrow: t("Path…"),
    callOrderNarrow: t("Calls"),
    callOrderTitle: t("Step through the outgoing calls of the root in source line order"),
    callOrderUnavailable: t("The root has no outgoing calls in the loaded scope"),
    panel: t("Path steps"),
    pathHeading: (target: string, hops: number) => tr`Path to ${target} · ${hops === 1 ? t("1 hop") : tr`${hops} hops`}`,
    callsHeading: (root: string, calls: number) => tr`Calls of ${root} · ${calls === 1 ? t("1 call") : tr`${calls} calls`}`,
    noPath: (target: string) => tr`No path to ${target} over the loaded relationships in this trace direction. Expand the scope or trace both directions.`,
    isRoot: (target: string) => tr`${target} is the root of this scope.`,
    hop: (hop: number) => tr`hop ${hop}`,
    line: (line: number) => tr`line ${line}`,
    lineUnknown: t("no line"),
    /** The hop as the reader follows it, with the indexed direction kept. */
    step: (from: string, type: string, to: string, forward: boolean) =>
        (forward ? `${from} --${kindLabel(type)}--> ${to}` : `${from} <--${kindLabel(type)}-- ${to}`),
    previous: t("Previous"),
    next: t("Next"),
    clear: t("Clear"),
    clearTitle: t("Return to the whole scope (Esc)"),
    position: (index: number, total: number) => tr`${index} of ${total}`,
};

/** Back, Forward and the recent roots of the scoped Galaxy (K2). */
export const galaxyHistoryText = {
    back: t("Back"),
    forward: t("Forward"),
    backGlyph: '←',
    forwardGlyph: '→',
    /** The visible words while the row has room (K2: "← Back" and "Forward →"); the glyphs alone in its compact levels. */
    backWide: t("← Back"),
    forwardWide: t("Forward →"),
    backTo: (label: string) => tr`Back to ${label} (Alt+Left)`,
    forwardTo: (label: string) => tr`Forward to ${label} (Alt+Right)`,
    noBack: t("Nothing to go back to yet"),
    noForward: t("Nothing to go forward to"),
    recent: t("Recent"),
    recentGlyph: '▾',
    recentTitle: t("Jump straight to a recently visited root with its last depth, direction and edge types"),
    recentList: t("Recently visited roots"),
    /** The accessible name of the Back, Forward and Recent group. */
    group: t("History"),
    allGraph: t("All graph"),
    allGraphNarrow: t("All"),
    allGraphTitle: t("Leave the scope and show the whole graph (Esc)"),
    layers: (depth: number) => (depth === 1 ? t("1 layer") : tr`${depth} layers`),
    direction: { inbound: t("incoming"), outbound: t("outgoing") } as Record<'inbound' | 'outbound', string>,
    noTypes: t("no edge types"),
    hierarchy: t("hierarchy"),
    callOrder: t("call order"),
    pathTo: (name: string) => tr`path to ${name}`,
};

const count = (value: number, one: string, many: string) => formatCount(value, one, many, value.toLocaleString());

/**
 * Who carries a name in the hierarchy of a scope: everyone, the root and its
 * direct neighbours, or (`none`) only the root and a side of its direct
 * neighbours that fits the budget.
 */
export type HierarchyNames = 'all' | 'neighbours' | 'none';
/** With `names: 'none'`: whether the root still carries its name (not with hundreds of roots) and how many direct neighbours on each side do. */
export interface HierarchyNamedSides { root: boolean; incoming: number; outgoing: number }

type TraceDirectionWord = 'both' | 'inbound' | 'outbound';
/* With the direct neighbours unnamed the root alone has too many: fewer layers would not help, a narrower trace would. */
const narrower = (direction: TraceDirectionWord) => (direction === 'both' ? t("trace one direction or fewer edge types") : t("trace fewer edge types"));
const namedFew = (sides: HierarchyNamedSides) => [t("the root"),
    sides.incoming > 0 ? tr`its ${count(sides.incoming, 'incoming neighbour', 'incoming neighbours')}` : '',
    sides.outgoing > 0 ? tr`its ${count(sides.outgoing, 'outgoing neighbour', 'outgoing neighbours')}` : ''].filter(Boolean).join(t(" and "));

/**
 * The hierarchy of a Galaxy scope (hand test K5): what the columns mean, per
 * trace direction and depth. Second review: from two layers on, a column only
 * holds chains that run one way to the root, the rest stands in a band below,
 * and every line says its type and direction. Names above the budget: see
 * `HierarchyNames`; the advice names what brings them back.
 */
export const galaxyHierarchyText = {
    hint: (direction: TraceDirectionWord, view: { mixed: number; names: HierarchyNames; budget: number; neighbours: number; sides: HierarchyNamedSides }) => [
        direction === 'inbound'
            ? t("hierarchy: what reaches the root, one column per layer to the left")
            : direction === 'outbound'
                ? t("hierarchy: what the root reaches, one column per layer to the right")
                : t("hierarchy: incoming relationships on the left, the root in the middle, outgoing on the right; each column is one layer further in the same direction"),
        view.mixed > 0 ? tr`${count(view.mixed, 'node', 'nodes')} reached through both directions, such as a callee of a caller, stand in the band below` : '',
        view.names === 'all' ? t("the type and direction of each relationship at its line")
            : view.names === 'neighbours'
                ? tr`above ${view.budget.toLocaleString()} nodes only the root and its direct neighbours carry names, so remove layers or trace fewer edge types to see all names`
                : !view.sides.root ? tr`names and edge types show for up to ${view.budget.toLocaleString()} nodes, so ${narrower(direction)} to see them`
                    : tr`names and edge types show for up to ${view.budget.toLocaleString()} nodes, and the root has ${count(view.neighbours, 'direct neighbour', 'direct neighbours')}, `
                        + tr`so only ${namedFew(view.sides)} ${view.sides.incoming + view.sides.outgoing > 0 ? t("carry names") : t("carries a name")}; ${narrower(direction)} to see the rest`,
    ].filter(Boolean).join('; '),
    /** The heading of the band in the picture. */
    bandTitle: (mixed: number) => tr`Mixed directions · ${count(mixed, 'node', 'nodes')}`,
    bandDetail: t("reached through both incoming and outgoing relationships, such as a callee of a caller"),
    /** The note in the picture when names are missing, and how to get them. */
    namesNote: (direction: TraceDirectionWord, nodes: number, names: Exclude<HierarchyNames, 'all'>, neighbours: number, budget: number, sides: HierarchyNamedSides) => (names === 'neighbours'
        ? tr`${count(nodes, 'node', 'nodes')}: names for the root and its ${count(neighbours, 'direct neighbour', 'direct neighbours')} only (up to ${budget.toLocaleString()} names). Remove layers or trace fewer edge types to name every node.`
        : !sides.root ? tr`${count(nodes, 'node', 'nodes')}: no names above ${budget.toLocaleString()} nodes. ${narrower(direction).replace(/^t/, 'T')} to see them.`
            : tr`${count(nodes, 'node', 'nodes')}, ${neighbours.toLocaleString()} of them direct neighbours of the root: names for ${namedFew(sides)} only (up to ${budget.toLocaleString()} names). ${narrower(direction).replace(/^t/, 'T')} to see the rest.`),
};

/** Loading, cancelling and the render limit of a scope layer (hand test K8). */
export const galaxyLayerText = {
    checking: t("Checking index…"),
    loading: (layer: number) => tr`Loading layer ${layer}…`,
    // A comma, not the dot of the finished counts: tools that wait for "N nodes · M edges" must not take this for done.
    loadingProgress: (layer: number, nodes: number, edges: number) =>
        tr`Loading layer ${layer}: ${count(nodes, 'node', 'nodes')}, ${count(edges, 'edge', 'edges')} so far`,
    /** The tooltip of a running load: which request it is on, page by page (review of K8). */
    loadingRequest: (request: number) => tr`Request ${request.toLocaleString()} to the index; "−" cancels.`,
    arranging: t("Arranging nodes…"),
    counts: (nodes: number, edges: number) => `${count(nodes, 'node', 'nodes')} · ${count(edges, 'edge', 'edges')}`,
    endOfTrace: t(" · end of trace"),
    // "Partial" leads, so a narrow toolbar that cuts the end never cuts the warning.
    partial: (counts: string) => tr`Partial: ${counts}`,
    partialPreview: t("Partial preview"),
    previewLoading: (layer: number) => tr`Partial preview while layer ${layer} loads`,
    // G3: a layer stops after the request that passes the limit, so it can hold more than the limit (5,548 of 5,000); the scene draws up to the limit.
    partialTitle: (layer: number, limit: number, kind: 'nodes' | 'edges') =>
        tr`Layer ${layer} stopped loading after the request that took it past the render limit of ${limit.toLocaleString()} ${t(kind)}, so it is incomplete; the scene draws at most ${limit.toLocaleString()} ${t(kind)}. Raise the limit under Limits or trace fewer edge types to load all of it.`,
    removeLayer: t("Remove the outermost layer"),
    cancelLoading: (layer: number) => tr`Cancel loading layer ${layer} and return to ${layer - 1 === 1 ? t("1 layer") : tr`${layer - 1} layers`}`,
    /* Measured, not promised: a hub at the edge can bring far more than the last layer did (JSONBAgg layer 3: about 400 expected, over 9,000 loaded). */
    /* With `calls` the index has counted the calls at the edge nodes (review of K8): a floor, where the growth alone missed the hubs. */
    /*
     * Hand test 2026-10-04 (G3): every sentence true on its own. The warning
     * names the limit and the number behind it (`expandPastLimit` in
     * graph-scope.ts); the growth estimate stands only where it is the larger
     * number, so "about 402 nodes" no longer sits next to a warning it
     * contradicts. Loading stops after the request that passes a limit, not
     * at the limit (JSONBAgg layer 3 ended at 5,548 nodes), and where no limit
     * applies (the Explore mini-Galaxy) the hint claims none.
     */
    expandHint: (outlook: ExpandOutlook, past: { limit: 'nodes' | 'edges'; by: 'calls' | 'growth' } | undefined) => {
        const { layer, frontier, estimate, calls, loaded, limits } = outlook;
        const unit = (kind: 'nodes' | 'edges', value: number) => count(value, kind === 'nodes' ? 'node' : 'edge', kind);
        const evidence = calls === undefined
            ? tr`Growing like the last layer it adds about ${estimate.toLocaleString()} nodes, and a hub can add many more`
            : tr`The index lists ${count(calls, 'call', 'calls')} at them that ${calls === 1 ? t("is") : t("are")} not loaded yet`
                + (calls >= estimate ? t(", and each can bring a new node") : tr`; growing like the last layer it adds about ${estimate.toLocaleString()} nodes`);
        const kind = past?.limit;
        return [
            past && limits && kind ? tr`Likely past the render limit of ${unit(kind, limits[kind])}.` : '',
            tr`Load layer ${layer}: ${count(frontier, 'node', 'nodes')} to expand.`,
            `${evidence}${kind ? tr`; ${unit(kind, loaded[kind])} ${loaded[kind] === 1 ? t("is") : t("are")} loaded now` : ''}.`,
            limits ? tr`Loading stops after the first request to the index that takes it past ${unit('nodes', limits.nodes)} or ${unit('edges', limits.edges)}, `
                + tr`so the layer can end above the limit; it is then marked partial, and the scene draws at most ${unit('nodes', limits.nodes)} and ${unit('edges', limits.edges)}.` : '',
        ].filter(Boolean).join(' ');
    },
    expandPartial: t("This layer stopped loading after it passed the render limit, so there is no complete edge to grow from. Raise the limit under Limits first."),
    expandEnd: t("End of trace: no relationship leads further."),
    /** Review of K31: Expand +1 is blocked while a layer loads, and says why. */
    expandLoading: (layer: number) => tr`Layer ${layer} is loading; "−" cancels it.`,
};

/** Compact toolbar words, so the scoped toolbar keeps to one row at 1600 px. */
export const galaxyToolbarText = {
    groups: (count: number) => tr`${count.toLocaleString()} groups`,
    groupsTitle: (count: number) => tr`${count.toLocaleString()} connection groups. Groups reflect connections in this trace, not inferred architecture components.`,
    limits: t("Limits"),
    limitsTitle: t("Rendered node and edge limits"),
    more: t("More"),
    moreGlyph: '⋯',
    moreTitle: t("More: open the source, rendered node and edge limits, connection groups"),
    openSource: t("Open source"),
    openRootTitle: (name: string, path: string, line?: number) => tr`Open the source of ${name} in Explore: ${path}${line ? `:${line}` : ''}`,
    /** The root button's accessible name: its action, with the visible name in it. */
    openRootLabel: (name: string) => tr`Open the source of ${name}`,
    traceTitle: t("Trace direction: incoming, outgoing or both"),
    expand: t("Expand +1"),
    expandNarrow: '+1',
    outsideLimits: (nodes: number, edges: number) => tr`${nodes.toLocaleString()} nodes · ${edges.toLocaleString()} edges outside render limits`,
};

/**
 * The names of Branch nodes (hand test 2026-10-04, round 4, N1). The index
 * puts one Branch node above the top level folders and files: the checkout it
 * read. Its own name is the branch, "DETACHED" for a detached HEAD or
 * "working-tree" where no branch is known, and on its own that read like a
 * folder of that name. The shown name says what it is; the real one stays in
 * the tooltip and the detail line (node-names.ts).
 */
export interface BranchNameWords {
    detached: string;
    workingTree: string;
    branch: (name: string) => string;
    /** The project in front: "django-demo · detached HEAD". */
    inProject: (project: string, what: string) => string;
}

export const galaxyNodeNameText: BranchNameWords & {
    indexName: (name: string, qualifiedName?: string) => string;
    branchTitle: (shown: string, name: string, qualifiedName?: string) => string;
} = {
    detached: t("detached HEAD"),
    workingTree: t("working tree"),
    branch: (name: string) => tr`branch ${name}`,
    inProject: (project: string, what: string) => `${project} · ${what}`,
    /** The detail line of the hover card. */
    indexName: (name: string, qualifiedName?: string) => tr`Name in the index: ${name}${qualifiedName ? ` (${qualifiedName})` : ''}`,
    /** The tooltip wherever the shown name stands. */
    branchTitle: (shown: string, name: string, qualifiedName?: string) =>
        tr`${shown}: the checkout the index read, above its top level folders and files. Name in the index: ${name}${qualifiedName ? ` (${qualifiedName})` : ''}.`,
};

/** What a click on a node in the hover card will do. */
export const galaxyCardText = {
    nothingToOpen: t("no file in the index: nothing to open"),
    openFile: t("click to open the file and follow the twin"),
};

/**
 * The hierarchy without anything to show, and its ring (hand test
 * 2026-10-04, round 4, N2). The ring follows the symbol open in Explore's
 * reader, so the note about it stands only beside that reader; in the Galaxy
 * tab the root of a scope stands in the middle of its hierarchy.
 */
export const galaxyHierarchyNoteText = {
    /** The hierarchy chip beside Explore while there is no walk and no open symbol. */
    unavailable: t("hierarchy: open a symbol or choose where to start, then this shows what it reaches"),
    /** The hierarchy chip in the Galaxy tab before a node is selected. */
    unavailableWorkspace: t("hierarchy: select a node first, then this shows what reaches it and what it reaches"),
    /** Beside Explore, when no node of the walk is the symbol open there. */
    noFocus: t("None of these nodes is open in Explore; the ring marks the symbol open there."),
};
