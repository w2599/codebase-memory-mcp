import { t, tr } from './translate';

/** Shared UI copy. Domain catalogs remain beside their panels.
 * Literal UI strings use t; templates use tr so inserted source data stays intact.
 * The locale is resolved before these modules are imported by main.tsx.
 */

/** Ein Menuepunkt: sein Buchstaben-Kuerzel und der Rest des Wortes. */
export interface MenuItemMessage {
    readonly key: string;
    readonly rest: string;
}

/*
 * Drei Saetze stehen an mehr als einer Stelle im Baum, und sie stehen darum
 * genau einmal hier. Sie zweimal auszuschreiben waere zweimal die Gelegenheit,
 * einen davon zu schaerfen, bis die beiden verschieden sind.
 */
const NO_PROJECT = t("no project");
const CLOSE = t("close");
const TOUR_FAILED_TEXT = t("the walk could not be prepared");

export const messages = {
    browserChat: {
        menuLabel: t("[l]ocal chat"),
        menuTitle: t("Open local browser chat"),
        subtitle: t("Graph display and local browser models"),
        title: t("Browser models"),
        detail: t("Choose or download an optional model in chat settings. Answers run locally in this browser; code exploration works without a model."),
        open: t("Open local chat"),
    },
    /** Die Kopfzeile und die Flaechen, die zu keinem Panel gehoeren. */
    app: {
        brand: 'CBM LENS',
        releaseLabel: t("Beta"),
        /** Steht in der Tab-Leiste und im Breadcrumb, wenn nichts offen ist. */
        noFileOpen: t("no file open"),
        /** Der Name, den eine Oberflaeche ohne Projekt traegt. */
        noProject: NO_PROJECT,
        closeTab: (name: string): string => tr`close ${name}`,
    },

    /**
     * Die Menuezeile und die Titel ihrer Punkte.
     *
     * Seit dem 2026-08-29 steht hier NUR noch, wofuer es eine Verdrahtung gibt.
     * Bis dahin trug die Zeile die fuenf Punkte des Terminal-Vorbilds
     * (`[f]ile [e]dit [v]iew [t]erminal` neben `[a]tlas`) und haengte den
     * unverdrahteten einen `title` an, der sagte, dass sie nichts tun. Das war
     * die Form des Vorbilds ohne dessen Inhalt: vier Woerter, die eine Bedienung
     * anbieten, die es in einer Lese-Oberflaeche nicht gibt und nicht geben
     * soll. Ein Tooltip macht aus einer Attrappe keine Auskunft; er macht sie zu
     * einer Attrappe mit Fussnote.
     *
     * Was bleibt, hat etwas dahinter: `[a]tlas` schaltet die Galaxie und traegt
     * die vier Aktionen der Atlas-Zeile, `[?]help` schlaegt die Hilfe auf. Die
     * Regel dazu wird strukturell geprueft und nicht per Liste gepflegt: jeder
     * Eintrag hier muss seinen Buchstaben in WIRED_MENU_SHORTCUTS haben
     * (src/app/shortcuts.ts, Test src/app/shortcuts.test.ts).
     */
    menu: {
        ariaLabel: t("main menu"),
        items: [
            { key: 'a', rest: t("tlas") },
            { key: '?', rest: t("help") },
        ] as readonly MenuItemMessage[],
        /**
         * Was die Klammer um den Buchstaben bedeutet, in der Zeile selbst.
         *
         * Seit dem 2026-08-29 tragen die Buchstaben Alt/Option (siehe
         * src/app/keyboard.ts), und ein `[a]` ohne diese Angabe waere ein
         * Versprechen auf eine Taste, die etwas anderes tut. Die Angabe steht in
         * der Zeile und nicht nur in der Hilfe, weil sie dort gebraucht wird, wo
         * die Klammern stehen.
         */
        legend: t("alt + letter"),
        atlasHide: t("atlas: hide the galaxy panel (alt+a)"),
        atlasShow: t("atlas: show the galaxy panel (alt+a)"),
        settings: t("atlas: which model answers, and everything that costs computing time (alt+s)"),
        agentsOn:
            t("atlas: live mode is on. The bridge is being read and the actors are drawn on the graph (alt+g)"),
        agentsOff:
            t("atlas: live mode is off, and not one request goes to the bridge. Turn it on to see the agents working in this repository (alt+g)"),
        why: t("atlas: put the question again and pick a way in (alt+w)"),
        bug: t("atlas: compare the expected path into a symbol with the observed one (alt+b)"),
        impact: t("atlas: what a change would reach, and what covers it (alt+c)"),
        helpOpen: t("help: what this reads, what it cannot do, and every key it listens to (?)"),
        helpClose: t("help: close this page (?)"),
        projects: t("atlas: what this server has indexed, index more, and what the server is doing (alt+p)"),
    },

    /**
     * Die Hilfeseite, ganz.
     *
     * Sie steht im Katalog und nicht in der Komponente, weil sie der laengste
     * zusammenhaengende Text der Oberflaeche ist: verteilt auf JSX waere sie der
     * eine Ort, an dem niemand mehr sieht, was das Produkt ueber sich selbst
     * behauptet. Hier steht es an einem Stueck und ist an einem Stueck lesbar.
     *
     * Zwei Dinge sind ausdruecklich so gebaut und nicht anders:
     *
     * 1. **Die Grenzen stehen vor den Faehigkeiten.** Wer die Hilfe aufschlaegt,
     *    soll zuerst erfahren, was hier nicht geht, samt Grund. Ein Produkt, das
     *    seine Grenzen ans Ende stellt, laesst den Leser sie selbst finden, und
     *    das ist die teuerste Art, sie zu erfahren.
     * 2. **Kein Netz-Link, nirgends.** Die Oberflaeche ist per Vorgabe
     *    abgeschottet (PLAN Abschnitt 3); ein Verweis ins Web waere im
     *    Normalbetrieb ein toter Knopf. Die Verweise sind darum Pfade in diesem
     *    Repository.
     */
    help: {
        title: t("CBM LENS HELP"),
        subtitle: t("a reading surface over an indexed repository"),
        close: t("[esc] close"),
        closeLabel: CLOSE,

        whatTitle: t("What this is"),
        what: [
            t("CBM Lens reads a repository that the analysis server has indexed and explains it: the tree and the source, a twin of the symbol under the caret, a walk along the calls, the scope of a change, and the answers of a local model."),
            t("Everything on this screen comes from that index or from a file the server handed over, and every panel says which of the two it is."),
        ],

        limitsTitle: t("What it cannot do"),
        limits: [
            t("The reader is read-only: you cannot edit a file here, and what you type into it changes nothing."),
            t("It cannot run code, and there is no terminal: no build, no test run, no shell. The one job it can ask for is an index run, and the analysis server does that in its own process, from the [p]rojects panel."),
            t("It reaches no cloud. The only model it can use is a sidecar on this machine, started by hand, and it stays off until it answers."),
        ],
        limitsWhy:
            t("That is the shape of the product and not a missing release: this surface has no backend of its own. Apart from the three requests the [p]rojects panel makes (index a repository, remove an index, store a decision record), the analysis server offers it a read-only surface, and everything that writes, builds or executes happens where the repository lives, on the command line."),

        panelsTitle: t("The panels, and what each one answers"),
        panels: [
            { name: t("explorer and reader"), answers: t("what is in this project, and what does this file say") },
            { name: t("twin"), answers: t("what does the symbol under the caret hold, call, raise and touch") },
            { name: t("flow"), answers: t("in what order does this symbol call what it calls") },
            { name: t("[w]hy am I here"), answers: t("where do I start, and what is the walk from there") },
            { name: t("[b]ug hunt"), answers: t("how does the expected path into a symbol differ from the observed one") },
            { name: t("[c]hange scope"), answers: t("what would a change here reach, and what covers it") },
            { name: t("[a]tlas"), answers: t("where does this symbol sit among the others") },
            { name: t("[l]ocal llm"), answers: t("is a local model answering, and out of which context") },
            {
                name: t("[s]ettings"),
                answers:
                    t("which model in your cache answers, how to get another one, and what the drawing of the graph costs on this machine"),
            },
            {
                name: t("[p]rojects"),
                answers:
                    t("what this server has indexed, how to index or remove a repository, the decision record of the open project, and what the server is doing"),
            },
            {
                name: t("command line"),
                answers:
                    t("which symbol means this: the words are matched against symbol names and their paths while you type. A line that ends with a question mark builds an answer from indexed cards and their source lines. Use the visible AI button on that answer only if you want an optional local-model wording. This line runs no commands."),
            },
        ],

        shortcutsTitle: t("Every key this window listens to"),
        shortcutsNote:
            t("Menu shortcuts work across the workspace. Cmd/Ctrl+K opens the dedicated node and cluster search in Galaxy."),
        typingNote:
            t("Typing stays in the field you focused. Menu shortcuts use Alt (Option on an Apple keyboard)."),
        columnKey: t("key"),
        columnWhere: t("where it counts"),
        columnDoes: t("what it does"),

        /*
         * Der Tastentest.
         *
         * Er steht in der Hilfe und nicht in einem Entwicklermodus, weil er den
         * Nutzer beantwortet, der einen Fehler meldet, den niemand nachstellen
         * kann. Am 2026-08-29 kam "alt plus letter funktioniert nur fuer
         * atlas"; an der laufenden Vorschau loesten alle fuenf Kuerzel aus. Statt
         * an einer Ursache zu raten, zeigt die Seite, was am Geraet des Lesers
         * wirklich ankommt, und was diese Oberflaeche daraus gemacht haette.
         */
        keyProbeTitle: t("Test a key combination"),
        keyProbeIntro:
            t("Press a combination now, with this page open, and read below what arrived. This is not a simulation: it is the same reading the window handler makes, from the same event."),
        keyProbeIdle: t("nothing pressed yet"),
        keyProbeFields: {
            code: t("physical key (code)"),
            key: 'character produced (key)',
            modifiers: t("modifiers"),
            defaultPrevented: t("already consumed"),
            consumedBy: t("consumed by"),
            target: t("arrived at"),
            shortcut: t("recognised as a menu key"),
        } as Readonly<Record<string, string>>,
        keyProbeConsumers: {
            nobody: t("nobody: it arrived untouched"),
            'this-window': t("this window: its own shortcut handler took it"),
            'something-else':
                t("something else, before this window saw it: a browser extension, the keyboard layout, or another handler on the page"),
        } as Readonly<Record<string, string>>,
        keyProbeNoShortcut: t("no: this combination is not a menu key"),
        keyProbeShortcut: (letter: string): string => tr`yes: the menu key for [${letter}]`,
        keyProbeNone: '-',
        keyProbeNoModifier: t("none"),
        keyProbeNote:
            t("What to look for: a menu key needs alt (option) and a code of the form KeyW. On an Apple keyboard option+w produces a different character, which is why the wiring reads the code and not the character. If nothing appears here at all when you press, the combination never reached this page, and the cause is outside it."),

        /** Der Modifikator vor einem Menuekuerzel. Auf Apple-Tastaturen: option. */
        altPrefix: 'alt+',
        scopes: {
            mnemonic: t("anywhere, also while you type"),
            bare: t("outside text fields"),
            galaxy: t("anywhere"),
            walk: t("during a walk"),
        },
        keyNames: {
            Enter: 'enter',
            Escape: 'esc',
            ArrowUp: t("up"),
            ArrowDown: t("down"),
            ArrowLeft: t("left"),
            ArrowRight: t("right"),
        } as Readonly<Record<string, string>>,
        /**
         * Was eine Taste tut, je Bereich und Taste (`bereich:taste`).
         *
         * Der Schluessel ist zusammengesetzt, weil dieselbe Taste in zwei
         * Bereichen zwei Dinge tut: Enter geht im Walk einen Schritt weiter und
         * oeffnet im Suchfenster den Treffer.
         */
        shortcutDoes: {
            'mnemonic:a': t("show or hide the galaxy"),
            'mnemonic:w': t("ask again where to start, and walk from there"),
            'mnemonic:b': t("open the BUG hunt on the symbol in the twin"),
            'mnemonic:l': t("turn the local model on or off"),
            'mnemonic:r': t("put every zone back to the width and height it starts with"),
            'mnemonic:s': t("open or close the settings: the model, and what the drawing costs"),
            'mnemonic:g': t("turn the live agent mode on or off. Off asks the bridge nothing at all"),
            'mnemonic:p': t("add a project index or return to its indexing progress"),
            'bare:?': t("open or close this page"),
            'galaxy:Cmd/Ctrl+K': t("open Galaxy and focus node or cluster search"),
            'walk:Enter': t("go to the next step of the walk, and finish it on the last one"),
            'walk:ArrowLeft': t("go back one step"),
            'walk:q': t("leave the walk"),
            'walk:d': t("draw the flow of this step, when the step has a symbol"),
        } as Readonly<Record<string, string>>,

        operationsTitle: t("Running it"),
        operations: [
            t("Index a project from the [p]rojects panel (alt+p) or with the CLI of the analysis server, then open it from that panel or with the project name in the address (?project=<name>). The server indexes; this window asks."),
            t("Start the local model with llm/start.sh class-a. It listens on the loopback address of this machine; the [l]lm card turns green as soon as it answers, and says why when it does not."),
            t("Bring recorded runs in with ingest_traces on the command line. There is no importer on this surface, and the twin does not carry them: they show up on the BUG hunt hops and in the flow."),
        ],

        honestyTitle: t("The rules this surface holds itself to"),
        honesty: [
            t("Every claim comes from the index or from the file the server sent, and the panel names which."),
            t("What the index does not record is named as a gap, never filled in with a plausible guess."),
            t("An affordance that does nothing does not exist here: a button or a key either acts, or it is not on the screen."),
        ],

        referencesTitle: t("Where to read further, in this repository"),
        references: [
            { path: 'README.md', about: t("exploration, local inference and development setup") },
            { path: 'CONFIGURATION.md', about: t("settings, precedence and the local configuration API") },
            { path: 'THIRD_PARTY.md', about: t("source provenance, dependencies and model licenses") },
            { path: 'docs/adr/0001-modellwahl.md', about: t("local inference choices and model evidence") },
        ],
        referencesNote:
            t("Paths in this repository, not links. This window is offline by design, so a link into the web would be a button that leads nowhere."),
    },

    /** Die Chips der Kopfzeile und der Statusleiste. */
    statusbar: {
        chipProject: t("project"),
        chipSymbols: t("sym"),
        chipEdges: t("edg"),
        chipServer: t("server"),
        chipPort: t("port"),
        chipTree: t("tree"),
        chipSource: t("source"),
        chipGalaxy: t("galaxy"),
        /*
         * Nutzerwunsch vom 2026-08-29: das Ding heisst ueberall gleich.
         *
         * Der Chip hiess "llm", der Menuepunkt "[l]lm on", die Karte
         * "LOCAL_MODEL": drei Namen fuer eine Sache, und der kuerzeste davon
         * sagte nicht, dass sie auf diesem Rechner laeuft. Seit W7c heisst sie
         * an allen drei Stellen "local llm"; der Buchstabe des Kuerzels bleibt
         * `l` (src/llm/strings.ts).
         */
        chipLlm: t("local llm"),
        chipCoverage: t("coverage"),
        chipExplored: t("explored"),
        chipWalk: t("walk"),
        /** Der Wert eines Chips, dessen Zahl der Server nicht genannt hat. */
        noCount: t("no count"),
        serverContacting: t("contacting"),
        serverReady: t("ready"),
        serverUnreachable: t("unreachable"),
        noFileLoaded: t("no file loaded"),
        noProjectIndexed: t("no project: this server has nothing indexed. alt+p opens the projects panel to index one"),
        noProjectError: (detail: string): string => tr`no project: ${detail}`,
    },

    /** Der Explorer: seine Ueberschrift und die eine Zeile seiner Ordner-Legende. */
    explorer: {
        title: t("EXPLORER"),
        folderLabel: t("folder"),
        folderDescription: t("the worst stage of anything below it"),
    },

    /** Die Notizen um den Editor herum. */
    reader: {
        /** Die Marke vor der Kappungszeile unter dem Editor. */
        incompleteLabel: t("incomplete: "),
        pickFile: t("pick a file in the explorer"),
        loading: (path: string, tool: string): string => tr`loading ${path} over ${tool} ...`,
    },

    /**
     * Die Kommandozeile: Platzhalter und die beiden Hinweise am rechten Rand.
     *
     * Der `title` ist seit dem 2026-08-29 weg. Ein nativer Tooltip legt sich in
     * dieser Oberflaeche ueber den Anfang der Zeile, also ueber genau den Text,
     * den der Leser gerade tippt (Nutzer-Screenshot); er ist ausserdem nicht zu
     * gestalten und kommt zu spaet, um eine Frage zu beantworten, die man beim
     * Hinsehen hat. Was er sagte, steht jetzt in der Hilfe unter "the panels,
     * and what each one answers".
     */
    command: {
        ariaLabel: 'command line',
        /*
         * Der Rueckfall, wenn noch kein Index geladen ist.
         *
         * Steht einer, nennt die Zeile ein echtes Beispiel mit einem Symbol
         * dieses Projekts (src/search/command-examples.ts). Der Nutzer am
         * 2026-08-29: "anstelle von 'type a command or ask the atlas' explizite
         * Beispiele, wie man den Chat nutzt, sonst weiss niemand, wie man es
         * nutzt."
         */
        placeholder: 'type a command or ask CBM Lens...',
        examplesLabel: 'what you can type here',
        hintIdle: 'type 2 letters to search by meaning',
        hintOpen: 'up/down picks, enter opens, esc closes',
    },

    /** Das Suchfenster ueber der Kommandozeile. */
    search: {
        resultsLabel: t("search results"),
        searching: (query: string): string => tr`searching for "${query}" ...`,
        failed: t("the search could not be answered"),
        noFile: t("this hit carries no file in the index, so there is nothing to open"),
        /**
         * Was im Trefferfenster steht, solange erst ein Zeichen getippt ist.
         *
         * Der Hinweis stand bis zum 2026-08-29 nur klein am rechten Rand der
         * Zeile ("type 2 letters to search by meaning"). Wer tippt, sieht aber
         * dorthin, wo die Treffer erscheinen, und dort stand nichts: aus
         * Nutzersicht antwortet die Suche auf den ersten Buchstaben mit
         * Schweigen. Jetzt steht der Satz an der Stelle, an der die Antwort
         * erwartet wird.
         */
        oneMoreLetter: t("one more letter, then CBM Lens searches by meaning"),
        /*
         * Die Sofort-Vorschlaege, und dass sie vorlaeufig sind.
         *
         * Nutzerbefund vom 2026-08-29: die Vorschlaege erscheinen zu langsam.
         * Die Antwort darauf sind Zeilen aus dem, was der Browser schon geladen
         * hat, sichtbar bevor der Index geantwortet hat. Sie muessen als das
         * erkennbar sein, was sie sind, sonst waeren sie eine leise Luege ueber
         * die Vollstaendigkeit der Suche: hier steht nicht "das findet der
         * Index", sondern "das kennt dieses Fenster schon".
         */
        provisionalHeadline: (query: string, shown: number): string =>
            shown === 1
                ? tr`1 suggestion for "${query}" from what is already loaded, the index is answering ...`
                : tr`${shown} suggestions for "${query}" from what is already loaded, the index is answering ...`,
        provisionalEmpty: (query: string): string =>
            tr`nothing loaded answers "${query}" yet, asking the index ...`,
        /** Die Marke an einer vorlaeufigen Zeile. Kurz, weil sie an jeder steht. */
        provisionalMark: t("loaded"),
        provisionalMarkTitle:
            t("from the tree and the graph this window already holds, not from an answer of the index"),
    },

    /** Die Frage nach dem Warum. Die Karten selbst stehen in why/why-model.ts. */
    why: {
        /** Was in der Fusszeile der Karte steht, wenn kein Projekt geladen ist. */
        noProject: NO_PROJECT,
    },

    /** Die Schrittkarte einer Fuehrung. */
    tour: {
        prev: t("[<-] prev"),
        prevUnavailable: t("this is the first step, so there is no previous step to return to"),
        nextPrefix: '[Enter] ',
        next: t("next"),
        finish: t("finish"),
        exit: t("[q] exit"),
        /** Die vierte Aktion der Karte (PLAN Abschnitt 4, Audit-Befund 13). */
        diagram: t("[d] diagram"),
        diagramTitle: t("draw the flow of this step: what it calls, in order, and what each call raises"),
        /**
         * Was dort steht, wenn dieser Schritt kein Symbol hat.
         *
         * Der Satz nennt den Grund und nicht die Wirkung: "nothing to draw"
         * klaenge wie ein Befund ueber die Datei, und dies ist eine Auskunft
         * ueber den Schritt.
         */
        diagramUnavailable:
            t("this step points at a file, not at a symbol, so there is no call flow to draw"),
        failed: TOUR_FAILED_TEXT,
        failedNoFile: (name: string): string =>
            tr`${TOUR_FAILED_TEXT}: the index names no file for ${name}`,
    },

    /** Der Einstiegsdialog. */
    entry: {
        title: t("Where do you want to start?"),
        subline:
            t("The walk starts at what you pick here and goes forward over the calls the index recorded."),
        searchPlaceholder: t("or search for a name ..."),
        searchLabel: t("search for a symbol by meaning"),
        close: t("[esc] close"),
        closeLabel: CLOSE,
        searching: t("searching ..."),
        notOpenable: t("the index names this way in but no file for it, so there is nothing to open"),
        startWalkAt: (name: string): string => tr`start the walk at ${name}`,
        overviewFailed: (detail: string): string =>
            tr`the summary of ways in could not be read: ${detail}`,
        noAnswer: (query: string): string => tr`no symbol answers "${query}"`,
    },

    /** Der Rahmen des BUG-Assistenten. Seine Saetze stehen in bug-wizard-strings.ts. */
    wizard: {
        closeLabel: CLOSE,
        unresolvedHop: (name: string): string =>
            tr`the index does not resolve "${name}", so there is nothing to open.`,
    },

    /** Der Rahmen der Aenderungsansicht. Ihre Saetze stehen in impact-strings.ts. */
    impact: {
        close: t("[esc] close"),
        closeLabel: CLOSE,
        openRow: (name: string): string => tr`open ${name}`,
        rowNotOpenable: t("the index names no file for this row, so there is nothing to open"),
        tileChangedFiles: t("changed files"),
        tileDirectSymbols: t("symbols in them"),
        tileEndpoints: t("endpoints"),
        tileTestsAffected: t("tests affected"),
        tileUntestedAffected: t("untested affected"),
        /** Ein Abstandsband, ein- und mehrzahlig. */
        stepsOut: (distance: number): string =>
            distance === 1 ? t("one step out") : tr`${distance} steps out`,
        noTestCaller: t("no test caller found"),
    },

    /** Die Karte des lokalen Modells. Ihre Zustandssaetze stehen in llm/strings.ts. */
    llm: {
        panelLabel: t("local model"),
        on: t("on"),
        off: t("off"),
        toggleBlocked: t("denied by the project policy: this switch has no effect"),
        toggleOff: t("turn the local model off"),
        toggleOn: t("turn the local model on"),
        /** Siehe Kopf dieser Datei: bis zum 2026-08-29 der eine deutsche Eintrag. */
        readFrom: (source: string): string => tr`read from ${source}`,
        rowModel: t("model"),
        rowContext: t("context"),
        rowWeights: t("weights"),
        rowSlots: t("slots"),
        sourceModel: 'GET /props (model_path, model_ftype)',
        sourceContext: 'GET /props (n_ctx), GET /v1/models (n_ctx_train)',
        sourceWeights: 'GET /v1/models (meta.size, meta.n_params)',
        sourceSlots: t("GET /props (total_slots), Port aus llm/start.sh"),
        contextValue: (tokens: number, trained: number | undefined): string =>
            trained === undefined ? tr`${tokens} tokens` : tr`${tokens} of ${trained} trained tokens`,
        weightsValue: (size: string, billions: string | undefined): string =>
            billions === undefined ? size : tr`${size} for ${billions}B parameters`,
        slotsValue: (slots: number, port: number): string => tr`${slots} on 127.0.0.1:${port}`,
    },

    /**
     * Die Zonen, ihre Griffe und der Erklaeren-Bereich mit seinen Reitern.
     *
     * Der Bereich ist neu in W8 und ersetzt drei Flaechen, die sich bis dahin um
     * denselben Platz stritten (Flow-Erklaerer, Antwort-Panel, Schrittkarte).
     * Zwei Sorten Saetze stehen darum hier, und der Unterschied zwischen ihnen
     * ist der Kern dieses Zyklus:
     *
     *  - `disabled` sagt, warum ein Reiter gerade nichts zu zeigen hat. Er
     *    verschwindet nicht: ein Reiter, der mal da ist und mal nicht, laesst
     *    den Leser suchen, wo vorher etwas war. Er steht gedimmt da und sagt
     *    seinen Grund IM FELD, nicht in einem Tooltip. Ein Tooltip macht aus
     *    einer Attrappe keine Auskunft (dieselbe Regel wie in der Menuezeile).
     *  - `note` ist die eine Zeile, die der eingeklappte Streifen zeigt. Sie
     *    beantwortet die Frage, die W7c fuer den Chat schon beantwortet hatte:
     *    "ist mein Verlauf noch da?". Seit W8 gilt sie fuer jeden Reiter.
     */
    layout: {
        explainLabel: t("explain"),
        explainTabsLabel: t("what explains the code in front of you"),
        explainEmptyLabel: t("nothing to explain here yet"),
        collapse: t("[esc] fold"),
        collapseTooltip:
            t("fold this area away. Nothing in it is lost: the chat keeps its history, the walk its step and the flow its place. Only \"clear\" in the chat deletes anything."),
        expand: t("unfold"),
        expandTooltip: t("unfold this area again, on the tab that was open last"),
        tab: {
            flow: t("flow"),
            walk: t("walk"),
            chat: t("chat"),
            bug: t("bug hunt"),
            change: t("change impact"),
        },
        tabTitle: {
            flow: t("the recorded calls of the symbol in the twin, as a sequence and as steps"),
            walk: t("the walk in front of you: one step, what it is, and where it sits"),
            chat: t("what was asked in this session, with the cards each answer was given"),
            bug: t("the expected path into a symbol against the observed one"),
            change: t("what a change would reach, and what covers it"),
        },
        disabled: {
            flow:
                t("No symbol in the twin yet, so there is no sequence to draw. Open a file and put the caret in a function; the twin follows it, and this tab follows the twin."),
            walk:
                t("No walk is running. Start one from the atlas menu (\"Choose a starting point\") and its steps appear here."),
            chat:
                t("Nothing was asked in this session yet. Type a question in the command line and press enter; the answer and the cards it was given show up here."),
            bug:
                t("No project is open, and this assistant reads a project index. Open one and the expected path against the observed one is drawn here."),
            change:
                t("No project is open, and this view reads a project index. Open one and the reach of a change is drawn here."),
        },
        note: {
            flow: (subject: string): string => tr`flow of ${subject}`,
            flowIdle: t("no symbol in the twin"),
            walk: (step: number, steps: number): string => tr`walk, step ${step} of ${steps}`,
            walkIdle: t("no walk running"),
            chat: (turns: number): string =>
                turns === 1 ? t("1 question in this session") : tr`${turns} questions in this session`,
            chatIdle: t("nothing asked yet"),
            bug: t("bug hunt"),
            change: t("change impact"),
        },
        /**
         * Die vier Griffe.
         *
         * Jeder traegt seinen eigenen Namen, weil vier Trennlinien mit demselben
         * Etikett fuer eine Vorlesehilfe vier gleiche Elemente sind. Dazu die
         * Lage in Worten (`value`), damit ein Vorleseprogramm nicht nur weiss,
         * was es anfasst, sondern auch, wo es steht.
         *
         * Der vierzeilige Tooltip, der bis W10b an allen vier Griffen hing, ist
         * ersatzlos weg. Nutzerauftrag vom 2026-08-29: "diese Meldung nicht
         * anzeigen, das wird klar durch alles andere. Bitte an allen Bordern die
         * Meldung entfernen." Seit W8b traegt jeder Griff eine sichtbare Marke;
         * der Kasten erklaerte damit etwas, das man sieht, und verdeckte dabei
         * Inhalt. Der Grund steht ausfuehrlich im Kopf von src/layout/Splitter.tsx.
         */
        splitter: {
            left: t("width of the explorer"),
            explain: t("height of the explain area"),
            right: t("width of the understanding column"),
            twin: t("height of the twin against the graph"),
            value: (pixels: number): string => tr`${pixels} pixels`,
        },
        /**
         * Der Weg zurueck.
         *
         * Ein Befehl und ein Menuepunkt, und beide gehen durch dieselbe Funktion:
         * zwei Wege, die dasselbe TUN sollen, aber es getrennt tun, sind zwei
         * Wege, die auseinanderlaufen koennen.
         */
        reset: t("reset layout"),
        resetMenuLabel: t("[r]eset layout"),
        resetTooltip: t("atlas: put every zone back to the width and height it starts with (alt+r)"),
        resetCommandHint: t("press enter to put every zone back to its default size"),
    },

    /** Der Rahmen des Antwort-Panels. Seine Saetze stehen in chat-strings.ts. */
    chat: {
        panelLabel: t("CBM Lens chat"),
        depthGroupLabel: t("neighbourhood depth"),
        /*
         * `clear` bleibt der einzige Knopf, der loescht, und sagt es.
         *
         * Nutzerbefund vom 2026-08-29: das Panel liess sich nur ueber "clear"
         * loswerden, und damit war der Verlauf weg. Wer es nur wegklappen
         * wollte, hat ihn dafuer bezahlt. W7c hat daneben einen zweiten Knopf
         * gestellt, der nur zuklappt; seit W8 ist der Chat ein Reiter, und das
         * Zuklappen gehoert der Zone (messages.layout.collapse). Der
         * Unterschied, um den es dem Nutzer ging, ist damit nicht verschwunden,
         * sondern schaerfer geworden: die Zone klappt zu und behaelt alles,
         * dieser eine Knopf hier loescht, und er steht als einziger im Kopf des
         * Chats.
         */
        clear: t("clear"),
        clearTooltip:
            t("forget this session: every question and every answer in this panel is deleted. The history is in memory and nowhere else, so this cannot be undone. Folding the explain area away costs nothing; only this button deletes."),
        readPrefix: t("read: "),
        openCard: (path: string, line: number | undefined): string =>
            tr`open ${path}${line === undefined ? '' : `:${line}`}`,
        /** Die Ueberschrift ueber der Kandidatenliste. Ihr Satz steht in chat-strings.ts. */
        candidatesLabel: t("symbols this name reached"),
    },

    /** Was die Statusleiste ueber das Graph-Panel sagt. */
    galaxy: {
        noLayout: t("no layout"),
        /** The label of a coverage-only selection: a file the graph knows about, not a symbol. */
        coverageSelection: (name: string): string => tr`Coverage · ${name}`,
        nodeCount: (nodes: number, hidden: boolean): string =>
            tr`${nodes} nodes${hidden ? t(" (hidden)") : ''}`,
    },

    /**
     * Das Einstellungen-Panel (W10), ganz.
     *
     * Wie die Hilfe steht sein Text hier und nicht in der Komponente: es ist die
     * zweite lange zusammenhaengende Flaeche dieses Produkts, und verteilt auf
     * JSX waere sie wieder der Ort, an dem niemand mehr sieht, was das Produkt
     * ueber sich behauptet. Drei Dinge sind ausdruecklich so formuliert und
     * nicht anders:
     *
     * 1. **Kein Satz verspricht eine Wirkung.** Was eine Einstellung bringt,
     *    misst das Panel auf DIESER Maschine und schreibt zwei Zahlen daneben.
     *    Die Saetze hier beschreiben, was eine Einstellung TUT (welche Ebene
     *    wegfaellt, welcher Durchgang entfaellt), nicht, was sie einbringt.
     * 2. **Der Ehrlichkeitssatz sagt drei Dinge auf einmal**: dass der Befehl
     *    ins Netz geht, wohin er laedt, und dass diese Anwendung selbst nichts
     *    herunterlaedt. Alle drei zusammen, weil jeder fuer sich die Frage offen
     *    laesst, die der naechste beantwortet.
     * 3. **Der Grund fuer "kein Router" ist eine Messung und keine Vermutung.**
     *    Ein Einzel-Server ignoriert ein fremdes `model`-Feld stillschweigend;
     *    das wurde am 2026-08-29 gemessen, und der Satz sagt es so.
     */
    settings: {
        title: t("CBM LENS SETTINGS"),
        subtitle: t("which model answers, and everything that costs computing time"),
        panelLabel: t("settings"),
        close: t("[esc] close"),
        closeLabel: CLOSE,
        /** Der Eintrag in der Atlas-Zeile. Der Buchstabe steht in Klammern. */
        menuLabel: t("[s]ettings"),
        /** Was die Kommandozeile am rechten Rand sagt, wenn `settings` dasteht. */
        commandHint: t("press enter to open the settings"),

        /* ------------------------------------------------- das laufende Modell */

        modelTitle: t("The model that answers"),
        modelIntro:
            t("Every number in this block comes from the process that loaded the file. Point at one and it says which request it came from. A table of model sizes kept in this code would be right for a month and a claim about a file somebody swapped out after that."),
        rowName: t("name"),
        rowQuantization: t("quantisation"),
        rowContext: t("context"),
        rowWeights: t("weights"),
        sourceName: 'GET /props (model_path)',
        sourceQuantization: 'GET /props (model_ftype)',
        sourceContext: 'GET /props (n_ctx), GET /v1/models (meta.n_ctx_train)',
        sourceWeights: 'GET /v1/models (meta.size, meta.n_params)',
        sourceNameRouter: 'GET /props?model=<id> (model_path)',
        sourceQuantizationRouter: 'GET /props?model=<id> (model_ftype)',
        sourceContextRouter: 'GET /props?model=<id> (n_ctx), GET /v1/models (meta.n_ctx_train)',
        contextValue: (tokens: number, trained: number | undefined): string =>
            trained === undefined ? tr`${tokens} tokens` : tr`${tokens} of ${trained} trained tokens`,
        weightsValue: (size: string, billions: string | undefined): string =>
            billions === undefined ? size : tr`${size} for ${billions}B parameters`,
        /** Wenn der Prozess eine Angabe schuldig bleibt. Kein Platzhalter, ein Satz. */
        valueUnreported: t("the process did not report this"),

        offTitle: t("The local model is off, and this panel asks it nothing"),
        offText:
            t("Not one request goes to the sidecar while the model is off, not even to find out whether one is running. That is the whole meaning of the switch: an opt-out and not a different colour. Turn it on in the atlas menu with [l]ocal llm, and this block fills with the models in your cache, which one is answering, and a click to switch between them."),
        offStillWorks:
            t("Everything below about drawing works either way. It has nothing to do with a model."),
        notRunningTitle: t("The local model is on and nothing is listening"),
        notRunningText:
            t("This page has no backend and cannot start a process, so the sidecar is started from a shell. Without an argument it runs over your cache directory, and then the list below is a choice:"),
        startingText: t("A sidecar is loading its model. The numbers appear as soon as it answers."),
        blockedText:
            t("The committed policy of the indexed project denies the local model. This panel shows what it would show and asks nothing."),

        /* ------------------------------------------------- die Modelle im Cache */

        cacheTitle: t("The models in your cache"),
        cacheIntro:
            t("What the running process lists in its cache directory. It is read every time this panel opens, and again when you ask for it."),
        cacheEmpty: t("the process lists no model in its cache directory"),
        cacheCount: (count: number): string =>
            count === 1 ? t("1 model in the cache") : tr`${count} models in the cache`,
        modelAnswering: t("answering now"),
        modelLoaded: t("loaded"),
        modelUnloaded: t("in the cache, not loaded"),
        selectTitle: (name: string): string =>
            tr`send the next questions to ${name}. It stays chosen after a reload.`,
        selectedTitle: (name: string): string => tr`${name} is the model the next question goes to`,
        refresh: t("read the list again"),
        refreshTitle:
            t("ask the process for its model list once more. This is the only request this panel sends on its own, and it counts in the same probe counter as the card in the sidebar."),

        noRouterTitle: t("This sidecar serves one fixed file, so there is nothing to switch"),
        noRouterText:
            t("It was started with -m and a path. A sidecar in that shape ignores a different \"model\" field in a request SILENTLY: measured on 2026-08-29 against this build, a request naming another model came back with a normal answer from the loaded one, no error and no warning. A list to click here would therefore do nothing and say nothing about it, which is worse than no list."),
        noRouterHow:
            t("Start it over your cache directory instead. Then /v1/models lists what lies there, the \"model\" field really chooses, and this block becomes a choice:"),

        /* ------------------------------------------------- eins dazuholen */

        fetchTitle: t("Getting another model"),
        honesty:
            t("This line goes out to the network: it downloads from huggingface.co and writes the file into the model cache of this project, models/ next to the repository (ATLAS_MODELS_DIR or LLAMA_CACHE move it elsewhere). This application downloads nothing itself. It has no backend, it starts no process and it writes no file; what it can do is hand you the line and read the cache again afterwards."),
        noProgressBar:
            t("There is no progress bar here because this window cannot see the download. A bar over a transfer that another process is running would be an animation, not a measurement."),
        suggestionsTitle: t("The six this project measured"),
        suggestionsIntro:
            t("Six files, 44 questions, temperature 0, seed 42, one machine, one day (verification/w5/eval.json, the table in docs/adr/0001-modellwahl.md). That is what is known about these six and it is not a statement about any other model or any other machine. The field below takes any repository."),
        columnModel: t("model"),
        columnClass: t("class"),
        columnPass: t("questions passed"),
        columnCitation: t("citations kept"),
        columnSpeed: t("speed"),
        columnSize: t("size"),
        classValue: (label: string): string =>
            label === 'B' ? t("B, 8192 tokens of context") : t("A, 3072 tokens of context"),
        passValue: (percent: string, questions: number): string => tr`${percent} of ${questions}`,
        citationValue: (percent: string): string => tr`${percent} of the answers`,
        unmeasuredValue: (count: number): string =>
            count === 1
                ? t("1 answer could not be measured for citations")
                : tr`${count} answers could not be measured for citations`,
        /*
         * Der Fall, den es heute wirklich gibt: verification/w5/eval.json stammt
         * von vor der Aenderung an der Zitatpruefung (W10, AC8) und fuehrt das
         * Feld nicht. Eine Null waere hier die Behauptung, es habe keine
         * ungemessene Antwort gegeben, und genau das weiss niemand.
         */
        unmeasuredMissing: t("the recorded run does not report unmeasured answers"),
        speedValue: (tokens: string): string => tr`${tokens} tokens/s`,
        repoTitle: (repo: string): string => tr`on Hugging Face: ${repo}`,
        copy: t("copy"),
        copying: t("copying..."),
        copyTitle: t("copy this line to the clipboard"),
        copied: t("copied to the clipboard"),
        copyFailed: t("the clipboard refused. The line stands above as text and can be selected."),

        freeTitle: t("Any other repository"),
        freeIntro:
            t("The shape is user/repo, with an optional :quant behind it. Only the shape is checked here. Whether the repository exists is something only huggingface.co knows, and this window does not talk to it."),
        freeLabel: t("a Hugging Face repository"),
        freePlaceholder: t("user/repo or user/repo:quant"),
        freeEmpty: t("type a repository, for example unsloth/Qwen3.5-9B-GGUF"),
        freeShape:
            t("that is not the shape of a repository id. It is user/repo, with an optional :quant behind it, and letters, digits, dots, dashes and underscores in the two names."),
        freeOk: t("the shape is right. Whether it exists is decided by huggingface.co, not by this field."),

        /* ------------------------------------------------- Darstellung und Leistung */

        displayTitle: t("Drawing, and what it costs"),
        displayIntro:
            t("Everything that costs computing time is in this block and only here. Each switch says what it does to the scene, and once you use it, what it did on THIS machine: frames per second before, frames per second after, on the scene that was on the screen. No switch here promises anything."),
        displayStored: (key: string): string => tr`kept in this browser under ${key}`,
        liveValue: (fps: string): string => tr`${fps} frames/s right now`,
        liveIdle:
            t("the graph is not drawing right now, so there is nothing to measure. Open the graph panel with [a]tlas and the counter starts."),
        liveScene: (nodes: number, edges: number): string => tr`${nodes} nodes, ${edges} edges`,

        measureIdle: t("not measured yet"),
        measureRunning: t("measuring, one window before and one after"),
        measureNotDrawing:
            t("nothing was drawn while this changed, so nothing was measured: the graph panel is folded away and its render loop stands still."),
        measureNoDifference: (before: string, after: string, band: string): string =>
            tr`before ${before} frames/s, after ${after} frames/s. That is inside the spread this machine shows without any change at all (${band} frames/s), so there is no measurable difference here.`,
        measureHigher: (before: string, after: string, band: string): string =>
            tr`before ${before} frames/s, after ${after} frames/s, past the ${band} frames/s this machine wobbles by on its own.`,
        measureLower: (before: string, after: string, band: string): string =>
            tr`before ${before} frames/s, after ${after} frames/s, past the ${band} frames/s this machine wobbles by on its own.`,
        measureScene: (nodes: number, edges: number, at: string): string =>
            tr`measured on ${nodes} nodes and ${edges} edges at ${at}`,

        settingProjection: t("view"),
        settingProjectionDetail:
            t("the flat view is an orthographic camera looking down the z axis. It drops the third axis instead of foreshortening it, and the controls lose their rotation; panning and zooming stay."),
        valueSpatial: '3D',
        valueFlat: '2D',
        settingHalos: t("landmark halos"),
        settingHalosDetail:
            t("the glow around the biggest hubs. It is an extra sprite layer drawn over the cloud."),
        settingBloom: t("bloom"),
        settingBloomDetail:
            t("the post-processing pass that makes bright points glow. It renders the scene a second time into a smaller buffer and blurs it."),
        settingEdges: t("edges"),
        settingEdgesDetail:
            t("none does not draw the edge layer at all. Dimming it to nothing would cost the same and only look cheaper."),
        valueEdgesFull: t("all"),
        valueEdgesDim: t("dim"),
        valueEdgesOff: t("none"),
        settingLabels: t("labels"),
        settingLabelsDetail:
            t("names beyond this distance from the camera are not drawn. Each name carries its own texture and its own draw call. Until now their visibility depended on node size alone and the camera did not come into it."),
        valueLabelsAll: t("all of them"),
        valueLabelsFar: t("within twice the scene radius"),
        valueLabelsNear: t("within the scene radius"),
        settingFrameCap: t("frame ceiling"),
        settingFrameCapDetail:
            t("with a ceiling the render loop is driven by a clock instead of by the screen, so a machine that cannot reach 60 stops trying. Without one it runs exactly as it did before this panel existed."),
        valueCapOff: t("none"),
        valueCap: (fps: number): string => tr`${fps} per second`,
        settingAgents: t("live agent layer"),
        settingAgentsDetail:
            t("the glowing bodies that orbit the symbol an agent is working on, and their search pings and test lines. Each actor is one element that is placed again in every frame. Off draws none of it; the instrument in the corner stays and says so."),
        settingAgentTails: t("agent comet tails"),
        settingAgentTailsDetail:
            t("the short trail right behind a body while it flies from one symbol to the next. One line of twelve points per actor, refilled in every frame of the flight. Off leaves the flight itself untouched."),
        settingAgentTrails: t("agent trails"),
        settingAgentTrailsDetail:
            t("the dashed line through the last symbols an actor touched, drawn under the real edges. Up to ten nodes per actor and 120 segments in total; a dashed line needs its own length computation per point. It is the reading that shows whether someone follows a call path or jumps across the repository, so it is the last one to switch off."),
        settingAgentWaves: t("agent write waves"),
        settingAgentWavesDetail:
            t("one concentric wave per burst of writes on the same symbol. One per burst, not one per event: a wave per event would be a firework and say nothing."),
        settingAgentTimeline: t("agent timeline"),
        settingAgentTimelineDetail:
            t("the strip under the graph: one track per actor, one tick per event, redrawn on every tick of the instrument clock. It only appears when the graph area is at least 600 px wide; narrower than that, one tick cannot be told from the next."),
        switchOn: t("on"),
        switchOff: t("off"),

        profileTitle: t("Both at once"),
        profileThrifty: t("thrifty profile"),
        profileThriftyDetail:
            t("sets the flat view, no halos, no bloom, dim edges, labels within the scene radius, a ceiling of 30 and no agent tails, trails, waves or timeline, in one step. Fullscreen keeps working after it, only quieter."),
        profileDefault: t("back to the default"),
        profileDefaultDetail: t("puts every switch in this block back to what it starts with."),
        profileIsDefault: t("every switch is on its default"),
        profileChanged: t("this differs from the default"),

        keepsTitle: t("What stays where it is"),
        keepsText:
            t("Switches that only change what you see and cost nothing to draw stay in their own panels: the detail level of the twin, the legend, the galaxy and hierarchy switch, and the edge-kind filters inside the legend. The point was to bundle the expensive things, not to build a menu that everything disappears into."),
    },

    /**
     * The projects panel: the one surface that asks the server to write.
     *
     * Its text lives here, like the settings panel's, because it speaks about
     * the product as a whole (what is indexed, what the server is doing) and
     * not about one subject area.
     */
    projects: {
        title: t("CBM LENS PROJECTS"),
        subtitle: t("what this server has indexed, and how to give it more"),
        panelLabel: t("projects"),
        close: t("[esc] close"),
        closeLabel: CLOSE,
        /** The entry in the atlas row. The letter sits in brackets. */
        menuLabel: t("[p]rojects"),
        /** The atlas row entry that opens this panel to index a repository; alt+p opens it as well. */
        addIndexLabel: t("Add project index"),
        addIndexTitle: t("Choose a repository folder to index"),

        /* ------------------------------------------------------- the list */

        listTitle: t("Projects on this server"),
        listSource: t("read from list_projects over /rpc"),
        listLoading: t("asking the server ..."),
        listEmpty:
            t("nothing is indexed yet. Index a repository below, or on the command line: codebase-memory-mcp cli index_repository"),
        listError: (detail: string): string => tr`the list did not arrive: ${detail}`,
        refresh: t("refresh"),
        openNow: t("open now"),
        open: t("open"),
        openTitle: (name: string): string => tr`open ${name}: the page reloads with ?project=${name}`,
        counts: (nodes: number, edges: number): string => tr`${nodes} sym, ${edges} edg`,
        countsUnknown: t("counts not sent"),
        check: t("check"),
        checkTitle: t("GET /api/project-health: does the index file open, and what does it hold"),
        healthHealthy: (nodes: number, edges: number, mb: string): string =>
            tr`healthy: ${nodes} symbols, ${edges} edges, ${mb} MB on disk`,
        healthMissing: t("missing: the server has no index file under this name"),
        healthCorrupt: (reason: string): string => tr`corrupt: ${reason}`,
        healthUnknown: t("the server answered with a verdict this panel does not know"),
        reindex: t("reindex"),
        reindexTitle: (root: string): string => tr`POST /api/index for ${root}: rebuilds the index in the background`,
        noRoot: t("root path not sent by the server; reindex from the form below"),
        remove: t("delete"),
        removeTitle: t("DELETE /api/project: removes the index file, never the repository"),
        removeArmed: (name: string): string =>
            tr`delete the index of ${name}? The repository on disk stays as it is.`,
        removeConfirm: t("yes, delete the index"),
        cancel: t("cancel"),
        removed: (name: string): string => tr`${name}: index deleted`,
        removeError: (detail: string): string => tr`not deleted: ${detail}`,

        /* ------------------------------------------------------- the form */

        indexTitle: t("Index a repository"),
        indexIntro:
            t("The server does the indexing; this window only asks. The path has to be a folder the server may read (its workspace boundary applies), and the job runs in the background while you keep reading."),
        pathLabel: t("repository path"),
        pathPlaceholder: '/absolute/path/to/repository',
        browse: t("browse"),
        browseTitle: t("GET /api/browse: list the folders under this path"),
        browseClose: t("close browser"),
        browseAt: (path: string): string => tr`folders in ${path}`,
        browseUp: t("up one level"),
        browseUse: t("use this folder"),
        browseEmpty: t("no folders here"),
        browseError: (detail: string): string => tr`browsing failed: ${detail}`,
        nameLabel: t("project name"),
        nameHint: t("suggested from the last path segment; change it if you like"),
        start: t("index"),
        startTitle: t("POST /api/index: start a background job for this path"),
        started: (path: string): string => tr`job accepted for ${path}; its state appears below`,
        startError: (detail: string): string => tr`the server refused: ${detail}`,
        jobsTitle: t("Index jobs since the server started"),
        jobsSource: (seconds: string): string =>
            tr`read from GET /api/index-status, asked again every ${seconds} s while a job runs`,
        jobsNone: t("no job has run yet"),
        jobIndexing: t("indexing"),
        jobDone: t("done"),
        jobError: (error: string): string => tr`failed: ${error}`,
        jobUnknown: t("state not known to this panel"),

        /* -------------------------------------------------------- the adr */

        adrTitle: t("Decision record"),
        adrOpen: t("Open ADR"),
        adrIntro: (project: string): string =>
            tr`The architecture decision record the server keeps for ${project}, as markdown. Saving stores it in the project index; a reindex keeps it.`,
        adrNoProject: t("open a project to read or write its decision record"),
        adrLoading: t("reading ..."),
        adrNone: t("no record yet; what you save here becomes the first one"),
        adrUpdated: (at: string): string => tr`last saved ${at}`,
        adrLabel: t("decision record, markdown"),
        adrSave: t("save"),
        adrSaveTitle: t("POST /api/adr: store this text for the open project"),
        adrSaved: t("saved"),
        adrBusy: t("the project is being indexed right now; save again when the job is done"),
        adrError: (detail: string): string => tr`not saved: ${detail}`,
        adrReadError: (detail: string): string => tr`the record did not arrive: ${detail}`,

        /* ----------------------------------------------------- the server */

        serverTitle: t("This server"),
        processesSource: t("read from GET /api/processes"),
        processesSelf: (pid: number, mb: string): string => tr`serving this page: pid ${pid}, ${mb} MB resident`,
        processesOthers: (count: number): string =>
            count === 1 ? t("one other codebase-memory-mcp process") : tr`${count} other codebase-memory-mcp processes`,
        processesNone: t("no other codebase-memory-mcp process is running"),
        processRow: (pid: number, cpu: string, mb: string, elapsed: string): string =>
            tr`pid ${pid}: ${cpu}% cpu, ${mb} MB, up ${elapsed}`,
        processesError: (detail: string): string => tr`the process list did not arrive: ${detail}`,
        logsTitle: t("Log tail"),
        logsSource: (shown: number, total: number): string => tr`read from GET /api/logs: ${shown} of ${total} lines`,
        logsEmpty: t("the log ring is empty"),
        logsError: (detail: string): string => tr`the log did not arrive: ${detail}`,
        uiLogTitle: t("Frontend log"),
        uiLogSource: (shown: number, total: number, path: string): string =>
            tr`read from GET /api/ui-log: ${shown} of ${total} lines of ${path}`,
        uiLogPrevious: (path: string): string => tr`Local compatibility export archive: ${path}; retained history is read from SQLite.`,
        uiLogAbout:
            t("This page records console output, uncaught errors and failed requests in the daemon’s local SQLite journal. The JSONL file remains a bounded compatibility export. Review any content before sharing it; nothing is published automatically."),
        uiLogEmpty: t("nothing recorded yet"),
        uiLogError: (detail: string): string => tr`the frontend log did not arrive: ${detail}`,
        reload: t("reload"),
    },

    /** Der Rahmen des Twins. Seine Fakten-Saetze stehen in twin/strings.ts. */
    twin: {
        /** Das Etikett des Leseprofils, mit dem dieses Produkt startet. */
        profileLabel: t("CBM Lens Twin"),
        /** Der Kopf des Panels, solange kein Symbol vor dem Leser steht. */
        noSymbol: t("no symbol"),
    },
} as const;

export type Messages = typeof messages;
