import { useTranslation } from "react-i18next";
import styles from '../styles.module.css';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        window.location.reload();
    };

    return (
        <div className={styles.LanguageSwitcher}>
            <button
                className={i18n.language === 'en' ? styles.langActive : styles.langButton}
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>
            <button
                className={i18n.language === 'fi' ? styles.langActive : styles.langButton}
                onClick={() => changeLanguage('fi')}
            >
                FI
            </button>
        </div>
    );
}