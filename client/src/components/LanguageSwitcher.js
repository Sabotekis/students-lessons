import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { Dropdown } from "react-bootstrap";
import "./switcher.css";

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

    if (variant === "login") {
        return (
            <Dropdown ref={switcherRef}>
                <Dropdown.Toggle 
                    variant="outline-primary" 
                    size="sm"
                    className="d-flex align-items-center"
                    style={{
                        backgroundColor: 'lightgray',
                        borderColor: '#444',
                        color: '#000'
                    }}
                >
                    <ReactCountryFlag
                        countryCode={currentLang.countryCode}
                        svg
                        style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
                        title={currentLang.label}
                    />
                    {currentLang.label}
                </Dropdown.Toggle>

                <Dropdown.Menu
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '0',
                        margin: '0',
                        minWidth: '0'
                    }}
                >
                    {languages.map(lang => (
                        <Dropdown.Item
                            key={lang.code}
                            active={i18n.language === lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            className="d-flex align-items-center"
                            style={{
                                backgroundColor: i18n.language === lang.code ? 'lightgray' : 'transparent',
                                color: i18n.language === lang.code ? 'green' : '#000',
                                padding: '8px 12px',
                                margin: '0',
                                border: 'none',
                                borderRadius: '0'
                            }}
                            onMouseEnter={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.target.style.backgroundColor = 'lightgray';
                                    e.target.style.color = 'green';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#000';
                                }
                            }}
                        >
                            <ReactCountryFlag
                                countryCode={lang.countryCode}
                                svg
                                style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
                                title={lang.label}
                            />
                            {lang.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    if (variant === "sidebar") {
        return (
            <Dropdown ref={switcherRef}>
                <Dropdown.Toggle 
                    variant="outline-light" 
                    size="sm"
                    className="d-flex align-items-center border-0"
                    style={{
                        backgroundColor: 'rgba(21, 23, 28, 0)',
                        borderColor: '#444',
                        color: '#fff'
                    }}
                >
                    <ReactCountryFlag
                        countryCode={currentLang.countryCode}
                        svg
                        style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
                        title={currentLang.label}
                    />
                    {currentLang.label}
                </Dropdown.Toggle>

                <Dropdown.Menu
                    style={{
                        backgroundColor: 'rgba(21, 23, 28, 0.98)',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        padding: '0',
                        margin: '0',
                        minWidth: '0'
                    }}
                >
                    {languages.map(lang => (
                        <Dropdown.Item
                            key={lang.code}
                            active={i18n.language === lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                            className="d-flex align-items-center"
                            style={{
                                backgroundColor: i18n.language === lang.code ? '#252831' : 'transparent',
                                color: i18n.language === lang.code ? '#4CAF50' : '#fff',
                                padding: '8px 12px',
                                margin: '0',
                                border: 'none',
                                borderRadius: '0'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#252831';
                                e.target.style.color = '#4CAF50';
                            }}
                            onMouseLeave={(e) => {
                                if (i18n.language !== lang.code) {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#fff';
                                } else {
                                    e.target.style.backgroundColor = '#252831';
                                    e.target.style.color = '#4CAF50';
                                }
                            }}
                        >
                            <ReactCountryFlag
                                countryCode={lang.countryCode}
                                svg
                                style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
                                title={lang.label}
                            />
                            {lang.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

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