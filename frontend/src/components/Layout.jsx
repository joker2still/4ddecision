import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "./BrandLogo.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function Layout() {
  const { copy, language, setLanguage } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef(null);
  const navItems = [
    { to: "/", label: copy.nav.home, end: true },
    { to: "/result", label: copy.nav.result },
  ];
  const languageButtonLabel = isLanguageOpen
    ? copy.brand.current
    : copy.brand.language;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!languageRef.current?.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="page">
        <header className="topbar">
          <BrandLogo />

          <div className="toolbar">
            <div className="language-control" ref={languageRef}>
              <button
                aria-expanded={isLanguageOpen}
                aria-haspopup="listbox"
                className={`nav-link language-button${isLanguageOpen ? " active" : ""}`}
                onClick={() => setIsLanguageOpen((current) => !current)}
                type="button"
              >
                {languageButtonLabel}
              </button>

              {isLanguageOpen ? (
                <div className="language-menu" role="listbox">
                  <button
                    className="language-option"
                    onClick={() => {
                      setLanguage(language === "en" ? "zh" : "en");
                      setIsLanguageOpen(false);
                    }}
                    type="button"
                  >
                    {copy.brand.other}
                  </button>
                </div>
              ) : null}
            </div>

            <nav className="nav" aria-label="Primary">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  end={item.end}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
