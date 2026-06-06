/**
 * Seed Stations — Unified page (merged Centers + Seeders Exchange)
 * Map/list of seed centers + seed exchange catalog, request workflow, guidelines
 */
import { useState, useRef, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import SeedCenterMap from "@/components/SeedCenterMap";
import { seedCenters, SeedCenter } from "@/data/seedCenters";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  ExternalLink,
  Wheat,
  User,
  Users,
  Calendar,
  Phone,
  Mail,
  Building2,
  TrendingUp,
  Package,
  Database,
  Send,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Map,
  List,
  FlaskConical,
  BookOpen,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── Animation helpers ──────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function useAnimatedCounter(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return { value, ref };
}

// ── KPI Card ───────────────────────────────────────────────────────────────

function KpiCard({
  label: labelKey,
  target,
  icon: Icon,
  suffix = "",
  delay,
}: {
  label: string;
  target: number;
  icon: React.ElementType;
  suffix?: string;
  delay: number;
}) {
  const { value, ref } = useAnimatedCounter(target);
  const { t } = useLanguage();
  return (
    <FadeUp delay={delay}>
      <div ref={ref} className="relative group">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-[var(--mewa-green)] to-[var(--mewa-gold)] opacity-0 group-hover:opacity-30 blur transition-opacity duration-500" />
        <Card className="relative border-primary/15 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">
              {value}
              {suffix}
            </div>
            <div className="text-sm font-medium text-foreground mt-1">
              {t(labelKey)}
            </div>
          </CardContent>
        </Card>
      </div>
    </FadeUp>
  );
}

// ── Seed exchange data ─────────────────────────────────────────────────────

const FEATURED_SEEDS = [
  {
    id: "W 129",
    name: "قمح الجبل",
    species: "Triticum aestivum L",
    region: "Al-Baha",
    traits: ["Drought tolerant", "High protein"],
    availability: "Available",
    quantity: "500g",
  },
  {
    id: "C 25",
    name: "بن خولاني",
    species: "Coffea arabica",
    region: "Jazan",
    traits: ["Disease resistant", "High yield"],
    availability: "Available",
    quantity: "200g",
  },
  {
    id: "W 131",
    name: "قمح (صيداء)",
    species: "Triticum aestivum L",
    region: "Taif",
    traits: ["Heat tolerant", "Early maturity"],
    availability: "Limited",
    quantity: "250g",
  },
  {
    id: "C 27",
    name: "بن خولاني",
    species: "Coffea arabica",
    region: "Aseer",
    traits: ["Aromatic", "Premium quality"],
    availability: "Available",
    quantity: "300g",
  },
  {
    id: "W 222",
    name: "قمح دمياط",
    species: "Triticum aestivum L",
    region: "Riyadh",
    traits: ["Salt tolerant", "High biomass"],
    availability: "Available",
    quantity: "400g",
  },
  {
    id: "C 30",
    name: "بن عذبي",
    species: "Coffea arabica",
    region: "Al-Baha",
    traits: ["Shade adapted", "Consistent yield"],
    availability: "Available",
    quantity: "250g",
  },
];

const REQUEST_STEPS = [
  {
    step: 1,
    titleKey: "st.step1.title",
    descKey: "st.step1.desc",
    icon: Send,
    status: "active" as const,
  },
  {
    step: 2,
    titleKey: "st.step2.title",
    descKey: "st.step2.desc",
    icon: FileCheck,
    status: "pending" as const,
  },
  {
    step: 3,
    titleKey: "st.step3.title",
    descKey: "st.step3.desc",
    icon: FileCheck,
    status: "pending" as const,
  },
  {
    step: 4,
    titleKey: "st.step4.title",
    descKey: "st.step4.desc",
    icon: Package,
    status: "pending" as const,
  },
  {
    step: 5,
    titleKey: "st.step5.title",
    descKey: "st.step5.desc",
    icon: CheckCircle2,
    status: "pending" as const,
  },
];

const SAMPLE_REQUESTS = [
  {
    id: "REQ-2026-001",
    accessions: "W 129, W 131",
    date: "2026-02-10",
    status: "approved",
    stage: "Preparation",
  },
  {
    id: "REQ-2026-002",
    accessions: "C 25, C 27",
    date: "2026-02-12",
    status: "pending",
    stage: "Under Review",
  },
  {
    id: "REQ-2025-089",
    accessions: "W 222",
    date: "2025-12-15",
    status: "shipped",
    stage: "Delivered",
  },
];

const REGIONS = [
  "Taif",
  "Aseer",
  "Al-Baha",
  "Najran",
  "Riyadh",
  "Qaseem",
  "Hail",
  "Jazan",
  "Tabuk",
];

// ── Main Component ─────────────────────────────────────────────────────────

export default function Centers() {
  const { t, language, dir } = useLanguage();
  const isRTL = dir === "rtl";

  // Centers state
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedCenter, setSelectedCenter] = useState<SeedCenter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredCenters = seedCenters.filter((center) => {
    if (selectedRegion && center.region !== selectedRegion) return false;
    if (
      selectedCrop &&
      !center.crops.some((crop) =>
        crop.name.toLowerCase().includes(selectedCrop.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const handleCenterClick = (center: SeedCenter) => {
    setSelectedCenter(center);
    setDialogOpen(true);
  };

  const totalStaff = seedCenters.reduce((sum, c) => sum + c.staff, 0);
  const totalExperiments = seedCenters.reduce(
    (sum, c) => sum + c.stats.experiments,
    0
  );
  const totalDistributed = Math.round(
    seedCenters.reduce((sum, c) => sum + c.seedExchange.distributed, 0) / 1000
  );

  return (
    <PageLayout>
      {/* ── Dark gradient hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a0e] via-[#122117] to-[#0a1e12] text-white">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--mewa-green)] rounded-full blur-[160px] opacity-[0.07]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--mewa-gold)] rounded-full blur-[140px] opacity-[0.05]" />

        <div className="container relative py-16 md:py-20">
          <FadeUp>
            <div
              className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Sprout className="h-5 w-5 text-[var(--mewa-gold)]" />
              <span className="text-sm font-medium tracking-wide text-[var(--mewa-gold)] uppercase">
                {t("st.hero.badge")}
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1
              className={`text-3xl md:text-5xl font-bold mb-4 leading-tight ${isRTL ? "text-right" : ""}`}
            >
              {t("st.hero.title")}
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p
              className={`text-lg md:text-xl text-white/70 max-w-2xl mb-6 ${isRTL ? "text-right mr-0 ml-auto" : ""}`}
            >
              {t("st.hero.subtitle")}
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className={isRTL ? "text-right" : ""}>
              <a
                href="https://seed-stations.embryo.sa"
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2.5 rounded-xl bg-[var(--mewa-gold)] px-5 py-3 text-sm md:text-base font-semibold text-[#0c1a0e] shadow-lg shadow-black/20 transition-all hover:scale-[1.03] hover:shadow-xl ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-700" />
                </span>
                {t("st.hero.liveDashboard")}
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── KPI strip ── */}
      <section className="container -mt-8 relative z-10 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            label="st.kpi.stations"
            target={seedCenters.length}
            icon={Building2}
            delay={0}
          />
          <KpiCard
            label="st.kpi.staff"
            target={totalStaff}
            icon={Users}
            delay={0.08}
          />
          <KpiCard
            label="st.kpi.experiments"
            target={totalExperiments}
            icon={FlaskConical}
            delay={0.16}
          />
          <KpiCard
            label="st.kpi.distributed"
            target={totalDistributed}
            icon={Package}
            suffix="K"
            delay={0.24}
          />
        </div>
      </section>

      {/* ── Main content with tabs ── */}
      <section className="container pb-16">
        <Tabs defaultValue="map" className="w-full">
          <FadeUp>
            <TabsList className="flex flex-wrap w-full h-auto gap-1 mb-8 bg-secondary/50 p-1.5 rounded-xl">
              {[
                { value: "map", icon: Map, labelKey: "st.tab.map" },
                { value: "list", icon: List, labelKey: "st.tab.list" },
                { value: "charts", icon: BarChart3, labelKey: "st.tab.charts" },
                { value: "seeds", icon: Sprout, labelKey: "st.tab.seeds" },
                {
                  value: "process",
                  icon: FlaskConical,
                  labelKey: "st.tab.process",
                },
                {
                  value: "guidelines",
                  icon: BookOpen,
                  labelKey: "st.tab.guidelines",
                },
              ].map((tab) => {
                const TIcon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <TIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{t(tab.labelKey)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </FadeUp>

          {/* ── Filters (shared for Map + List) ── */}
          <FadeUp>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div
                  className={`flex flex-col md:flex-row gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      {t("st.filter.region")}
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    >
                      <option value="">{t("st.filter.allRegions")}</option>
                      {REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      {t("st.filter.crop")}
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    >
                      <option value="">{t("st.filter.allCrops")}</option>
                      <option value="wheat">
                        {language === "ar" ? "القمح" : "Wheat"}
                      </option>
                      <option value="coffee">
                        {language === "ar" ? "البن" : "Coffee"}
                      </option>
                      <option value="dates">
                        {language === "ar" ? "التمور" : "Dates"}
                      </option>
                      <option value="barley">
                        {language === "ar" ? "الشعير" : "Barley"}
                      </option>
                    </select>
                  </div>
                  {(selectedRegion || selectedCrop) && (
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedRegion("");
                          setSelectedCrop("");
                        }}
                      >
                        {t("common.reset")}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          {/* ── Map View ── */}
          <TabsContent value="map">
            <FadeUp>
              <SeedCenterMap
                selectedRegion={selectedRegion}
                selectedCrop={selectedCrop}
                onCenterClick={handleCenterClick}
              />
            </FadeUp>
          </TabsContent>

          {/* ── List View ── */}
          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredCenters.map((center, idx) => (
                <FadeUp key={center.id} delay={idx * 0.05}>
                  <Card
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => handleCenterClick(center)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors">
                        {language === "ar" ? center.nameAr : center.name}
                      </CardTitle>
                      <div
                        className={`flex items-center gap-1 text-sm text-muted-foreground mt-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <MapPin className="h-3 w-3" />
                        {center.city}, {center.region}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {center.crops.slice(0, 3).map((crop, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {language === "ar" ? crop.nameAr : crop.name}
                          </Badge>
                        ))}
                        {center.crops.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{center.crops.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div
                          className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {center.staff} {t("st.list.staff")}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <FlaskConical className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {center.stats.experiments} {t("st.list.experiments")}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {t("st.list.hortVarieties")}
                          </span>
                          <span className="font-semibold">
                            {center.stats.horticulturalVarieties}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeUp>
              ))}
            </div>
          </TabsContent>

          {/* ── Charts ── */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1 — Staff per Station */}
              <FadeUp>
                <Card className="p-4 border-2 border-green-100">
                  <h3 className="font-semibold text-base mb-3">
                    {language === "ar"
                      ? "الموظفون لكل محطة"
                      : "Staff per Station"}
                  </h3>
                  <div dir="ltr" style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={seedCenters.map((c) => ({
                          name: c.nameAr,
                          staff: c.staff,
                        }))}
                        layout="vertical"
                        margin={{ left: 8, right: 20, top: 4, bottom: 4 }}
                      >
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={90}
                          tick={{ fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(v) => [
                            v,
                            language === "ar" ? "موظف" : "staff",
                          ]}
                        />
                        <Bar
                          dataKey="staff"
                          fill="#0B5F3A"
                          radius={[0, 4, 4, 0]}
                          barSize={18}
                        >
                          {seedCenters.map((c, i) => (
                            <Cell
                              key={i}
                              fill={
                                c.staff >= 9
                                  ? "#0B5F3A"
                                  : c.staff >= 3
                                    ? "#1a7a52"
                                    : "#6b7280"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </FadeUp>

              {/* Chart 2 — Agricultural Experiments per Station */}
              <FadeUp delay={0.1}>
                <Card className="p-4 border-2 border-amber-100">
                  <h3 className="font-semibold text-base mb-3">
                    {language === "ar"
                      ? "التجارب الزراعية لكل محطة"
                      : "Agricultural Experiments per Station"}
                  </h3>
                  <div dir="ltr" style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={seedCenters.map((c) => ({
                          name: c.nameAr,
                          experiments: c.stats.experiments,
                        }))}
                        layout="vertical"
                        margin={{ left: 8, right: 20, top: 4, bottom: 4 }}
                      >
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={90}
                          tick={{ fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(v) => [
                            v,
                            language === "ar" ? "تجربة" : "experiments",
                          ]}
                        />
                        <Bar
                          dataKey="experiments"
                          fill="#D97706"
                          radius={[0, 4, 4, 0]}
                          barSize={18}
                        >
                          {seedCenters.map((_c, i) => (
                            <Cell key={i} fill="#D97706" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </FadeUp>

              {/* Chart 3 — Horticultural Varieties per Station */}
              <FadeUp delay={0.2}>
                <Card className="p-4 border-2 border-purple-100">
                  <h3 className="font-semibold text-base mb-3">
                    {language === "ar"
                      ? "الأصناف البستانية لكل محطة"
                      : "Horticultural Varieties per Station"}
                  </h3>
                  <div dir="ltr" style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={seedCenters
                          .filter((c) => c.stats.horticulturalVarieties > 0)
                          .map((c) => ({
                            name: c.nameAr,
                            varieties: c.stats.horticulturalVarieties,
                          }))
                          .sort((a, b) => b.varieties - a.varieties)}
                        layout="vertical"
                        margin={{ left: 8, right: 20, top: 4, bottom: 4 }}
                      >
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={90}
                          tick={{ fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(v) => [
                            v,
                            language === "ar" ? "صنف" : "varieties",
                          ]}
                        />
                        <Bar
                          dataKey="varieties"
                          fill="#7c3aed"
                          radius={[0, 4, 4, 0]}
                          barSize={18}
                        >
                          {seedCenters
                            .filter((c) => c.stats.horticulturalVarieties > 0)
                            .sort(
                              (a, b) =>
                                b.stats.horticulturalVarieties -
                                a.stats.horticulturalVarieties
                            )
                            .map((_c, i) => (
                              <Cell key={i} fill="#7c3aed" />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </FadeUp>
            </div>
          </TabsContent>

          {/* ── Available Seeds (from Exchange) ── */}
          <TabsContent value="seeds" className="space-y-6">
            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              {[
                {
                  icon: Send,
                  titleKey: "st.seeds.requestTitle",
                  descKey: "st.seeds.requestDesc",
                  btnKey: "st.seeds.newRequest",
                  primary: true,
                },
                {
                  icon: Package,
                  titleKey: "st.seeds.browseTitle",
                  descKey: "st.seeds.browseDesc",
                  btnKey: "st.seeds.viewCatalog",
                  primary: false,
                },
                {
                  icon: FileCheck,
                  titleKey: "st.seeds.trackTitle",
                  descKey: "st.seeds.trackDesc",
                  btnKey: "st.seeds.myRequests",
                  primary: false,
                },
              ].map((action, i) => {
                const AIcon = action.icon;
                return (
                  <FadeUp key={i} delay={i * 0.08}>
                    <Card
                      className={`border-primary/20 hover:border-primary transition-colors ${action.primary ? "cursor-pointer" : ""}`}
                    >
                      <CardHeader>
                        <CardTitle
                          className={`flex items-center gap-2 text-lg ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <AIcon className="h-5 w-5 text-primary" />
                          {t(action.titleKey)}
                        </CardTitle>
                        <CardDescription>{t(action.descKey)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className={`w-full ${action.primary ? "mewa-gradient text-white" : ""}`}
                          variant={action.primary ? "default" : "outline"}
                        >
                          {t(action.btnKey)}
                        </Button>
                      </CardContent>
                    </Card>
                  </FadeUp>
                );
              })}
            </div>

            {/* Featured seeds */}
            <FadeUp delay={0.3}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("st.seeds.featuredTitle")}</CardTitle>
                  <CardDescription>{t("st.seeds.featuredDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FEATURED_SEEDS.map((seed) => (
                      <Card
                        key={seed.id}
                        className="border-border hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div
                            className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <div className="flex-1">
                              <CardTitle className="text-base mb-1">
                                {seed.name}
                              </CardTitle>
                              <CardDescription className="text-xs italic">
                                {seed.species}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                seed.availability === "Available"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {seed.availability === "Available"
                                ? t("st.seeds.available")
                                : t("st.seeds.limited")}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("st.seeds.accession")}:
                              </span>
                              <span className="font-mono font-medium">
                                {seed.id}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("st.filter.region")}:
                              </span>
                              <span className="font-medium">{seed.region}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("st.seeds.qty")}:
                              </span>
                              <span className="font-medium">
                                {seed.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {seed.traits.map((trait, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {trait}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            className="w-full mewa-gradient text-white"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            {t("st.seeds.requestSample")}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </TabsContent>

          {/* ── Request Process ── */}
          <TabsContent value="process" className="space-y-6">
            <FadeUp>
              <Card>
                <CardHeader>
                  <CardTitle>{t("st.process.workflowTitle")}</CardTitle>
                  <CardDescription>
                    {t("st.process.workflowDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {REQUEST_STEPS.map((step) => {
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.step}
                          className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                step.status === "active"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            {step.step < 5 && (
                              <div className="w-0.5 h-12 bg-border my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div
                              className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <h4 className="font-semibold text-foreground">
                                {t("st.process.step")} {step.step}:{" "}
                                {t(step.titleKey)}
                              </h4>
                              {step.status === "active" && (
                                <Badge className="bg-primary">
                                  {t("st.process.current")}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {t(step.descKey)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </FadeUp>

            <FadeUp delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("st.process.statusTitle")}</CardTitle>
                  <CardDescription>
                    {t("st.process.statusDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SAMPLE_REQUESTS.map((request) => (
                      <div
                        key={request.id}
                        className={`flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {request.status === "shipped" ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : request.status === "approved" ? (
                            <Clock className="h-5 w-5 text-accent" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-semibold text-foreground">
                              {request.id}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.accessions}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className={isRTL ? "text-left" : "text-right"}>
                            <div className="text-sm font-medium">
                              {request.stage}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {request.date}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            {t("st.process.viewDetails")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </TabsContent>

          {/* ── Guidelines ── */}
          <TabsContent value="guidelines" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FadeUp>
                <Card>
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      {t("st.guide.eligTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "st.guide.elig1",
                      "st.guide.elig2",
                      "st.guide.elig3",
                      "st.guide.elig4",
                    ].map((key) => (
                      <div
                        key={key}
                        className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{t(key)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <FileCheck className="h-5 w-5 text-primary" />
                      {t("st.guide.docsTitle")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "st.guide.doc1",
                      "st.guide.doc2",
                      "st.guide.doc3",
                      "st.guide.doc4",
                    ].map((key) => (
                      <div
                        key={key}
                        className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{t(key)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("st.guide.termsTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{t("st.guide.termsIntro")}</p>
                    {[
                      "st.guide.term1",
                      "st.guide.term2",
                      "st.guide.term3",
                      "st.guide.term4",
                      "st.guide.term5",
                    ].map((key) => (
                      <div
                        key={key}
                        className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-primary shrink-0">•</span>
                        <span>{t(key)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("st.guide.contactTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">
                        {t("st.guide.coordinator")}
                      </strong>
                      <p className="text-muted-foreground">
                        Dr. Ahmed Al-Qahtani
                      </p>
                    </div>
                    <div>
                      <strong className="text-foreground">
                        {t("st.guide.email")}
                      </strong>
                      <p className="text-muted-foreground">
                        seedexchange@mewa.gov.sa
                      </p>
                    </div>
                    <div>
                      <strong className="text-foreground">
                        {t("st.guide.phone")}
                      </strong>
                      <p className="text-muted-foreground">
                        +966 11 XXX XXXX ext. 234
                      </p>
                    </div>
                    <div>
                      <strong className="text-foreground">
                        {t("st.guide.hours")}
                      </strong>
                      <p className="text-muted-foreground">
                        {t("st.guide.hoursVal")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* ── Center Detail Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedCenter && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl">
                  {language === "ar"
                    ? selectedCenter.nameAr
                    : selectedCenter.name}
                </DialogTitle>
                <div
                  className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <MapPin className="h-4 w-4" />
                  {language === "ar"
                    ? selectedCenter.contact.addressAr
                    : selectedCenter.contact.address}
                </div>
                <a
                  href="https://seed-stations.embryo.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  {t("st.dialog.liveDashboard")}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      val: selectedCenter.area || "—",
                      labelKey: "st.dialog.totalArea",
                    },
                    {
                      val: selectedCenter.utilizedArea || "—",
                      labelKey: "st.dialog.utilizedArea",
                    },
                    { val: selectedCenter.staff, labelKey: "st.dialog.staff" },
                    {
                      val: selectedCenter.stats.equipment,
                      labelKey: "st.dialog.equipment",
                    },
                    {
                      val: selectedCenter.stats.needs,
                      labelKey: "st.dialog.needs",
                    },
                    {
                      val: selectedCenter.stats.visits,
                      labelKey: "st.dialog.visits",
                    },
                    {
                      val: selectedCenter.crops.length,
                      labelKey: "st.dialog.crops",
                    },
                    {
                      val: selectedCenter.stats.experiments,
                      labelKey: "st.dialog.experiments",
                    },
                  ].map((item) => (
                    <div
                      key={item.labelKey}
                      className="text-center p-3 bg-secondary rounded-lg"
                    >
                      <div className="text-2xl font-bold text-primary">
                        {item.val}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t(item.labelKey)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Crops */}
                <div>
                  <h3
                    className={`font-semibold text-lg mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Wheat className="h-5 w-5 text-primary" />
                    {t("st.dialog.cropsPlanted")}
                  </h3>
                  <div className="space-y-2">
                    {selectedCenter.crops.map((crop, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-3 bg-secondary rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div>
                          <div className="font-medium">
                            {language === "ar" ? crop.nameAr : crop.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {crop.plantingSeason}
                          </div>
                        </div>
                        <div className={isRTL ? "text-left" : "text-right"}>
                          <div className="text-sm font-semibold">
                            {crop.area}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {crop.varieties} {t("st.dialog.varieties")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h3
                    className={`font-semibold text-lg mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {t("st.dialog.activities")}
                  </h3>
                  <div className="space-y-2">
                    {selectedCenter.activities.map((activity, idx) => (
                      <div key={idx} className="p-3 bg-secondary rounded-lg">
                        <Badge className="mb-2">{activity.type}</Badge>
                        <p className="text-sm">
                          {language === "ar"
                            ? activity.descriptionAr
                            : activity.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seed Exchange */}
                <div>
                  <h3
                    className={`font-semibold text-lg mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Package className="h-5 w-5 text-primary" />
                    {t("st.dialog.seedExchange")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedCenter.seedExchange.distributed.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("st.dialog.distYear")}
                      </div>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedCenter.seedExchange.received.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("st.dialog.recYear")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">
                      {t("st.dialog.partners")}:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCenter.seedExchange.partners.map(
                        (partner, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {partner}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {t("st.dialog.contact")}
                  </h3>
                  <div className="space-y-2">
                    {(language === "ar"
                      ? selectedCenter.managerAr
                      : selectedCenter.manager) && (
                      <div
                        className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <User className="h-4 w-4 text-primary" />
                        <span>
                          <span className="text-muted-foreground">
                            {t("st.dialog.manager")}:{" "}
                          </span>
                          {language === "ar"
                            ? selectedCenter.managerAr
                            : selectedCenter.manager}
                        </span>
                      </div>
                    )}
                    {selectedCenter.contact.phone && (
                      <div
                        className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        <a
                          href={`tel:${selectedCenter.contact.phone}`}
                          className="hover:underline"
                          dir="ltr"
                        >
                          {selectedCenter.contact.phone}
                        </a>
                      </div>
                    )}
                    {selectedCenter.contact.email && (
                      <div
                        className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Mail className="h-4 w-4 text-primary" />
                        <a
                          href={`mailto:${selectedCenter.contact.email}`}
                          className="hover:underline"
                        >
                          {selectedCenter.contact.email}
                        </a>
                      </div>
                    )}
                    {!selectedCenter.contact.phone &&
                      !selectedCenter.contact.email &&
                      !selectedCenter.manager && (
                        <p className="text-sm text-muted-foreground">
                          {t("st.dialog.noContact")}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
