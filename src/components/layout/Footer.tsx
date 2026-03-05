import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  if (location.pathname.startsWith("/chat")) {
    return null;
  }
  return (
    <footer className="w-full bg-[#0F0C29]/50 backdrop-blur-sm border-t border-white/10 py-6 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p>{t("footer.copyright")}</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              to="/privacy-policy"
              className="hover:text-purple-300 transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-purple-300 transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <a
              href="mailto:vaga0330@gmail.com"
              className="hover:text-purple-300 transition-colors"
            >
              {t("footer.contact")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
