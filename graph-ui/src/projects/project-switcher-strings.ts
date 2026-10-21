import { t, tr } from '../i18n/translate';
export const projectSwitcherStrings = {
    project: t("Project"),
    choose: t("Choose project"),
    switchProject: (name: string) => tr`Switch project: ${name}`,
    search: t("Find a project"),
    searchPlaceholder: t("Search projects or paths"),
    loading: t("Loading projects..."),
    failed: t("Could not load projects."),
    empty: t("No indexed projects yet."),
    noMatches: t("No matching projects."),
    current: t("Current"),
    retry: t("Try again"),
    /** Review of K42: the Refresh button says that it runs, then when it ran (shared words in ui/refresh/strings.ts). */
    refreshFeedback: { idle: t("Refresh projects"), busy: t("Refreshing projects…"), done: (time: string) => tr`Projects refreshed at ${time}` },
    add: t("Add project index"),
    indexActivity: (status: 'indexing' | 'done' | 'error') => status === 'indexing' ? t("Indexing…") : status === 'done' ? t("Index ready") : t("Index needs attention"),
};
