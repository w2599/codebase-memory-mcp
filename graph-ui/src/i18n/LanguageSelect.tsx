import { t } from './translate';
import { getLocalePreference, setLocalePreference } from './locale';
import type { LocalePreference } from './locale';
import './language-select.css';

export function LanguageSelect() {
    return <label className="atlas-language-select">
        <span>{t('Language')}</span>
        <select aria-label={t('Interface language')} defaultValue={getLocalePreference()} onChange={event => {
            setLocalePreference(event.currentTarget.value as LocalePreference);
            window.location.reload();
        }}>
            <option value="auto">{t('Automatic')}</option>
            <option value="zh">简体中文</option>
            <option value="en">English</option>
        </select>
    </label>;
}
