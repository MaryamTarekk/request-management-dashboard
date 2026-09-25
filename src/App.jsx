import { Outlet } from "react-router-dom";
import { Moon, Sun, Workflow } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./app/theme";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./components/LanguageToggle";
import ApiSimulation from "./components/ApiSimulation";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        transition-colors
        duration-300
        dark:bg-[#0b1120]
        dark:text-slate-100
      "
    >
      {/* Header */}
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          overflow-visible
          border-b
          border-slate-200
          bg-white
          text-slate-900
          shadow-lg
          shadow-slate-900/5
          transition-colors
          duration-300
          dark:border-slate-800
          dark:bg-[#0f172a]
          dark:text-white
          dark:shadow-slate-900/10
        "
      >
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="
              absolute
              -left-16
              -top-20
              h-40
              w-40
              rounded-full
              bg-indigo-500/10
              blur-3xl
              dark:bg-indigo-600/20
            "
          />

          <div
            className="
              absolute
              -right-16
              -top-20
              h-40
              w-40
              rounded-full
              bg-violet-500/10
              blur-3xl
              dark:bg-violet-600/20
            "
          />
        </div>

        <div
          className="
            relative
            flex
            min-h-[76px]
            items-center
            justify-between
            gap-3
            px-3
            py-3
            sm:px-6
            lg:px-8
          "
        >
          {/* Logo + Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-violet-600
                text-white
                shadow-lg
                shadow-indigo-500/20
                sm:h-12
                sm:w-12
                sm:rounded-2xl
              "
            >
              <Workflow size={25} strokeWidth={2.2} />
            </div>

            <div
              className="
                min-w-0
                border-l
                border-slate-200
                pl-3
                dark:border-slate-700
              "
            >
              <h1
                className="
                  truncate
                  text-base
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  sm:text-xl
                "
              >
                {t("appName")}
              </h1>

              <p
                className="
                  mt-0.5
                  hidden
                  truncate
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                  sm:block
                  sm:text-sm
                "
              >
                {t("appSubtitle")}
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {/* API Simulation */}
            <ApiSimulation />

            {/* Language */}
            <div
              className="
                flex
                items-center
                rounded-full
                border
                border-slate-200
                bg-slate-100
                p-1
                shadow-inner
                dark:border-slate-700/80
                dark:bg-slate-800/80
              "
            >
              <LanguageToggle />
            </div>

            {/* Divider */}
            <div
              className="
                hidden
                h-8
                w-px
                bg-slate-200
                dark:bg-slate-700
                sm:block
              "
            />

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-slate-100
                text-slate-600
                transition
                duration-200
                hover:border-indigo-400/60
                hover:bg-indigo-50
                hover:text-indigo-600
                active:scale-95
                dark:border-slate-700
                dark:bg-slate-800/80
                dark:text-slate-300
                dark:hover:border-indigo-400/60
                dark:hover:bg-indigo-500/10
                dark:hover:text-white
                sm:h-12
                sm:w-12
                sm:rounded-2xl
              "
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
          </div>
        </div>
      </header>

      <Toaster position="top-center" />

      <div className="pt-[76px]">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
