/**
 * Main Dashboard: Saudi Seed Passport Explorer
 * Split-screen layout with interactive map + region stats + crop breakdown
 * Uses static passport data for all 8 crops with passport information
 * Fully translated (Arabic/English), mobile-responsive
 */

import { useState, useMemo } from "react";
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
  getActiveCropTypes,
  REGION_CROP_DATA,
} from "@/data/passportData";
import { Database, MapPin, Filter, X } from "lucide-react";

const ALL_CROPS = getActiveCropTypes();

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

  const activeCropsForDisplay =
    selectedCrops.length > 0 ? selectedCrops : ALL_CROPS;

  // Crop label depends on language
  const cropLabel = (crop: CropType) =>
    language === "ar" ? CROP_META[crop].labelAr : CROP_META[crop].label;

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section
        className="relative bg-cover bg-center min-h-[260px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.88)), url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663143815567/QTUbrtcxBhCTLZiY.jpg')`,
        }}
      >
        <div className="absolute inset-0 topographic-pattern opacity-30" />
        <div className="container relative py-10 md:py-14">
          {/* SEO: single h1 per page */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary mb-3 leading-tight">
            {t("home.hero.title")}
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 max-w-2xl">
            {t("home.hero.description")}
          </p>
          {/* Summary badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="bg-white/80 border-primary text-primary">
              <Database className="w-3 h-3 me-1" />
              {TOTAL_PASSPORT_ACCESSIONS.toLocaleString()} {t("home.badge.totalAccessions")}
            </Badge>
            <Badge variant="outline" className="bg-white/80 border-primary text-primary">
              8 {t("home.badge.cropsWithData")}
            </Badge>
            <Badge variant="outline" className="bg-white/80 border-primary text-primary">
              <MapPin className="w-3 h-3 me-1" />9 {t("home.badge.saudiRegions")}
            </Badge>
          </div>
        </div>
      </section>

      {/* ── Crop tiles strip ── */}
      <section className="bg-muted/40 border-b border-border py-4">
        <div className="container">
          {/* 4 cols on mobile, 4 on sm, 8 on lg */}
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
            {ALL_CROPS.map((crop) => {
              const meta = CROP_META[crop];
              const total = meta.totalAccessions;
              return (
                <button
                  key={crop}
                  onClick={() => handleCropToggle(crop)}
                  className={`flex flex-col items-center p-2 sm:p-3 rounded-lg border-2 transition-all cursor-pointer text-center hover:shadow-md ${
                    selectedCrops.includes(crop)
                      ? "border-primary shadow-md scale-105"
                      : selectedCrops.length === 0
                        ? "border-border bg-card hover:border-primary/50"
                        : "border-border bg-card opacity-50 hover:opacity-80"
                  }`}
                  title={`${meta.scientificName} — ${total} ${t("home.label.accessions")}`}
                >
                  <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{meta.icon}</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground truncate w-full leading-tight">
                    {cropLabel(crop)}
                  </span>
                  <span
                    className="text-base sm:text-lg font-bold mt-0.5"
                    style={{ color: meta.color }}
                  >
                    {total}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                    {t("home.label.accessions")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active filter bar */}
          {(selectedCrops.length > 0 || selectedRegion) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
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
                  📍 {selectedRegion} ×
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-destructive hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> {t("home.label.clearAll")}
              </button>
            </div>
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
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 px-4 pt-4">
                    <CardTitle className="text-sm sm:text-base flex flex-wrap items-center gap-1">
                      <span>{t("home.map.description")} —</span>
                      <span>
                        {t("home.label.showingSaudi").replace("{n}", String(displayTotal))}
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
                      <button
                        key={stat.region}
                        onClick={() => handleRegionClick(stat.region)}
                        className={`text-start bg-card border rounded-lg p-4 hover:shadow-md transition-all ${
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
                              const pct = Math.round((count / stat.total) * 100);
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
                      </button>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Right sidebar ── */}
          <div className="lg:col-span-1 space-y-4">
            {selectedRegionData ? (
              /* Region detail panel */
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
            ) : (
              /* Overall passport summary */
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
                    {ALL_CROPS.map((crop) => {
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
                              🇸🇦 {saudiCount} {t("home.label.saudiCount")} ({saudiPct}%)
                            </span>
                            <span className="italic">
                              {meta.scientificName}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
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
            )}

            {/* Quick stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">
                  {regionData.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t("home.label.activeRegions")}
                </div>
              </Card>
              <Card className="p-3 text-center">
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
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
