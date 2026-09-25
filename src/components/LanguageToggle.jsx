import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const currentLanguage = i18n.language.startsWith("ar") ? "ar" : "en";

  return (
    <div className="flex items-center gap-1">
      {/* English */}
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`
          rounded-lg
          px-3
          py-1.5
          text-xs
          font-bold
          transition-all
          duration-200
          sm:px-3.5
          sm:py-2
          sm:text-sm
          ${
            currentLanguage === "en"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-400 hover:bg-slate-700 hover:text-white"
          }
        `}
      >
        EN
      </button>

      {/* Arabic */}
      <button
        type="button"
        onClick={() => changeLanguage("ar")}
        className={`
          rounded-lg
          px-3
          py-1.5
          text-xs
          font-bold
          transition-all
          duration-200
          sm:px-3.5
          sm:py-2
          sm:text-sm
          ${
            currentLanguage === "ar"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-400 hover:bg-slate-700 hover:text-white"
          }
        `}
      >
        AR
      </button>
    </div>
  );
}
