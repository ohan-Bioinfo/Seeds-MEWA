import { ReactNode } from "react";
import Navigation from "./Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hero?: boolean;
}

export default function PageLayout({
  children,
  title,
  description,
  hero = false,
}: PageLayoutProps) {
  const { t, dir } = useLanguage();
  const isRTL = dir === "rtl";

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={dir}>
      <Navigation />

      {hero && title && (
        <div className="relative bg-gradient-to-br from-primary/5 via-secondary to-accent/5 border-b border-border">
          <div className="absolute inset-0 topographic-pattern opacity-10" />
          <div className="container relative py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {!hero && title && (
        <div className="bg-white border-b border-border">
          <div className="container py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground max-w-3xl">{description}</p>
            )}
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      {/* Footer — fully localized */}
      <footer className="bg-primary text-primary-foreground mt-auto" dir={dir}>
        <div className="container py-8">
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isRTL ? "text-right" : ""}`}
          >
            {/* Brand */}
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {t("footer.title")}
              </h3>
              <p className="text-sm text-primary-foreground/80">
                {t("footer.subtitle")}
              </p>
              <p className="text-sm text-primary-foreground/80 mt-2">
                {t("footer.country")}
              </p>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Vision2030_logo.svg/400px-Vision2030_logo.svg.png"
                alt="Vision 2030"
                className="h-10 w-auto mt-4"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://salogos.b-cdn.net/logos/png/1774895139386-ffizo9wl.png'; (e.target as HTMLImageElement).style.filter = ''; }}
              />
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <a href="/catalog" className="hover:text-primary-foreground transition-colors">
                    {t("nav.catalog")}
                  </a>
                </li>
                <li>
                  <a href="/genomics" className="hover:text-primary-foreground transition-colors">
                    {t("nav.genomics")}
                  </a>
                </li>
                <li>
                  <a href="/centers" className="hover:text-primary-foreground transition-colors">
                    {t("nav.centers")}
                  </a>
                </li>
                <li>
                  <a href="/research" className="hover:text-primary-foreground transition-colors">
                    {t("nav.research")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {t("footer.contact")}
              </h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>{t("footer.email")}</li>
                <li>{t("footer.phone")}</li>
                <li>
                  <a href="/contact" className="hover:text-primary-foreground transition-colors">
                    {t("footer.contactForm")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
            {t("footer.rights")}
          </div>

          {/* Prototype notice */}
          <div className="mt-4 pt-4 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest border border-amber-400/40 bg-amber-400/10 text-amber-300">
              ⚠ PROTOTYPE
            </span>
            <span className="text-[10px] text-primary-foreground/35">
              {isRTL
                ? "نسخة تجريبية — غير مخصصة للاستخدام الإنتاجي النهائي · SEEd Center 2026"
                : "Development prototype — not a final production release · SEEd Center 2026"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
