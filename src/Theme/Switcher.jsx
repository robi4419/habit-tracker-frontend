import { useState, useRef, useEffect } from "react";
import { useTheme, lightThemes, darkThemes } from "./context";
import { IoColorPaletteOutline } from "react-icons/io5";

function ThemeSection({ title, themes, activeTheme, onSelect }) {
  return (
    <div className="theme-section">
      <p className="theme-dropdown-label">{title}</p>
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          className={`theme-option ${activeTheme === key ? "active" : ""}`}
          onClick={() => onSelect(key)}
        >
          <span
            className="theme-swatch"
            style={{ background: theme["--accent"] }}
          />
          <span
            className="theme-swatch"
            style={{ background: theme["--bg"] }}
          />
          {theme.name}
        </button>
      ))}
    </div>
  );
}

function ThemeSwitcher() {
  const { activeTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key) => {
    setTheme(key);
    setOpen(false);
  };

  return (
    <div className="theme-switcher" ref={ref}>
      <button
        className="theme-toggle-btn"
        onClick={() => setOpen((prev) => !prev)}
        title="Change theme"
      >
        <IoColorPaletteOutline />
      </button>
      {open && (
        <div className="theme-dropdown">
          <div className="theme-columns">
            <ThemeSection
              title="Light"
              themes={lightThemes}
              activeTheme={activeTheme}
              onSelect={handleSelect}
            />
            <div className="theme-column-divider" />
            <ThemeSection
              title="Dark"
              themes={darkThemes}
              activeTheme={activeTheme}
              onSelect={handleSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
