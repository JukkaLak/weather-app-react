import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from '../styles.module.css';

export default function Navigation() {
    const location = useLocation();
    const { t } = useTranslation();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <h1 className={styles.navTitle}>{t('nav.title')}</h1>
                <div className={styles.navLinks}>
                    <Link
                      to="/"
                      className={location.pathname === '/' ? styles.navLinkActive : styles.navLink}
                    >
                        {t('nav.currentWeather')}
                    </Link>
                    <Link
                      to="/forecast"
                      className={location.pathname === '/forecast' ? styles.navLinkActive : styles.navLink}
                    >
                        {t('nav.forecast')}
                    </Link>
                </div>
                <LanguageSwitcher />
            </div>
        </nav>
    )
}