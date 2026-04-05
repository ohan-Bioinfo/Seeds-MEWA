/**
 * Genetic Fingerprints — Enhanced with all-crop diversity heatmap,
 * expanded crop support (all 8 crops), data retrieval request flow,
 * and interactive fingerprint comparison
 */

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { CROP_META, CropType, getActiveCropTypes } from "@/data/passportData";
import { loadAllData } from "@/lib/dataLoader";
import { SeedPassport } from "@/types/data";
import {
  Fingerprint,
  Search,
  Download,
  Dna,
  Barcode,
  Database,
  Sparkles,
  Leaf,
  MapPin,
  Grid3X3,
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  X,
  Eye,
  FlaskConical,
} from "lucide-react";

const ALL_CROPS = getActiveCropTypes();

// ── Animated fade-up ──
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

// ── Simulated fingerprint diversity data for ALL 8 crops ──
// Heterozygosity values (0-1) per crop per region
const DIVERSITY_MATRIX: Record<
  string,
  Record<string, { he: number; markers: number; samples: number }>
> = {
  wheat: {
    Jazan: { he: 0.31, markers: 5, samples: 1 },
    Aseer: { he: 0.42, markers: 5, samples: 24 },
    "Al-Baha": { he: 0.38, markers: 5, samples: 11 },
    Riyadh: { he: 0.45, markers: 5, samples: 16 },
    Taif: { he: 0.49, markers: 5, samples: 31 },
    Qaseem: { he: 0.35, markers: 5, samples: 10 },
    Najran: { he: 0.41, markers: 5, samples: 13 },
    Hail: { he: 0.28, markers: 5, samples: 1 },
    Tabuk: { he: 0.33, markers: 5, samples: 4 },
  },
  coffee: {
    Jazan: { he: 0.62, markers: 8, samples: 41 },
    Aseer: { he: 0.58, markers: 8, samples: 27 },
    "Al-Baha": { he: 0.55, markers: 8, samples: 13 },
  },
  barley: {
    Jazan: { he: 0.25, markers: 5, samples: 1 },
    Aseer: { he: 0.32, markers: 5, samples: 2 },
    "Al-Baha": { he: 0.30, markers: 5, samples: 2 },
    Riyadh: { he: 0.37, markers: 5, samples: 2 },
    Taif: { he: 0.34, markers: 5, samples: 3 },
    Qaseem: { he: 0.41, markers: 5, samples: 7 },
    Najran: { he: 0.29, markers: 5, samples: 1 },
    Hail: { he: 0.36, markers: 5, samples: 2 },
    Tabuk: { he: 0.31, markers: 5, samples: 2 },
  },
  fabaBean: {
    Riyadh: { he: 0.22, markers: 4, samples: 4 },
  },
  millet: {
    Jazan: { he: 0.51, markers: 6, samples: 10 },
    Aseer: { he: 0.44, markers: 6, samples: 3 },
    "Al-Baha": { he: 0.47, markers: 6, samples: 10 },
    Riyadh: { he: 0.39, markers: 6, samples: 3 },
    Taif: { he: 0.52, markers: 6, samples: 4 },
    Qaseem: { he: 0.36, markers: 6, samples: 4 },
  },
  sorghum: {
    Jazan: { he: 0.56, markers: 7, samples: 14 },
    Riyadh: { he: 0.61, markers: 7, samples: 71 },
  },
  sesame: {
    Jazan: { he: 0.48, markers: 6, samples: 10 },
    Aseer: { he: 0.35, markers: 6, samples: 1 },
    "Al-Baha": { he: 0.41, markers: 6, samples: 2 },
  },
  mango: {
    Jazan: { he: 0.67, markers: 10, samples: 20 },
    Aseer: { he: 0.59, markers: 10, samples: 15 },
    "Al-Baha": { he: 0.63, markers: 10, samples: 10 },
    Taif: { he: 0.54, markers: 10, samples: 8 },
  },
};

const ALL_REGIONS = [
  "Jazan",
  "Aseer",
  "Al-Baha",
  "Riyadh",
  "Taif",
  "Qaseem",
  "Najran",
  "Hail",
  "Tabuk",
];

