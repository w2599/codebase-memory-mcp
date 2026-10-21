import { t } from '../i18n/translate';
import { useState } from 'react';

/** Clipboard writes occur only on the explicit button click. Nothing is executed or sent. */
export default function LocalEvidenceCommand({ command, label = t("Copy local command") }: { command: string; label?: string }) {
    const [result, setResult] = useState<{ command: string; message: string }>();
    const copy = async () => {
        try {
            if (!navigator.clipboard?.writeText) throw new Error(t("Clipboard unavailable. Select the command below and copy it manually."));
            await navigator.clipboard.writeText(command);
            setResult({ command, message: t("Command copied locally. Nothing was executed or sent.") });
        } catch (error) {
            setResult({ command, message: error instanceof Error ? error.message : t("Could not copy. Select the command and copy it manually.") });
        }
    };
    return <div className="local-evidence-command">
        <button type="button" disabled={!command} onClick={() => { void copy(); }}>{label}</button>
        <code tabIndex={0}>{command}</code>
        {result?.command === command && <span role="status">{result.message}</span>}
    </div>;
}
