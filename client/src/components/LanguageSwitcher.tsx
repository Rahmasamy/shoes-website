import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // ensure document direction matches selected language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="flex items-center gap-2">
      <button className="text-sm" onClick={() => i18n.changeLanguage("en")}>EN</button>
      <span className="text-muted-foreground">|</span>
      <button className="text-sm" onClick={() => i18n.changeLanguage("ar")}>ع</button>
    </div>
  );
}