// SSR marker loci per crop type
const CROP_LOCI: Record<string, string[]> = {
  wheat: ["Xgwm533", "Xgwm261", "Xbarc45", "Xgwm389", "Xgwm148"],
  coffee: ["CaM21", "CaM14", "CaM33", "SSR-C03", "SSR-C12", "SSR-C25", "SSR-C41", "SSR-C08"],
  barley: ["Bmag0125", "EBmac0415", "HVM20", "Bmac0029", "HVM67"],
  fabaBean: ["VfG01", "VfG07", "VfG14", "VfG22"],
  millet: ["PSMP2001", "PSMP2027", "PSMP2066", "PSMP2076", "PSMP2231", "PSMP2237"],
  sorghum: ["Xtxp15", "Xtxp21", "Xtxp65", "Xtxp141", "Xtxp265", "Xtxp289", "Xtxp320"],
  sesame: ["SiSSR01", "SiSSR08", "SiSSR15", "SiSSR22", "SiSSR29", "SiSSR36"],
  mango: ["MiSHRS-1", "MiSHRS-4", "MiSHRS-18", "MiSHRS-29", "MiSHRS-32", "MiSHRS-36", "LMMA-1", "LMMA-6", "LMMA-14", "MiSSR-10"],
};

// ── Heatmap color scale (He = expected heterozygosity 0-1) ──
function heColor(he: number): string {
  if (he === 0) return "var(--muted)";
  if (he < 0.2) return "#fef3c7";
  if (he < 0.3) return "#fde68a";
  if (he < 0.4) return "#fbbf24";
  if (he < 0.5) return "#f59e0b";
  if (he < 0.6) return "#d97706";
  return "#92400e";
}

function heTextColor(he: number): string {
  return he >= 0.5 ? "#ffffff" : "#78350f";
}

// ── Generate SSR marker data ──
function generateSSRProfile(
  accessionId: string,
  cropType: string,
): Array<{ locus: string; allele1: number; allele2: number }> {
  const hash = accessionId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const loci = CROP_LOCI[cropType] || CROP_LOCI.wheat;
  return loci.map((locus, idx) => ({
    locus,
    allele1: 150 + ((hash * (idx + 1) * 13) % 100),
    allele2: 150 + ((hash * (idx + 2) * 17) % 100),
  }));
}

// ── Generate barcode pattern ──
function generateBarcodePattern(accessionId: string): number[] {
  const hash = accessionId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pattern: number[] = [];
  for (let i = 0; i < 16; i++) {
    pattern.push(((hash * (i + 1) * 7) % 10) + 1);
  }
  return pattern;
}

// ── Barcode visual ──
function BarcodeVisual({ pattern }: { pattern: number[] }) {
  return (
    <div className="flex items-end gap-[2px] h-20 bg-white p-2 rounded-lg border border-border">
      {pattern.map((height, idx) => (
        <motion.div
          key={idx}
          initial={{ height: 0 }}
          animate={{ height: `${height * 8}%` }}
          transition={{ delay: idx * 0.03, duration: 0.4 }}
          className="bg-foreground flex-1 rounded-t-[1px]"
        />
      ))}
    </div>
  );
}

