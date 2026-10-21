import { t, tr } from '../i18n/translate';
import { experimentalAgentsEnabled } from './feature-flags';

export type Workspace = 'explore' | 'galaxy' | 'architecture' | 'adr' | 'agents' | 'coverage' | 'system';
export type Guidance = 'brief' | 'explained';

export const workspaceStrings = {
    navigation: t("Workspace"),
    workspaces: [
        { id: 'explore' as const, label: t("Explore") },
        { id: 'galaxy' as const, label: t("Galaxy") },
        { id: 'architecture' as const, label: t("Architecture") },
        { id: 'adr' as const, label: t("ADR") },
        { id: 'agents' as const, label: t("Agents") },
        { id: 'coverage' as const, label: t("Coverage") },
        { id: 'system' as const, label: t("System") },
    ],
    tools: t("Tools"),
    search: t("Search"),
    searchOpen: t("Open search and commands"),
    searchTitle: t("Search and commands"),
    searchPlaceholder: t("Find a symbol, search by meaning, or run a command"),
    searchClose: t("Close search"),
    loadedSearchHeadline: (query: string, count: number) => tr`${count} loaded ${count === 1 ? t("match") : t("matches")} for "${query}"; no matching index results.`,
    searchShortcut: '⌘ / Ctrl K',
    searchExamples: t("Try a search or graph command"),
    chatGraphHeight: t("Height of graph below chat"),
    guidance: t("Explanation depth"),
    brief: t("Brief"),
    briefValue: 'brief',
    explained: t("Explained"),
    explainedValue: 'explained',
    diagnostics: t("Connection details"),
    coverage: t("Index details"),
    model: t("Model details"),
    perspective: t("Reading preferences"),
    welcomeEyebrow: t("Codebase memory"),
    welcomeTitle: t("A clearer view of your code."),
    welcomeDescription: t("Explore the source and understand its architecture."),
    descriptions: {
        explore: t("Read source with graph context."),
        galaxy: t("Explore the whole graph and its coverage shadow."),
        architecture: t("See modules, dependencies, and entry points."),
        adr: t("Read and edit the project’s architecture decisions."),
        agents: t("Inspect recorded activity and touched code."),
        coverage: t("Inspect indexed paths, exclusions, and parser gaps."),
        system: t("Monitor the daemon, indexes, and logs."),
    },
    changeLater: t("Switch workspaces at any time."),
    localAi: t("Set up browser AI"),
    browserAi: t("Chat"),
    agentControls: t("Local agent"),
    agentStatus: { off: t("Agent off"), loading: t("Agent loading"), active: t("Agent active"), busy: t("Agent working"), error: t("Agent error") },
    /** The header shows a robot and a lamp; state and model are read out and shown on hover. */
    agentSettings: (status: string, model?: string) => tr`Local agent settings: ${status}${model ? `, ${model}` : ''}`,
    agentSettingsTitle: (status: string, model?: string) => tr`${status}${model ? ` · ${model}` : ''}. Configure the browser-local agent.`,
    openChat: t("Open chat"),
    hideChat: t("Hide chat"),
    daemon: t("Daemon"),
    daemonNavigation: (state: string) => tr`Open System: daemon ${t(state)}`,
    chatWidth: t("Width of local chat"),
    askSelection: t("Ask about selection"),
    assessImpact: t("Assess impact"),
    codeDetails: t("Code details"),
    indexInventory: t("Index inventory and legend"),
    selectionImpact: t("Assess change impact"),
    changeAnalysis: t("Change analysis"),
    sourceOutsideSnapshot: t("This file is outside the loaded index snapshot."),
    selectionEvidence: t("Selection evidence"),
    graphContext: t("Graph context"),
    coverageShadowSelection: (name: string) => tr`Coverage shadow: ${name}`,
    start: t("Start exploring"),
    aiOptional: t("Browser AI is optional and off. Setup asks before downloading a model."),
};

export function availableWorkspaces(agentsEnabled = experimentalAgentsEnabled) {
    return workspaceStrings.workspaces.filter(workspace => agentsEnabled || workspace.id !== 'agents');
}

export function allowedWorkspace(workspace: Workspace, agentsEnabled = experimentalAgentsEnabled): Workspace {
    return workspace === 'agents' && !agentsEnabled ? 'explore' : workspace;
}

/** An unavailable explicit or saved workspace falls back to the source reader. */
export function initialWorkspace(requested: string | null, saved: string | null, agentsEnabled = experimentalAgentsEnabled): Workspace {
    const known = (value: string | null): value is Workspace => workspaceStrings.workspaces.some(workspace => workspace.id === value);
    return allowedWorkspace(known(requested) ? requested : known(saved) ? saved : 'architecture', agentsEnabled);
}
