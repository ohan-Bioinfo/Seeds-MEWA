/**
 * Main Dashboard: Saudi Seed Passport Explorer
 * Enhanced with animated KPIs, Recharts visualizations, Framer Motion
 * Split-screen layout with interactive map + region stats + crop breakdown
 * Fully translated (Arabic/English), mobile-responsive
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import PageLayout from "@/components/PageLayout";
import SaudiMap from "@/components/SaudiMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CROP_META,
  CropType,
  getFilteredRegionData,
  getSaudiTotalsByCrop,
  TOTAL_PASSPORT_ACCESSIONS,
  TOTAL_GENOMIC_CROPS,
  getActiveCropTypes,
  getPassportCropTypes,
  REGION_CROP_DATA,
} from "@/data/passportData";
import {
  Database,
  MapPin,
  Filter,
  X,
  Dna,
  Leaf,
  Globe,
  HardDrive,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const ALL_CROPS = getActiveCropTypes();          // all 28
const PASSPORT_CROPS = getPassportCropTypes();   // 8 with passport + map data

/* ── Animated counter hook ── */
function useAnimatedCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      if (current !== start) {
        start = current;
        setCount(current);
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ── Fade-up animation wrapper ── */
const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ── KPI Card component ── */
function KpiCard({
  icon: Icon,
  value,
  label,
  suffix,
  color,
  delay,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  color: string;
  delay: number;
}) {
  const { count, ref } = useAnimatedCounter(value);
  return (
    <FadeUp delay={delay}>
      <Card
        ref={ref}
        className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300"
      >
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-80"
          style={{ backgroundColor: color }}
        />
        <CardContent className="pt-5 pb-4 px-4 sm:px-5">
          <div className="flex items-start justify-between mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <TrendingUp
              className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors"
            />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {count.toLocaleString()}
            {suffix && (
              <span className="text-base font-medium text-muted-foreground ms-1">
                {suffix}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {label}
          </p>
        </CardContent>
      </Card>
    </FadeUp>
  );
}

/* ── Custom Recharts Tooltip ── */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
      {label && (
        <p className="font-semibold text-foreground mb-1">{label}</p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const [selectedCrops, setSelectedCrops] = useState<CropType[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Filtered region data based on selected crops
  const regionData = useMemo(
    () => getFilteredRegionData(selectedCrops),
    [selectedCrops],
  );

  // Saudi-only totals per crop
  const saudiTotals = useMemo(() => getSaudiTotalsByCrop(), []);

  const handleCropToggle = (crop: CropType) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop],
    );
  };

  const handleRegionClick = (region: string) => {
    setSelectedRegion((prev) => (prev === region ? null : region));
  };

  const clearFilters = () => {
    setSelectedCrops([]);
    setSelectedRegion(null);
  };

  // Selected region data for sidebar
  const selectedRegionData = selectedRegion
    ? REGION_CROP_DATA.find((r) => r.region === selectedRegion)
    : null;

  // Total Saudi accessions shown (respects crop filter)
  const displayTotal = useMemo(() => {
    if (selectedCrops.length === 0) {
      return regionData.reduce((sum, r) => sum + r.total, 0);
    }
    return selectedCrops.reduce(
      (sum, crop) => sum + (saudiTotals[crop] || 0),
      0,
    );
  }, [selectedCrops, regionData, saudiTotals]);

  // For map/charts, only passport crops are meaningful
  const activePassportCrops =
    selectedCrops.filter(c => CROP_META[c].hasPassport);
  const activeCropsForDisplay =
    activePassportCrops.length > 0 ? activePassportCrops : PASSPORT_CROPS;

  // Crop label depends on language
  const cropLabel = (crop: CropType) =>
    language === "ar" ? CROP_META[crop].labelAr : CROP_META[crop].label;

  /* ── Chart data ── */

  // Pie chart: passport crops only (totalAccessions > 0)
  const pieData = useMemo(
    () =>
      PASSPORT_CROPS.map((crop) => ({
        name: cropLabel(crop),
        value: CROP_META[crop].totalAccessions,
        color: CROP_META[crop].color,
      })),
    [language],
  );

  // Bar chart: regional totals (short names to avoid label clipping)
  const SHORT_REGION: Record<string, string> = {
    Jazan: "Jazan", Aseer: "Aseer", "Al-Baha": "Al-Baha",
    Riyadh: "Riyadh", Taif: "Taif", Qaseem: "Qaseem",
    Hail: "Hail", Najran: "Najran", Tabuk: "Tabuk",
  };
  const regionBarData = useMemo(
    () =>
      [...REGION_CROP_DATA]
        .sort((a, b) => b.total - a.total)
        .map((r) => ({
          name: SHORT_REGION[r.region] ?? r.region,
          total: r.total,
        })),
    [],
  );

  // Stacked bar: Saudi vs International per crop (short English labels)
  const SHORT_CROP: Record<string, string> = {
    breadWheat: "Bread Wheat", durumWheat: "Durum", coffee: "Coffee",
    barley: "Barley", fabaBean: "Faba Bean", millet: "Millet",
    sorghum: "Sorghum", sesame: "Sesame", mango: "Mango", papaya: "Papaya",
  };
  const originData = useMemo(
    () =>
      PASSPORT_CROPS.map((crop) => {
        const meta = CROP_META[crop];
        const saudi = saudiTotals[crop] || 0;
        return {
          name: SHORT_CROP[crop] ?? meta.label,
          [t("home.label.saudi")]: saudi,
          [t("home.label.international")]: meta.totalAccessions - saudi,
          color: meta.color,
        };
      }),
    [language, saudiTotals],
  );

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[280px] sm:min-h-[320px] flex items-center">
        {/* Gradient background */}
        <div className="absolute inset-0 mewa-gradient opacity-95" />
        {/* Topographic texture */}
        <div className="absolute inset-0 topographic-pattern opacity-10" />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-sm" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-sm" />

        <div className="container relative py-12 md:py-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm sm:text-base font-medium text-white/70 mb-2 tracking-wide uppercase">
              {t("home.hero.subtitle")}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
              {t("home.hero.title")}
            </h1>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl leading-relaxed">
              {t("home.hero.description")}
            </p>
          </motion.div>
          {/* Summary badges */}
          <motion.div
            className="flex flex-wrap gap-2 mt-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Database className="w-3 h-3 me-1.5" />
              {TOTAL_PASSPORT_ACCESSIONS.toLocaleString()}{" "}
              {t("home.badge.totalAccessions")}
            </Badge>
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
              <Leaf className="w-3 h-3 me-1.5" />{TOTAL_GENOMIC_CROPS}{" "}
              {t("home.badge.cropsWithData")}
            </Badge>
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
              <MapPin className="w-3 h-3 me-1.5" />10{" "}
              {t("home.badge.saudiRegions")}
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* ── KPI Cards ── */}
      <section className="container -mt-8 sm:-mt-10 relative z-20 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard
            icon={Database}
            value={TOTAL_PASSPORT_ACCESSIONS}
            label={t("home.kpi.totalAccessions")}
            color="#0B5F3A"
            delay={0}
          />
          <KpiCard
            icon={Leaf}
            value={TOTAL_GENOMIC_CROPS}
            label={t("home.kpi.cropsTracked")}
            color="#D4AF37"
            delay={0.1}
          />
          <KpiCard
            icon={Globe}
            value={10}
            label={t("home.kpi.saudiRegions")}
            color="#C0392B"
            delay={0.2}
          />
          <KpiCard
            icon={HardDrive}
            value={9}
            suffix={t("home.kpi.tbData")}
            label={t("home.kpi.genomicData")}
            color="#6B4423"
            delay={0.3}
          />
        </div>
      </section>

      {/* ── Crop tiles strip ── */}
      <section className="bg-muted/40 border-y border-border py-4">
        <div className="container">
          {/* Passport crops row */}
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 px-0.5">
            {language === "ar"
              ? `محاصيل لها بيانات جواز (${PASSPORT_CROPS.length})`
              : `Passport crops with regional data (${PASSPORT_CROPS.length})`}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2 mb-3">
            {PASSPORT_CROPS.map((crop, i) => {
              const meta = CROP_META[crop];
              const isSelected = selectedCrops.includes(crop);
              return (
                <motion.button
                  key={crop}
                  onClick={() => handleCropToggle(crop)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center p-2 sm:p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                    isSelected
                      ? "border-primary shadow-lg bg-primary/5"
                      : selectedCrops.length === 0
                        ? "border-border bg-card hover:border-primary/50 hover:shadow-md"
                        : "border-border bg-card opacity-45 hover:opacity-80"
                  }`}
                  title={`${meta.scientificName} — ${meta.totalAccessions} ${t("home.label.accessions")}`}
                >
                  <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{meta.icon}</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground truncate w-full leading-tight">
                    {cropLabel(crop)}
                  </span>
                  <span className="text-base sm:text-lg font-bold mt-0.5" style={{ color: meta.color }}>
                    {meta.totalAccessions}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground">{t("home.label.accessions")}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Genomics-only crops row */}
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 px-0.5">
            {language === "ar"
              ? `محاصيل جينوميات فقط — WGS/GBS (${ALL_CROPS.length - PASSPORT_CROPS.length})`
              : `Genomics-only crops — WGS/GBS (${ALL_CROPS.length - PASSPORT_CROPS.length})`}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 gap-1.5 sm:gap-2">
            {ALL_CROPS.filter(c => !CROP_META[c].hasPassport).map((crop, i) => {
              const meta = CROP_META[crop];
              const isSelected = selectedCrops.includes(crop);
              return (
                <motion.button
                  key={crop}
                  onClick={() => handleCropToggle(crop)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.03, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col items-center p-1.5 sm:p-2 rounded-xl border-2 transition-all cursor-pointer text-center ${
                    isSelected
                      ? "border-primary shadow-lg bg-primary/5"
                      : "border-dashed border-border bg-card/60 hover:border-primary/50 hover:shadow-md"
                  }`}
                  title={meta.scientificName}
                >
                  <span className="text-lg sm:text-xl mb-0.5">{meta.icon}</span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-foreground truncate w-full leading-tight">
                    {cropLabel(crop)}
                  </span>
                  <span className="text-sm sm:text-base font-bold mt-0.5" style={{ color: meta.color }}>
                    {meta.samples}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground">{meta.sequencingType}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Active filter bar */}
          {(selectedCrops.length > 0 || selectedRegion) && (
            <motion.div
              className="flex items-center gap-2 mt-3 flex-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25 }}
            >
              <Filter className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">
                {t("home.label.filteringBy")}
              </span>
              {selectedCrops.map((c) => (
                <Badge
                  key={c}
                  variant="default"
                  className="cursor-pointer select-none"
                  onClick={() => handleCropToggle(c)}
                  style={{ backgroundColor: CROP_META[c].color, color: "white" }}
                >
                  {cropLabel(c)} ×
                </Badge>
              ))}
              {selectedRegion && (
                <Badge
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setSelectedRegion(null)}
                >
                  <MapPin className="w-3 h-3 me-1" />
                  {selectedRegion} ×
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-destructive hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> {t("home.label.clearAll")}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Main content: Map + Sidebar ── */}
      <section className="container py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Map column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="map">
                  <MapPin className="w-4 h-4 me-2" />
                  {t("home.map.title")}
                </TabsTrigger>
                <TabsTrigger value="regions">
                  <Database className="w-4 h-4 me-2" />
                  {t("home.label.regionBreakdown")}
                </TabsTrigger>
              </TabsList>

              {/* Map tab */}
              <TabsContent value="map">
                <FadeUp>
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2 px-4 pt-4">
                      <CardTitle className="text-sm sm:text-base flex flex-wrap items-center gap-1">
                        <span>{t("home.map.description")} —</span>
                        <span className="text-primary font-bold">
                          {t("home.label.showingSaudi").replace(
                            "{n}",
                            String(displayTotal),
                          )}
                        </span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {t("home.label.clickRegion")}
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <SaudiMap
                        regionData={regionData}
                        selectedCrops={activeCropsForDisplay}
                        onRegionClick={handleRegionClick}
                      />
                    </CardContent>
                  </Card>
                </FadeUp>

                {/* Legend */}
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {activeCropsForDisplay.map((crop) => {
                    const meta = CROP_META[crop];
                    return (
                      <div
                        key={crop}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: meta.color }}
                        />
                        {cropLabel(crop)}
                      </div>
                    );
                  })}
                  <span className="text-xs text-muted-foreground">
                    {t("home.label.domCropColor")}
                  </span>
                </div>
              </TabsContent>

              {/* Region breakdown tab */}
              <TabsContent value="regions">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {regionData
                    .sort((a, b) => b.total - a.total)
                    .map((stat) => (
                      <motion.button
                        key={stat.region}
                        onClick={() => handleRegionClick(stat.region)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`text-start bg-card border rounded-xl p-4 hover:shadow-md transition-all ${
                          selectedRegion === stat.region
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            {stat.region}
                          </h4>
                          <span className="text-lg font-bold text-primary">
                            {stat.total}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {activeCropsForDisplay
                            .filter((c) => (stat.crops[c] || 0) > 0)
                            .map((crop) => {
                              const meta = CROP_META[crop];
                              const count = stat.crops[crop] || 0;
                              const pct = Math.round(
                                (count / stat.total) * 100,
                              );
                              return (
                                <div key={crop} className="text-xs">
                                  <div className="flex justify-between mb-0.5">
                                    <span className="text-muted-foreground">
                                      {cropLabel(crop)}
                                    </span>
                                    <span
                                      className="font-medium"
                                      style={{ color: meta.color }}
                                    >
                                      {count}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-1">
                                    <div
                                      className="h-1 rounded-full"
                                      style={{
                                        width: `${pct}%`,
                                        backgroundColor: meta.color,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </motion.button>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Right sidebar ── */}
          <div className="lg:col-span-1 space-y-4">
            {selectedRegionData ? (
              /* Region detail panel */
              <FadeUp>
                <Card className="border-primary/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {selectedRegionData.region}
                      </CardTitle>
                      <button
                        onClick={() => setSelectedRegion(null)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {selectedRegionData.total}
                      <span className="text-sm font-normal text-muted-foreground ms-1">
                        {t("home.label.saudiAccessions")}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ALL_CROPS.filter(
                        (c) => (selectedRegionData.crops[c] || 0) > 0,
                      ).map((crop) => {
                        const meta = CROP_META[crop];
                        const count = selectedRegionData.crops[crop] || 0;
                        const pct = Math.round(
                          (count / selectedRegionData.total) * 100,
                        );
                        return (
                          <div key={crop}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: meta.color }}
                                />
                                <div>
                                  <div className="text-sm font-medium">
                                    {cropLabel(crop)}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground italic">
                                    {meta.scientificName}
                                  </div>
                                </div>
                              </div>
                              <div className="text-end">
                                <div
                                  className="text-base font-bold"
                                  style={{ color: meta.color }}
                                >
                                  {count}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {pct}%
                                </div>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: meta.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {t("home.label.noteMappedRegions")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>
            ) : (
              /* Overall passport summary */
              <FadeUp>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary" />
                      {t("home.label.passportSummary")}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {t("home.label.clickToExplore")}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">
                          {t("home.label.totalAccessions")}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {TOTAL_PASSPORT_ACCESSIONS.toLocaleString()}
                        </span>
                      </div>
                      {PASSPORT_CROPS.map((crop) => {
                        const meta = CROP_META[crop];
                        const saudiCount = saudiTotals[crop] || 0;
                        const totalCount = meta.totalAccessions;
                        const saudiPct = Math.min(
                          Math.round((saudiCount / totalCount) * 100),
                          100,
                        );
                        return (
                          <div key={crop} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1.5">
                                <span>{meta.icon}</span>
                                <span className="font-medium">
                                  {cropLabel(crop)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1 py-0"
                                >
                                  {meta.sequencingType}
                                </Badge>
                              </div>
                              <span
                                className="font-bold"
                                style={{ color: meta.color }}
                              >
                                {totalCount}
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground flex justify-between">
                              <span>
                                {saudiCount} {t("home.label.saudiCount")} (
                                {saudiPct}%)
                              </span>
                              <span className="italic">
                                {meta.scientificName}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full transition-all duration-700"
                                style={{
                                  width: `${(totalCount / TOTAL_PASSPORT_ACCESSIONS) * 100}%`,
                                  backgroundColor: meta.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>
            )}

            {/* Quick stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <FadeUp delay={0.1}>
                <Card className="p-3 text-center bg-primary/5 border-primary/20">
                  <div className="text-2xl font-bold text-primary">
                    {regionData.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("home.label.activeRegions")}
                  </div>
                </Card>
              </FadeUp>
              <FadeUp delay={0.2}>
                <Card className="p-3 text-center bg-accent/10 border-accent/20">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#4A5D3F" }}
                  >
                    {displayTotal}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("home.label.saudiAccessions")}
                  </div>
                </Card>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── Charts Section ── */}
      <section className="bg-muted/30 border-t border-border py-10 sm:py-14">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <BarChart3 className="w-4 h-4" />
                {t("home.section.exploreData")}
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
                {t("home.section.exploreDataDesc")}
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Donut chart: Crop Distribution — no inline labels, use side legend */}
            <FadeUp delay={0.1}>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Dna className="w-4 h-4 text-primary" />
                    {t("home.chart.cropDistribution")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("home.chart.cropDistributionDesc")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Donut — no labels on the chart itself */}
                    <div className="w-full sm:w-1/2">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                            animationBegin={200}
                            animationDuration={1200}
                          >
                            {pieData.map((entry, idx) => (
                              <Cell
                                key={`cell-${idx}`}
                                fill={entry.color}
                                stroke="white"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Side legend with values */}
                    <div className="w-full sm:w-1/2 space-y-2">
                      {pieData.map((d) => {
                        const pct = Math.round(
                          (d.value / TOTAL_PASSPORT_ACCESSIONS) * 100,
                        );
                        return (
                          <div
                            key={d.name}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: d.color }}
                            />
                            <span className="flex-1 text-foreground truncate">
                              {d.name}
                            </span>
                            <span
                              className="font-bold tabular-nums"
                              style={{ color: d.color }}
                            >
                              {d.value}
                            </span>
                            <span className="text-[10px] text-muted-foreground w-8 text-end">
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>

            {/* Horizontal bar chart: Regional Overview — avoids angled labels */}
            <FadeUp delay={0.2}>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    {t("home.chart.regionalOverview")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("home.chart.regionalOverviewDesc")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div dir="ltr" className="w-full" style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={regionBarData}
                        layout="vertical"
                        margin={{ top: 4, right: 36, left: 0, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={56}
                          tick={{ fontSize: 11, fill: "#374151", fontWeight: 500 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="total" name={t("home.label.saudiAccessions")} radius={[0, 6, 6, 0]} animationDuration={1000} barSize={20}>
                          {regionBarData.map((_, idx) => (
                            <Cell key={idx} fill={idx === 0 ? "#0B5F3A" : idx < 3 ? "#1a7a52" : "#3d9970"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>

            {/* Stacked horizontal bar: Saudi vs International — no label overlap */}
            <FadeUp delay={0.3}>
              <Card className="overflow-hidden lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    {t("home.chart.saudiVsIntl")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("home.chart.saudiVsIntlDesc")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div dir="ltr" className="w-full" style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={originData}
                        layout="vertical"
                        margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={66}
                          tick={{ fontSize: 11, fill: "#374151", fontWeight: 500 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="circle" iconSize={8} />
                        <Bar dataKey={t("home.label.saudi")} stackId="origin" fill="#0B5F3A" radius={[0, 0, 0, 0]} animationDuration={1000} barSize={20} />
                        <Bar dataKey={t("home.label.international")} stackId="origin" fill="#D4AF37" radius={[0, 6, 6, 0]} animationDuration={1000} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
