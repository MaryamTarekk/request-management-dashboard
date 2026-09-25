import { useState } from "react";
import { FlaskConical, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "api-simulation-settings";

const DEFAULT_SETTINGS = {
  latency: 1200,
  failureRate: 10,
  simulateUsers: true,
};

function getSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function ApiSimulation() {
  const { t } = useTranslation();

  const [settings, setSettings] = useState(getSettings);
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value };

    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="relative z-[100]">
      {/* API Simulation Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t("apiSimulation.title")}
        aria-expanded={isOpen}
        className="
          flex h-10 shrink-0 items-center justify-center gap-2
          rounded-xl border border-slate-200 bg-white px-2.5
          text-sm font-medium text-slate-700 shadow-md transition
          hover:border-indigo-400/60 hover:bg-indigo-50
          dark:border-slate-700 dark:bg-slate-800/90
          dark:text-slate-100 dark:hover:border-indigo-400/60
          dark:hover:bg-slate-700
          sm:px-3
        "
      >
        <FlaskConical
          size={19}
          className="shrink-0 text-indigo-500 dark:text-indigo-400"
        />

        <span className="hidden sm:inline">{t("apiSimulation.title")}</span>

        <span
          className="
            hidden rounded-md bg-slate-100 px-2 py-1 text-xs
            text-slate-600 dark:bg-slate-700 dark:text-slate-300
            sm:inline
          "
        >
          {settings.failureRate}% {t("apiSimulation.fail")}
        </span>

        <ChevronDown
          size={15}
          className={`hidden shrink-0 transition-transform sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            fixed left-3 right-3 top-20 z-[9999]
            max-h-[calc(100dvh-100px)] overflow-y-auto
            rounded-2xl border border-slate-200
            bg-white p-5 shadow-xl
            dark:border-slate-700 dark:bg-slate-900

            sm:absolute sm:left-auto sm:right-0
            sm:top-full sm:mt-3
            sm:max-h-[calc(100vh-100px)]
            sm:w-[380px]
          "
        >
          {/* Header */}
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("apiSimulation.settingsTitle")}
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
              {t("apiSimulation.settingsDescription")}
            </p>
          </div>

          {/* Latency */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t("apiSimulation.latency")}
              </label>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {Math.max(120, settings.latency - 300)}–{settings.latency + 300}{" "}
                {t("apiSimulation.ms")}
              </span>
            </div>

            <input
              type="range"
              min="120"
              max="3000"
              step="60"
              value={settings.latency}
              onChange={(e) => updateSetting("latency", Number(e.target.value))}
              className="w-full cursor-pointer accent-teal-600"
            />
          </div>

          {/* Failure Rate */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t("apiSimulation.failureRate")}
              </label>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {settings.failureRate}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.failureRate}
              onChange={(e) =>
                updateSetting("failureRate", Number(e.target.value))
              }
              className="w-full cursor-pointer accent-teal-600"
            />
          </div>

          {/* Simulate Users */}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t("apiSimulation.simulateUsers")}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {t("apiSimulation.simulateUsersDescription")}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.simulateUsers}
              aria-label={t("apiSimulation.simulateUsers")}
              onClick={() =>
                updateSetting("simulateUsers", !settings.simulateUsers)
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                settings.simulateUsers
                  ? "bg-teal-700"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  settings.simulateUsers ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
