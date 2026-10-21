import { t, tr } from '../i18n/translate';
/**
 * Die Saetze des Instruments.
 *
 * Sie stehen hier und nicht im Katalog (src/i18n/messages.ts), aus demselben
 * Grund wie die Saetze der Galaxie und der Aenderungsansicht: der Katalog fuehrt
 * den Rahmen des Produkts, den jede Flaeche gleich benennt, und ein Fachgebiet
 * fuehrt seine eigenen Woerter neben sich. Was hier steht, sagt nur diese eine
 * Ebene.
 *
 * Eine Regel gilt fuer jeden Satz darin: **er sagt, was gezaehlt wurde, und
 * behauptet nichts darueber hinaus.** Kein Fortschritt, keine Prozentzahl, kein
 * "arbeitet an", kein "denkt nach". Ein Agent, der eine Datei geoeffnet hat, hat
 * eine Datei geoeffnet.
 */

import type { WorkKind } from './agent-event';

/** Was ein Buchstabe der Arbeit bedeutet, in einem Satz. */
export const WORK_KIND_TEXT: Readonly<Record<WorkKind, string>> = {
    read: t("read a file"),
    write: t("changed a file"),
    search: t("searched"),
    test: t("ran a test command"),
    other: t("ran a command the tool name does not classify"),
};

/** Das kurze Wort, das in der Zeile steht. */
export const WORK_KIND_WORD: Readonly<Record<WorkKind, string>> = {
    read: t("reading"),
    write: t("writing"),
    search: t("searching"),
    test: t("testing"),
    other: t("command"),
};