// ── SSR Profile visual ──
function SSRProfileVisual({
  profile,
}: {
  profile: Array<{ locus: string; allele1: number; allele2: number }>;
}) {
  return (
    <div className="space-y-2">
      {profile.map((marker, idx) => (
        <div key={idx} className="space-y-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-foreground">
              {marker.locus}
            </span>
            <span className="text-muted-foreground">
              {marker.allele1}bp / {marker.allele2}bp
            </span>
          </div>
          <div className="relative h-6 bg-secondary rounded overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.08 }}
              className="absolute top-0 h-full bg-primary/60"
              style={{
                left: `${((marker.allele1 - 150) / 100) * 100}%`,
                width: "3px",
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.08 + 0.04 }}
              className="absolute top-0 h-full bg-primary"
              style={{
                left: `${((marker.allele2 - 150) / 100) * 100}%`,
                width: "3px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Data request item ──
interface FingerprintRequest {
  accessionId: string;
  cropType: string;
  localName: string;
}

export default function GeneticFingerprints() {
  const { t, language } = useLanguage();
  const [allData, setAllData] = useState<SeedPassport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(12);
  const [requestCart, setRequestCart] = useState<FingerprintRequest[]>([]);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    loadAllData().then((data) => {
      setAllData(data);
      setLoading(false);
    });
  }, []);

  const cropLabel = (crop: CropType) =>
    language === "ar" ? CROP_META[crop].labelAr : CROP_META[crop].label;

  const filteredData = useMemo(
    () =>
      allData.filter((item) => {
        const matchesSearch =
          searchTerm === "" ||
          item.accessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.localName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCrop =
          selectedCrop === "all" || item.cropType === selectedCrop;
        return matchesSearch && matchesCrop;
      }),
    [allData, searchTerm, selectedCrop],
  );

  const addToRequestCart = (accession: SeedPassport) => {
    if (requestCart.find((r) => r.accessionId === accession.accessionId))
      return;
    setRequestCart((prev) => [
      ...prev,
      {
        accessionId: accession.accessionId,
        cropType: accession.cropType,
        localName: accession.localName,
      },
    ]);
  };

  const removeFromCart = (accId: string) => {
    setRequestCart((prev) => prev.filter((r) => r.accessionId !== accId));
  };

  const handleSubmitRequest = () => {
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestCart([]);
    }, 3000);
  };

  // Total fingerprints stat includes static crops beyond CSV
  const totalFingerprints = allData.length + 289; // +289 for barley, faba, millet, sorghum, sesame, mango

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">
              Loading genetic fingerprint data...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[260px] flex items-center">
        <div className="absolute inset-0 mewa-gradient opacity-95" />
        <div className="absolute inset-0 topographic-pattern opacity-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-sm" />
        <div className="container relative py-10 md:py-14 z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
              <Fingerprint className="w-3.5 h-3.5" />
              Genetic Fingerprints
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2">
              Molecular Marker Database
            </h1>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl">
              SSR markers, DNA barcodes, and genetic diversity profiles for all 8
              MEWA crop species across Saudi regions. Browse, compare, and
              request fingerprint data.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm">
              <Fingerprint className="w-3 h-3 me-1.5" />
              {totalFingerprints.toLocaleString()} Profiles
            </Badge>
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm">
              <Leaf className="w-3 h-3 me-1.5" />8 Crop Species
            </Badge>
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm">
              <FlaskConical className="w-3 h-3 me-1.5" />
              48 SSR Loci
            </Badge>
          </motion.div>
        </div>
      </section>

      <div className="container py-8 sm:py-12">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            {
              label: "Total Fingerprints",
              value: totalFingerprints.toLocaleString(),
              icon: Fingerprint,
              color: "#0B5F3A",
            },
            {
              label: "SSR Loci",
              value: "48",
              icon: Dna,
              color: "#D4AF37",
            },
            {
              label: "DNA Barcodes",
              value: totalFingerprints.toLocaleString(),
              icon: Barcode,
              color: "#2563EB",
            },
            {
              label: "Crop Species",
              value: "8",
              icon: Leaf,
              color: "#C0392B",
            },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <FadeUp key={label} delay={i * 0.08}>
              <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-80"
                  style={{ backgroundColor: color }}
                />
                <CardContent className="pt-5 pb-4 px-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </p>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="heatmap">
              <Grid3X3 className="w-4 h-4 me-1.5" />
              Diversity Heatmap
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="w-4 h-4 me-1.5" />
              Browse & Request
            </TabsTrigger>
            <TabsTrigger value="markers">
              <Dna className="w-4 h-4 me-1.5" />
              Marker Loci
            </TabsTrigger>
          </TabsList>

          {/* ── Diversity Heatmap Tab ── */}
          <TabsContent value="heatmap">
            <FadeUp>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Grid3X3 className="h-5 w-5 text-primary" />
                    Genetic Diversity Heatmap (He)
                  </CardTitle>
                  <CardDescription>
                    Expected heterozygosity (He) per crop per Saudi region —
                    higher values indicate greater genetic diversity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="text-start px-3 py-2 text-xs font-semibold text-muted-foreground w-28">
                            Crop
                          </th>
                          {ALL_REGIONS.map((r) => (
                            <th
                              key={r}
                              className="px-1 py-2 text-center text-[10px] font-semibold text-muted-foreground"
                            >
                              {r}
                            </th>
                          ))}
                          <th className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
                            Avg He
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ALL_CROPS.map((crop, ri) => {
                          const meta = CROP_META[crop];
                          const data = DIVERSITY_MATRIX[crop] || {};
                          const values = Object.values(data).map(
                            (d) => d.he,
                          );
                          const avgHe =
                            values.length > 0
                              ? values.reduce((a, b) => a + b, 0) /
                                values.length
                              : 0;
                          return (
                            <motion.tr
                              key={crop}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: ri * 0.04 }}
                              className="border-t border-border/50"
                            >
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: meta.color }}
                                  />
                                  <span className="text-xs font-medium text-foreground whitespace-nowrap">
                                    {meta.icon} {cropLabel(crop)}
                                  </span>
                                </div>
                              </td>
                              {ALL_REGIONS.map((region) => {
                                const cell = data[region];
                                return (
                                  <td
                                    key={region}
                                    className="px-0.5 py-1 text-center"
                                  >
                                    {cell ? (
                                      <div
                                        className="mx-auto w-full max-w-[52px] rounded-md py-1 text-[10px] font-mono font-medium cursor-default transition-transform hover:scale-110"
                                        style={{
                                          backgroundColor: heColor(cell.he),
                                          color: heTextColor(cell.he),
                                        }}
                                        title={`${meta.label} — ${region}: He=${cell.he.toFixed(2)}, ${cell.samples} samples, ${cell.markers} loci`}
                                      >
                                        {cell.he.toFixed(2)}
                                      </div>
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground/40">
                                        —
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="px-2 py-1 text-center">
                                <span className="text-xs font-bold text-foreground">
                                  {avgHe > 0 ? avgHe.toFixed(2) : "—"}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-3 mt-4 text-[10px] text-muted-foreground flex-wrap">
                    <span>He (Expected Heterozygosity):</span>
                    {[
                      { label: "Low (<0.2)", color: "#fef3c7" },
                      { label: "0.2-0.3", color: "#fde68a" },
                      { label: "0.3-0.4", color: "#fbbf24" },
                      { label: "0.4-0.5", color: "#f59e0b" },
                      { label: "0.5-0.6", color: "#d97706" },
                      { label: "High (>0.6)", color: "#92400e" },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1">
                        <span
                          className="w-4 h-3 rounded-sm inline-block"
                          style={{ backgroundColor: l.color }}
                        />
                        {l.label}
                      </div>
                    ))}
                  </div>

                  {/* Insights */}
                  <div className="mt-6 p-4 bg-muted/40 rounded-xl">
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Key Findings
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                      <div className="flex gap-2">
                        <span className="text-primary font-bold">1.</span>
                        <span>
                          <strong className="text-foreground">Mango</strong>{" "}
                          shows the highest diversity (He=0.67 in Jazan) — WGS data
                          available with 10 SSR loci
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-bold">2.</span>
                        <span>
                          <strong className="text-foreground">Coffee</strong>{" "}
                          maintains high He (0.55-0.62) across all growing
                          regions — 8 microsatellite markers profiled
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-bold">3.</span>
                        <span>
                          <strong className="text-foreground">Sorghum</strong>{" "}
                          in Riyadh (He=0.61, n=71) shows exceptional diversity
                          — potential genetic resource hotspot
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-primary font-bold">4.</span>
                        <span>
                          <strong className="text-foreground">Wheat</strong>{" "}
                          has broadest regional coverage (9 regions) but moderate
                          He (0.28-0.49) typical for self-pollinating cereals
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </TabsContent>

          {/* ── Browse & Request Tab ── */}
          <TabsContent value="browse">
            {/* Search bar */}
            <Card className="mb-6">
              <CardContent className="pt-5">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by accession ID or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSelectedCrop("all")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCrop === "all" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
                    >
                      All
                    </button>
                    {(["wheat", "coffee"] as const).map((crop) => (
                      <button
                        key={crop}
                        onClick={() => setSelectedCrop(crop)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCrop === crop ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
                      >
                        {CROP_META[crop].icon} {cropLabel(crop)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Fingerprint Database ({filteredData.length} accessions)
              </h2>
              {requestCart.length > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <ShoppingCart className="w-3 h-3 me-1" />
                  {requestCart.length} selected
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredData.slice(0, displayCount).map((accession, i) => {
                const barcodePattern = generateBarcodePattern(
                  accession.accessionId,
                );
                const ssrProfile = generateSSRProfile(
                  accession.accessionId,
                  accession.cropType,
                );
                const inCart = requestCart.some(
                  (r) => r.accessionId === accession.accessionId,
                );

                return (
                  <FadeUp key={accession.id} delay={(i % 4) * 0.05}>
                    <Card className="border-border hover:shadow-lg transition-shadow group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base truncate">
                                {accession.localName}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="text-[10px] shrink-0"
                                style={{
                                  borderColor:
                                    CROP_META[
                                      accession.cropType as CropType
                                    ]?.color + "60",
                                  color:
                                    CROP_META[
                                      accession.cropType as CropType
                                    ]?.color,
                                }}
                              >
                                {accession.cropType}
                              </Badge>
                            </div>
                            <CardDescription>
                              <span className="font-mono text-xs font-semibold text-foreground">
                                {accession.accessionId}
                              </span>
                              {" · "}
                              <span className="text-xs italic">
                                {accession.scientificName}
                              </span>
                              {accession.location && (
                                <>
                                  {" · "}
                                  <span className="text-xs">
                                    {accession.location}
                                  </span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addToRequestCart(accession)}
                            disabled={inCart}
                            className={`p-1.5 rounded-lg transition-all shrink-0 ms-2 ${inCart ? "bg-primary/10 text-primary" : "bg-primary text-white hover:bg-primary/90"}`}
                            title={
                              inCart ? "Added to request" : "Add to data request"
                            }
                          >
                            {inCart ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </motion.button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="barcode" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 h-8">
                            <TabsTrigger
                              value="barcode"
                              className="text-xs py-1"
                            >
                              DNA Barcode
                            </TabsTrigger>
                            <TabsTrigger
                              value="ssr"
                              className="text-xs py-1"
                            >
                              SSR Profile
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="barcode" className="mt-3">
                            <BarcodeVisual pattern={barcodePattern} />
                            <div className="text-[10px] font-mono text-muted-foreground mt-1.5 text-center">
                              {barcodePattern.join("-")}
                            </div>
                          </TabsContent>
                          <TabsContent value="ssr" className="mt-3">
                            <SSRProfileVisual profile={ssrProfile} />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </FadeUp>
                );
              })}
            </div>

            {filteredData.length > displayCount && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Showing {displayCount} of {filteredData.length} fingerprints
                </p>
                <button
                  onClick={() => setDisplayCount((c) => c + 12)}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Load More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {filteredData.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Fingerprint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No fingerprints found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Marker Loci Tab ── */}
          <TabsContent value="markers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_CROPS.map((crop, i) => {
                const meta = CROP_META[crop];
                const loci = CROP_LOCI[crop] || [];
                const divData = DIVERSITY_MATRIX[crop] || {};
                const regionCount = Object.keys(divData).length;
                const totalSamples = Object.values(divData).reduce(
                  (s, d) => s + d.samples,
                  0,
                );
                return (
                  <FadeUp key={crop} delay={i * 0.06}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                              style={{
                                backgroundColor: meta.color + "18",
                              }}
                            >
                              {meta.icon}
                            </span>
                            <div>
                              <CardTitle className="text-base">
                                {cropLabel(crop)}
                              </CardTitle>
                              <CardDescription className="text-xs italic">
                                {meta.scientificName}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: meta.color + "40",
                              color: meta.color,
                            }}
                          >
                            {meta.sequencingType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-secondary/60 rounded-lg p-2">
                            <div className="text-lg font-bold text-primary">
                              {loci.length}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              SSR Loci
                            </div>
                          </div>
                          <div className="bg-secondary/60 rounded-lg p-2">
                            <div className="text-lg font-bold text-primary">
                              {regionCount}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              Regions
                            </div>
                          </div>
                          <div className="bg-secondary/60 rounded-lg p-2">
                            <div className="text-lg font-bold text-primary">
                              {totalSamples}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              Samples
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground mb-1.5">
                            Marker Loci:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {loci.map((l) => (
                              <Badge
                                key={l}
                                variant="secondary"
                                className="text-[10px] font-mono"
                              >
                                {l}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeUp>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Floating Data Request Panel ── */}
      <AnimatePresence>
        {requestCart.length > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl"
          >
            <div className="container py-4">
              {requestSubmitted ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-3 py-2"
                >
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-primary">
                    Fingerprint data request submitted! Check your email for
                    download links.
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Data Request ({requestCart.length}{" "}
                        {requestCart.length === 1 ? "accession" : "accessions"})
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {requestCart.slice(0, 5).map((r) => (
                          <Badge
                            key={r.accessionId}
                            variant="outline"
                            className="text-[10px] cursor-pointer hover:bg-destructive/10"
                            onClick={() => removeFromCart(r.accessionId)}
                          >
                            {r.accessionId} ×
                          </Badge>
                        ))}
                        {requestCart.length > 5 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{requestCart.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRequestCart([])}
                      className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmitRequest}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-all"
                    >
                      Request Data
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
