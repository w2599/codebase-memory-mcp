import { t, tr } from '../i18n/translate';
/**
 * The words of the selection context where it reads a Galaxy scope (hand test
 * K13). Every sentence names where the relationships come from and what the
 * scope leaves out; nothing here claims completeness the scope does not have.
 */
const byType = (types: readonly [string, number][]) => types.map(([type, count]) => `${type} ${count.toLocaleString()}`).join(' · ');

export const selectionScopeText = {
    selectSomething: t("Select a file or symbol to inspect its indexed connections."),
    readSource: t("Read source evidence"),
    incoming: (count: number, types: readonly [string, number][]) =>
        tr`Incoming relationships · ${count.toLocaleString()}${types.length ? ` (${byType(types)})` : ''}`,
    outgoing: (count: number, types: readonly [string, number][]) =>
        tr`Outgoing relationships · ${count.toLocaleString()}${types.length ? ` (${byType(types)})` : ''}`,
    fromScope: (depth?: number) => tr`From the loaded Galaxy scope${depth ? ` (${depth === 1 ? t("1 layer") : tr`${depth} layers`})` : ''}, every indexed relationship type.`,
    fromSnapshot: t("From the repository map snapshot. It is capped and can miss relationships that the Galaxy scope shows; select the symbol in Galaxy to load them."),
    loading: t("The scope is still loading: relationships may be missing until it is complete."),
    partial: (layer: number, limit: 'nodes' | 'edges') => tr`Layer ${layer} of this scope stopped at the render limit (${limit}). `
        + (layer > 1 ? t("The direct relationships of the root are complete; deeper ones may be missing.") : t("The direct relationships of the root are incomplete.")),
    notTraced: (direction: 'inbound' | 'outbound') =>
        tr`${direction === 'outbound' ? t("Incoming") : t("Outgoing")} relationships are not traced in this scope (${direction === 'outbound' ? t("outgoing") : t("incoming")} only).`,
    typesOnly: (types: readonly string[]) => tr`Only these relationship types are traced: ${types.length ? types.join(', ') : t("none")}.`,
};
