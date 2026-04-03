"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-20 right-4 z-50 group"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-14 h-7 rounded-full bg-shadow/40 dark:bg-bone/10 light:bg-void/10 border border-white/10 shadow-lg backdrop-blur-sm transition-colors duration-500 overflow-hidden">
        {/* Track background glow */}
        <div
          className="absolute inset-0 rounded-full transition-opacity duration-500"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(7,4,22,0.8), rgba(68,56,89,0.4))"
              : "linear-gradient(135deg, rgba(253,242,225,0.6), rgba(213,96,71,0.2))",
          }}
        />

        {/* Sliding knob */}
        <div
          className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.4,0.27,1.4)]"
          style={{
            left: isDark ? "2px" : "calc(100% - 26px)",
            background: isDark
              ? "linear-gradient(135deg, #443859, #69354c)"
              : "linear-gradient(135deg, #d56047, #ce7267)",
            boxShadow: isDark
              ? "0 0 10px rgba(213,96,71,0.3), 0 2px 4px rgba(0,0,0,0.3)"
              : "0 0 10px rgba(213,96,71,0.4), 0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {/* Moon icon (dark mode) */}
          <svg
            className="w-3.5 h-3.5 transition-all duration-500"
            style={{
              opacity: isDark ? 1 : 0,
              transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
              position: "absolute",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fdf2e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>

          {/* Sun icon (light mode) */}
          <svg
            className="w-3.5 h-3.5 transition-all duration-500"
            style={{
              opacity: isDark ? 0 : 1,
              transform: isDark ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
              position: "absolute",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fdf2e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>
      </div>

      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-[10px] font-medium rounded bg-shadow/80 text-bone/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
