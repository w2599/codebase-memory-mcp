export interface LocalizationIssue { file: string; line: number; key: string; rule: string }
export function scanLocalization(): { issues: LocalizationIssue[]; countUnits: string[]; files: number };