export const agentStrings = {
    title: t("LIVE AGENTS"),
    panelLabel: t("live agents on the graph"),

    /* ------------------------------------------------------------ der Kopf */

    agentCount: (count: number): string =>
        (count === 1 ? t("1 actor") : tr`${count} actors`),
    perMinute: (count: number): string =>
        (count === 1 ? t("1 event in the last minute") : tr`${count} events in the last minute`),
    orderIntact: t("order intact"),
    orderMissed: (count: number): string =>
        (count === 1 ? t("1 event missed") : tr`${count} events missed`),
    orderTitle:
        t("every run numbers its events. A number that never arrived is counted here; it is not filled in and not drawn."),
    joinedAt: (run: string, seq: number): string => tr`joined run ${run} at number ${seq}`,

    /* ------------------------------------------------------ die drei Lagen */

    foldTitle: (open: boolean): string =>
        (open ? t("fold the instrument down to one line") : t("unfold the instrument")),
    fold: (open: boolean): string => (open ? t("fold") : t("unfold")),
    expand: (expanded: boolean): string => (expanded ? t("compact") : t("expand")),
    expandTitle: (expanded: boolean): string =>
        (expanded
            ? t("back to the compact instrument, so it explains the graph instead of covering it")
            : t("one card per actor: the path it walked and the events behind every number")),
    collapsedLine: (count: number): string =>
        (count === 0
            ? t("no actor on the graph")
            : count === 1 ? t("1 actor on the graph") : tr`${count} actors on the graph`),

    /* ------------------------------------------------------- die Quelle */

    sourceOff: t("live mode is off, and nothing is asked"),
    sourceOffDetail:
        t("not one request goes to the daemon while this is off. Turn it on in the atlas menu with [g] live agents, or type \"live agents\" in the command line."),
    sourceConnecting: t("connecting to the daemon"),
    sourceNone: t("live mode is on and no daemon is answering"),
    sourceNoneDetail:
        t("check that the local daemon is running. It stores tool events in SQLite and serves them on the same port as this map. Recorded history is retained locally while the connection retries."),
    sourceConnected: (file: string): string => tr`reading ${file}`,
    sourceReplay: (file: string): string => tr`replaying ${file}`,
    replayNote:
        t("these events were recorded earlier. Their spacing is the recorded spacing, shifted forward so the last one is now."),
    unreadableLines: (count: number): string =>
        (count === 1
            ? t("1 line of the file was not readable JSON and was skipped")
            : tr`${count} lines of the file were not readable JSON and were skipped`),

    /* --------------------------------------------------------- die Zeilen */

    kindTitle: (kind: WorkKind, letter: string): string => `${letter}: ${WORK_KIND_TEXT[kind]}`,
    placeRange: (name: string, from: number, to: number): string => tr`${name}, lines ${from} to ${to}`,
    placeFile: (name: string): string => name,
    placeUncertain: (name: string): string => tr`${name} (no line range in the index)`,
    placeUncertainTitle:
        t("the graph knows this node but carries no end line for it, so this says where the event is and not that it lies inside a range."),
    placeNone: t("not placeable on the graph"),
    placeNoneTitle: (why: string): string => tr`${why}. The raw event stands below.`,
    ago: (seconds: number): string =>
        (seconds < 60
            ? `${Math.max(0, Math.round(seconds))}s`
            : `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`),
    hereFor: (spell: string): string => tr`here for ${spell}`,
    lastSeen: (spell: string): string => tr`last event ${spell} ago`,
    stripTitle: (seconds: number, count: number): string =>
        tr`${count} events in the last ${seconds} seconds, one bar per second, counted from the events themselves`,
    testedTitle: (name: string): string =>
        tr`the command names ${name}, which the index knows. The dashed line goes there.`,
    testedUnknown: t("the command names no file this index knows, so there is no line to draw"),

    /* ------------------------------------------------- die Selbstauskunft */

    intentPrefix: t("agent says:"),
    intentTitle:
        t("reported by the agent, not measured. This line exists because the event carried an intent field; without one there is no such line."),

    /* --------------------------------------------------- was nicht passt */

    unmappedTitle: (count: number): string =>
        (count === 1
            ? t("1 event is not placeable on the graph")
            : tr`${count} events are not placeable on the graph`),
    unmappedIntro:
        t("they stay here instead of disappearing: an event that falls out of the view would be the silent claim that it never happened."),
    unmappedRow: (tool: string, path: string, why: string): string =>
        `${tool} ${path.length > 0 ? path : t("(no path)")}: ${why}`,

    /* ---------------------------------------------------- die Umschalter */

    filterLabel: t("show"),
    filterYou: t("you"),
    filterAgent: t("agents"),
    filterBoth: t("both"),
    filterTitle: (option: string): string =>
        (option === 'you'
            ? t("only your own navigation")
            : option === 'agent' ? t("only the agents") : t("your navigation and the agents")),
    youName: t("you"),
    youPlace: t("the symbol you opened"),

    follow: t("follow"),
    followTitle: (on: boolean): string =>
        (on
            ? t("stop following: the camera stays where you put it")
            : t("the camera flies to the actor that moved last")),
    trails: t("trails"),
    trailsTitle: (on: boolean): string =>
        (on
            ? t("hide the path row of each actor")
            : t("show the path row: the symbols each actor touched, newest first")),
    /*
     * Bis W11b hiess dieser Schalter "cinema". Der Nutzer hat ihn am 2026-08-30
     * benutzt und woertlich gesagt: "bin jetzt im cinema mode, sollte fullscreen
     * heissen." Er heisst jetzt so, und zwar an jeder Stelle: Schalter,
     * Beschriftung, Kommandozeile, Naht und gespeicherte Wahl.
     */
    fullscreen: t("fullscreen"),
    fullscreenTitle: (on: boolean): string =>
        (on
            ? t("leave the full window and put the graph back into its panel. Escape does the same.")
            : t("the graph fills the window: bigger bodies, the instrument as a column at the edge, the timeline underneath.")),
    fullscreenScope:
        t("fullscreen is the frame and not a tour: the camera goes where you send it, here as well, and it is still there when you leave."),
    windowLabel: t("window"),
    windowOption: (ms: number): string =>
        (ms === 0 ? t("all kept") : ms < 60000 ? `${ms / 1000}s` : `${ms / 60000}m`),
    windowTitle: t("how far back the path row, the trail on the graph and the timeline reach"),
    pathEmpty: t("no path yet: no event of this actor named a file"),

    /* ------------------------------------------------- die Spur am Graphen */

    trailLegendTitle: t("agent trail"),
    trailLegendDetail:
        t("the dashed line behind an agent is the path it walked: the last symbols one actor touched, newest first, drawn under the real edges. It is NOT a relation in the code. The solid coloured lines come from the index; this one comes from events and fades with the window you picked."),

    /* -------------------------------------------------------- der Deckel */

    capLine: (drawn: number, total: number): string =>
        tr`${drawn} of ${total} bodies drawn: the layer stops at ${drawn}`,
    capTitle:
        t("the cap is a promise about computing time, not about the truth: every actor stays in this list with all its numbers. What is missing is the body on the graph, and this line is here so the picture is never quietly incomplete."),

    /* -------------------------------------------------------- die Ruhe */

    idleTitle: (seconds: number): string =>
        tr`no event for ${Math.round(seconds)}s: this body stands still and stays pale until the next one. Nothing here is animated while nothing happens.`,

    /* --------------------------------------------------------- der Puls */

    pulseTitle: (events: number, periodMs: number): string =>
        (events === 0
            ? t("no event in the last minute, so this body does not breathe")
            : tr`${events} events in the last minute: one breath every ${(periodMs / 1000).toFixed(1)}s. The pulse is the count, not decoration.`),

    /* ------------------------------------------------------ die Wiedergabe */

    followLine: (name: string, kind: string, place: string, lines: readonly number[]): string =>
        `${name} ${kind} ${place.length > 0 ? place : t("nothing this index knows")}`
        + (lines.length === 2 ? tr`, lines ${lines[0]} to ${lines[1]}` : ''),
    followLineTitle:
        t("the event the camera just followed. Actor, kind of work, symbol and line range, all four read from the event and the index; nothing else is in this line."),

    /* ------------------------------------------------------ der Zeitstrahl */

    timelineLabel: t("timeline"),
    timelineLive: t("LIVE"),
    timelinePaused: t("PAUSED"),
    timelineReplay: t("REPLAY"),
    timelineLiveTitle: t("the window ends now and moves with it"),
    timelinePauseTitle:
        t("hold the window where it is. Events keep arriving and are all there when you let it run again: what stops is the scrolling, not the listening."),
    timelineResume: t("resume"),
    timelinePause: t("pause"),
    timelineReplayNote: (spell: string): string =>
        tr`showing the state of ${spell} ago, not now`,
    timelineReplayTitle:
        t("a click on the timeline shows the state at that moment. Everything on the screen belongs to then, and it says so, because an old state looks exactly like the current one."),
    timelineBackToLive: t("back to live"),
    timelineTrackTitle: (name: string, count: number): string =>
        tr`${name}: ${count === 1 ? t("1 event") : tr`${count} events`} in this window, one tick each`,
    timelineEmpty: t("no event of this actor in this window"),
    timelineNarrow: (width: number): string =>
        tr`the graph area is ${width} px wide; the timeline needs 600 to keep one tick apart from the ${t("next")}`,

    /* ---------------------------------------------------------- der Ticker */

    tickerLabel: t("events"),
    tickerLine: (name: string, kind: string, place: string, lines: readonly number[]): string =>
        `${name} ${kind} ${place.length > 0 ? place : t("nothing this index knows")}`
        + (lines.length === 2 ? tr`, lines ${lines[0]} to ${lines[1]}` : ''),
    tickerTitle:
        t("the last events in plain words. One line per event, and every part of it is read from the event: who, what kind of work, which symbol, which lines."),

    /* ---------------------------------------------------------- die Ebene */

    layerOff: t("the agent layer is off in the settings, so nothing is drawn on the graph"),
} as const;

/**
 * Das Etikett des Menuepunkts.
 *
 * Es traegt den ZUSTAND und nicht die Wirkung, wie `[l]ocal llm off` daneben:
 * "off" heisst "es ist aus" und nicht "hier ausschalten". Dieselbe Lesart wie
 * bei [a]tlas, dessen `data-state` ebenfalls die Lage faerbt.
 *
 * Der Buchstabe steht in Klammern am Anfang, weil AtlasChrome ihn dort
 * heraustrennt (splitMenuLabel) und ein Terminal keine Unterstreichung hat.
 */
export function agentsMenuLabel(on: boolean): string {
    return on ? t("[g] live agents on") : t("[g] live agents off");
}
