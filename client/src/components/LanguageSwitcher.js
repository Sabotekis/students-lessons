import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import "./sidebar.css";

const LanguageSwitcher = ({ variant = "default" }) => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const switcherRef = useRef(null);

    const languages = [
        { code: "en", label: "English", countryCode: "GB" },
        { code: "lv", label: "Latviešu", countryCode: "LV" },
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className={`language-switcher--${variant}`} ref={switcherRef}>
            <button
                className={`language-switcher-button--${variant}`}
                onClick={() => setOpen(!open)}
            >
                <ReactCountryFlag
                    countryCode={currentLang.countryCode}
                    svg
                    className={`language-switcher-flag--${variant}`}
                    title={currentLang.label}
                />
                {currentLang.label}
                <span className={`language-switcher-arrow--${variant}`}>▼</span>
            </button>
            {open && (
                <div className={`language-switcher-dropdown--${variant}`}>
                    {languages.map(lang => (
                        <div
                            key={lang.code}
                            className={`language-switcher-option--${variant}${i18n.language === lang.code ? " selected" : ""}`}
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setOpen(false);
                            }}
                        >
                            <ReactCountryFlag
                                countryCode={lang.countryCode}
                                svg
                                className={`language-switcher-flag--${variant}`}
                                title={lang.label}
                            />
                            {lang.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;