import { Link, useLocation } from "wouter";
import {
  Home,
  Database,
  Dna,
  Sprout,
  BookOpen,
  Users,
  Mail,
  Menu,
  X,
  Building2,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { path: "/", labelKey: "nav.home", icon: Home },
  { path: "/catalog", labelKey: "nav.catalog", icon: Database },
  { path: "/centers", labelKey: "nav.centers", icon: Building2 },
  { path: "/inventory", labelKey: "nav.inventory", icon: Package },
  { path: "/genomics", labelKey: "nav.genomics", icon: Dna },
  { path: "/exchange", labelKey: "nav.exchange", icon: Sprout },
  { path: "/research", labelKey: "nav.research", icon: BookOpen },
  { path: "/community", labelKey: "nav.community", icon: Users },
  { path: "/contact", labelKey: "nav.contact", icon: Mail },
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, dir } = useLanguage();
  const isRTL = dir === "rtl";

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container">
        {/* Main bar */}
        <div
          className={`flex items-center justify-between h-20 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {/* Logo + title */}
          <Link
            href="/"
            className={`flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663143815567/GepFqmryaNTsXTiv.jpg"
              alt="MEWA Logo"
              className="h-14 w-auto"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-primary leading-tight">
                {t("header.title")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("header.subtitle")}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`hidden xl:flex items-center gap-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  } ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>

          {/* Language Switcher + user badge — desktop */}
          <div
            className={`hidden xl:flex items-center gap-3 shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <LanguageSwitcher />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {isRTL ? "ع" : "U"}
              </div>
              <span className="text-foreground font-medium">
                {t("nav.publicAccess")}
              </span>
            </div>
          </div>

          {/* Mobile / tablet: Language switcher + hamburger */}
          <div
            className={`xl:hidden flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg hover:bg-secondary transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-border">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    } ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="leading-tight">{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </div>
            <div
              className={`mt-3 pt-3 border-t border-border flex items-center justify-between px-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {isRTL ? "ع" : "U"}
                </div>
                <span>{t("nav.publicAccess")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
