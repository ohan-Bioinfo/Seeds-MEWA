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
                  <a href="/exchange" className="hover:text-primary-foreground transition-colors">
                    {t("nav.exchange")}
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
        </div>
      </footer>
    </div>
  );
}
