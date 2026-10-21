import { t } from '../i18n/translate';
/** Source-audited inputs whose owner is outside the running daemon. */
const EXTERNAL_INPUTS = [
    { title: t("Project discovery"), timing: t("Next index"), description: t("Repository files stay the source of truth. Edit these in the repository, then reindex the project."), items: [
        ['.codebase-memory.json', t("extra_extensions maps file extensions to parser languages; project mappings win over global mappings.")],
        ['.cbmignore', t("Gitignore-style inclusion and exclusion rules, within the discovery safety boundaries.")],
        ['.gitignore · .git/info/exclude · Git global excludes', t("Git-owned exclusion rules also affect discovery.")],
    ] },
    { title: t("Global language mappings"), timing: t("Next index"), description: t("This file is separate from the daemon UI configuration."), items: [
        ['$XDG_CONFIG_HOME/codebase-memory-mcp/config.json', t("extra_extensions; falls back to ~/.config/codebase-memory-mcp/config.json on Unix, or %APPDATA%/codebase-memory-mcp/config.json on Windows.")],
    ] },
    { title: t("Launch & access"), timing: t("Launch or explicit authorization"), description: t("Process locations and access grants cannot be safely changed from the configuration they locate or protect."), items: [
        ['CBM_CACHE_DIR · CBM_RUNTIME_DIR', t("Choose the index/configuration store and daemon coordination directory before starting CBM.")],
        ['--tool-profile=analysis|scout', t("Restricts the tools available to an MCP session.")],
        ['allow-root · .cbmpathwhitelist · approved_manifests', t("Explicit workspace and manifest authorizations, not ordinary settings.")],
        ['cli --quiet · --progress · --verbose · --json', t("Presentation choices for one command.")],
        ['--profile', t("Explicit profiling for one process; the persisted CBM_PROFILE setting controls its default.")],
    ] },
    { title: t("Installation & wrappers"), timing: 'Installation', description: t("These select where CBM or integrations are installed. They are not forwarded from the browser to an executable."), items: [
        ['install --dir · --clients · --skip-config · --skip-binary', t("Installation destination and integration selection. Force, reset-indexes, plan, and dry-run are operations.")],
        ['CBM_DOWNLOAD_URL', t("Installer download source.")],
        ['CLAUDE_CONFIG_DIR · CODEX_HOME · KIRO_HOME · HERMES_HOME · QWEN_HOME · CLINE_DATA_DIR', t("Agent integration locations.")],
        ['OPENCLAW_HOME · OPENCLAW_STATE_DIR · OPENCLAW_PROFILE · OPENCLAW_CONFIG_PATH · OPENCLAW_WORKSPACE_DIR', t("OpenClaw installation targets.")],
        ['OPENCODE_CONFIG · OPENCODE_CONFIG_DIR · COPILOT_HOME · CRUSH_GLOBAL_CONFIG · VIBE_HOME · GROK_HOME', t("Other integration locations.")],
        ['OMP_PROFILE · PI_CODING_AGENT_DIR · GLAB_CONFIG_DIR · KIMI_CODE_HOME', t("Additional integration discovery inputs.")],
        ['CBM_CONTINUE_CONFIG_PATH · CBM_TRAE_CONFIG_PATH · CBM_ROO_CONFIG_PATH · CBM_CODY_CONFIG_PATH', t("Explicit editor configuration targets.")],
        ['HOME · USERPROFILE · APPDATA · LOCALAPPDATA · XDG_CONFIG_HOME · XDG_CACHE_HOME · PATH · SHELL · COMSPEC · TEMP · TMP · TMPDIR', t("Operating-system and wrapper locations. Current process values are not exposed here.")],
    ] },
    { title: t("Browser & view controls"), timing: t("This browser"), description: t("Display, render budgets, motion, and architecture preferences are editable in Browser. Selection, trace filters, and navigation stay in their views."), items: [
        ['workspace · project', t("URL navigation takes precedence over the remembered workspace.")],
        ['codeatlasClosureDepth · codeatlasClosureCap', t("Hierarchy URL defaults: depth 3 (maximum 6), cap 15 (maximum 60); applies when opening the page.")],
        [t("Panel layout · legend · reading level"), t("Project panel sizes and legend state are adjusted in the view. Legacy reading-level preferences affect the legacy reader.")],
        ['VITE_EXPERIMENTAL_AGENTS', t("Build-time opt-in for the experimental agent workspace. It requires a rebuilt frontend.")],
    ] },
    { title: t("External agent hooks & legacy sidecar"), timing: t("External process"), description: t("These belong to separately launched tools. Browser model configuration uses Local agent instead."), items: [
        ['ATLAS_TRACE_FILE · ATLAS_DAEMON_URL · ATLAS_PROJECT · ATLAS_AGENT_NAME', t("Experimental agent-hook destination and attribution. Editing daemon settings does not install or configure hooks.")],
        ['ATLAS_MODELS_DIR · LLAMA_CACHE · ATLAS_MODELS_MAX · ATLAS_MODEL · ATLAS_CTX', t("Legacy llama sidecar launch settings. The sidecar is not the active browser agent.")],
        ['.codeatlas/policy.json · atlas-llm · atlas-model', t("Legacy sidecar policy/preferences, not browser-model controls.")],
    ] },
    { title: t("Development & internal controls"), timing: t("Not a product override"), description: t("Build/test inputs and recovery controls are deliberately excluded from editable runtime settings."), items: [
        [t("CBM_ARCH · CBM_NO_CCACHE · compiler/linker/sanitizer options"), t("Build-machine configuration.")],
        ['CBM_THREAD_STACK_MB · CBM_FUZZ_SEED · CBM_COMPOSITION_FIXTURE · CBM_SMOKE_ARTIFACT_DIR · CBM_CHECK_UI_ABSENT', t("Sanitizer, test and smoke-run inputs.")],
        [t("CBM_TEST_* · worker marker/quarantine paths · CBM_INDEX_SINGLE_THREAD"), t("Fault injection or supervisor-owned recovery state.")],
    ] },
] as const;

export default function ConfigReference() {
    return <div className="cbm-config-reference"><p>{t("Other configuration inputs found in the repository, grouped by the system that owns them. These are references, not editable overrides.")}</p>
        {EXTERNAL_INPUTS.map(group => <details key={group.title}><summary>{group.title}<span>{group.timing}</span></summary><p>{group.description}</p><dl>{group.items.map(([name, description]) => <div key={name}><dt>{name}</dt><dd>{description}</dd></div>)}</dl></details>)}
    </div>;
}
