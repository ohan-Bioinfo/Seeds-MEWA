/**
 * Research & Community Hub — Unified page
 * Merges: Research Hub (22 studies, 2009–2025) + Scientific Community (researchers, institutions)
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Users, FileText, Dna, Sprout, Shield, Mail,
  MapPin, Building2, Globe, GraduationCap, FlaskConical,
  Microscope, Award,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "@/components/PageLayout";

// ── Animation helpers (matching other enhanced pages) ──────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

// ── Research Data ──────────────────────────────────────────────────────────

const DIRECT_SAUDI_STUDIES = [
  {
    code: "SAU-CROP-001",
    title: "Shaping the future of date palm through new genetic improvement strategies",
    crop: "Date Palm", year: 2025,
    markers: ["CRISPR-Cas9", "SNP", "Transcriptome", "Metabolome"],
    authors: "Nasser Al Kaabi et al.", journal: "Functional Plant Biology",
    type: "Saudi Direct", focus: "Genetic improvement & editing",
  },
  {
    code: "SAU-CROP-002",
    title: "Correlation and genetic analyses in Saudi Arabian wheat reveal correlation networks and several trait-associated markers",
    crop: "Wheat", year: 2020,
    markers: ["ISSR", "SSR", "SCoT"],
    authors: "Mohammed Ali Alshehri et al.", journal: "ELEWA Biosciences",
    type: "Saudi Direct", focus: "19 primers · 195 alleles · 60% polymorphism",
  },
  {
    code: "SAU-CROP-003",
    title: "CRISPR/Cas9: A Practical Approach in Date Palm Genome Editing",
    crop: "Date Palm", year: 2017,
    markers: ["CRISPR/Cas9", "Whole Genome"],
    authors: "Muhammad Naeem Sattar et al.", journal: "Frontiers Media",
    type: "Saudi Direct", focus: "Genome editing — first Saudi application",
  },
  {
    code: "SAU-CROP-004",
    title: "Harnessing rhizospheric core microbiomes from arid regions for enhancing date palm resilience to climate change effects",
    crop: "Date Palm", year: 2024,
    markers: ["Microbiome Genomics", "Stress Response Genes"],
    authors: "Ameni Ben Zineb et al.", journal: "Frontiers Media",
    type: "Saudi Direct", focus: "Climate resilience via microbiome",
  },
];

const REGIONAL_STUDIES = [
  { title: "Recent advances in date palm genomics: A comprehensive review", crop: "Date Palm", year: 2022, authors: "Hifzur Rahman et al.", journal: "Frontiers Media", category: "Date Palm Genomics" },
  { title: "Genetic Diversity and Adaptation of Date Palm (Phoenix dactylifera L.)", crop: "Date Palm", year: 2009, authors: "Sakina Elshibli", journal: "—", category: "Date Palm Genomics" },
  { title: "Phoenix dactylifera in vitro culture and transformation of Thio-60 antifungal gene via chitosan nanoparticle", crop: "Date Palm", year: 2023, authors: "Kholoud Abd Allah et al.", journal: "Springer", category: "Date Palm Genomics" },
  { title: "How to Cope With Stress in the Desert—The Date Palm Approach", crop: "Date Palm", year: 2024, authors: "Baoguo Du et al.", journal: "Wiley", category: "Stress Tolerance" },
  { title: "Applicability of Start Codon Targeted (SCoT) markers for the assessment of genetic diversity in bread wheat germplasm", crop: "Wheat", year: 2024, authors: "Muhammad Tanveer Altaf et al.", journal: "Springer", category: "Stress Tolerance" },
  { title: "A Blueprint for Building Resilience and Food Security in MENA and SSA Drylands: Diversifying Agriculture With Neglected and Underutilized Species", crop: "Multiple (26 NUS crops)", year: 2025, authors: "Krishna Prasad Devkota et al.", journal: "Wiley", category: "Food Security" },
  { title: "Oasis agriculture revitalization and carbon sequestration for climate-resilient communities", crop: "Multiple", year: 2024, authors: "Faten Dhawi & Megbel Aleidan", journal: "Frontiers Media", category: "Food Security" },
];

const DROUGHT_STUDIES = [
  { title: "Molecular and agro-morphological diversity assessment of some bread wheat genotypes and their crosses for drought tolerance", authors: "Mohamed A. Ezzat et al.", year: 2024, journal: "PeerJ Inc.", markers: ["ISSR", "SCoT"], note: "Saudi-applicable wheat breeding" },
  { title: "Multivariate Analysis of Morpho-Physiological Traits Reveals Differential Drought Tolerance Potential of Bread Wheat Genotypes at the Seedling Stage", authors: "Mohammed Mohi-Ud-Din et al.", year: 2021, journal: "MDPI", markers: ["Morpho-physiological"], note: "127 genotypes · 90% accuracy" },
  { title: "ISSR Markers-Trait Associations and Stability Analysis in Bread Wheat Varieties", authors: "M.H. Motawea et al.", year: 2015, journal: "—", markers: ["ISSR"], note: "7 drought-tolerant varieties identified (DSI<1)" },
  { title: "Plant responses to environmental stresses—from gene to biotechnology", authors: "Mohammad Ahanger et al.", year: 2017, journal: "Oxford University Press", markers: ["Review"], note: "Comprehensive stress response review" },
  { title: "Salt-Tolerant Crops: Time to Deliver", authors: "Vanessa Melino & Mark Tester", year: 2023, journal: "Annual Reviews", markers: ["Review"], note: "Salinity tolerance strategies for arid regions" },
];

const VEGETABLE_STUDIES = [
  { title: "Exploring Genetic Variability among and within Hail Tomato Landraces Based on Sequence-Related Amplified Polymorphism Markers", authors: "Reem H. Alzahib et al.", year: 2021, journal: "MDPI", region: "Hail, Saudi Arabia", polymorphism: "100%", note: "Direct Saudi Arabia study" },
  { title: "Morphological, Biochemical, and Molecular Diversity Assessment of Egyptian Bottle Gourd Cultivars", authors: "Ehab A. Ibrahim et al.", year: 2024, journal: "Cambridge University Press", region: "Regional (applicable to KSA)", polymorphism: "—", note: "Vegetable genetic diversity" },
  { title: "Assessment of genetic variability among Jordanian tomato landrace using inter-simple sequence repeats markers", authors: "Mohammad Brake et al.", year: 2021, journal: "Hashemite University", region: "Regional context", polymorphism: "—", note: "Tomato landrace conservation" },
];

const SEED_BANKING_STUDIES = [
  { title: "Effective seedbank management to ensure food security and preserve biodiversity", authors: "Samik Bhattacharya & Klaus Mummenhoff", year: 2024, journal: "Springer", relevance: "Genomic viability prediction models for seed banks" },
  { title: "A Blueprint for Building Resilience and Food Security in MENA Drylands", authors: "Krishna Prasad Devkota et al.", year: 2025, journal: "Wiley", relevance: "26 neglected/underutilized species documented for MENA region" },
  { title: "Oasis agriculture revitalization and carbon sequestration for climate-resilient communities", authors: "Faten Dhawi & Megbel Aleidan", year: 2024, journal: "Frontiers Media", relevance: "Traditional oasis agricultural system revitalization" },
];

const MARKER_STATS = [
  { marker: "SCoT", count: "8+", desc: "Start Codon Targeted" },
  { marker: "SSR", count: "6+", desc: "Microsatellites" },
  { marker: "ISSR", count: "6+", desc: "Inter-Simple Sequence Repeat" },
  { marker: "CRISPR-Cas9", count: "2", desc: "Genome editing" },
  { marker: "SNP/AFLP/SRAP/RAPD", count: "Multiple", desc: "Supporting markers" },
];

const RECOMMENDATIONS = [
  { num: 1, title: "Establish Saudi Crop Genomics Consortium", detail: "Link universities and research centers" },
  { num: 2, title: "Develop Bread Wheat & Date Palm SNP Arrays", detail: "Cost-effective genotyping for breeding" },
  { num: 3, title: "Create Crop Germplasm Database", detail: "Similar to CAGBASE (camel) but for crops" },
  { num: 4, title: "Expand Seed Banking Genomic Programs", detail: "Use viability prediction models" },
  { num: 5, title: "Integrate Climate Resilience Breeding", detail: "Focus on drought/heat tolerance traits" },
  { num: 6, title: "Document Landrace Genetic Resources", detail: "Preserve Hail tomato and other local varieties" },
  { num: 7, title: "Support Multi-Crop GWAS Studies", detail: "Larger cohorts for statistical power" },
];

const CROP_BADGES: Record<string, string> = {
  "Date Palm": "#C2410C",
  "Wheat": "#166534",
  "Multiple": "#7C3AED",
  "Multiple (26 NUS crops)": "#7C3AED",
};

// ── Community Data ─────────────────────────────────────────────────────────

const RESEARCHERS = [
  { name: "Dr. Fahad Al-Otaibi", title: "Professor of Plant Breeding", institution: "King Saud University", location: "Riyadh, Saudi Arabia", expertise: ["Wheat breeding", "Drought tolerance", "Molecular markers"], projects: 8, publications: 34 },
  { name: "Dr. Noura Al-Ghamdi", title: "Senior Researcher", institution: "MEWA Research Center", location: "Jeddah, Saudi Arabia", expertise: ["Coffee genetics", "Germplasm conservation", "Diversity analysis"], projects: 6, publications: 22 },
  { name: "Dr. Mohammed Al-Shehri", title: "Associate Professor", institution: "King Abdulaziz University", location: "Jeddah, Saudi Arabia", expertise: ["Barley breeding", "Disease resistance", "QTL mapping"], projects: 7, publications: 28 },
  { name: "Dr. Sara Al-Dosari", title: "Assistant Professor", institution: "Qassim University", location: "Buraydah, Saudi Arabia", expertise: ["Date palm genetics", "Tissue culture", "Quality traits"], projects: 5, publications: 18 },
  { name: "Dr. Ahmed Al-Qahtani", title: "Germplasm Curator", institution: "MEWA Seed Center", location: "Riyadh, Saudi Arabia", expertise: ["Seed conservation", "Passport data", "Characterization"], projects: 12, publications: 31 },
  { name: "Dr. Layla Al-Harbi", title: "Research Scientist", institution: "KACST", location: "Riyadh, Saudi Arabia", expertise: ["Genomics", "Bioinformatics", "Gene expression"], projects: 9, publications: 26 },
];

const INSTITUTIONS = [
  { name: "King Saud University", type: "University", location: "Riyadh", country: "Saudi Arabia", researchers: 18, projects: 12 },
  { name: "King Abdulaziz University", type: "University", location: "Jeddah", country: "Saudi Arabia", researchers: 14, projects: 9 },
  { name: "Qassim University", type: "University", location: "Buraydah", country: "Saudi Arabia", researchers: 11, projects: 7 },
  { name: "KAUST", type: "Research Institute", location: "Thuwal", country: "Saudi Arabia", researchers: 9, projects: 6 },
  { name: "KACST", type: "Research Institute", location: "Riyadh", country: "Saudi Arabia", researchers: 16, projects: 11 },
  { name: "ICARDA", type: "International Organization", location: "Beirut", country: "Lebanon", researchers: 8, projects: 5 },
  { name: "FAO", type: "International Organization", location: "Rome", country: "Italy", researchers: 5, projects: 4 },
  { name: "CIMMYT", type: "International Organization", location: "Mexico City", country: "Mexico", researchers: 6, projects: 3 },
  { name: "University of California Davis", type: "University", location: "Davis, CA", country: "United States", researchers: 4, projects: 2 },
];

// ── KPI data ───────────────────────────────────────────────────────────────

const KPI_DATA = [
  { labelKey: "rc.kpi.studies", target: 22, icon: BookOpen, sub: "rc.kpi.studiesSub" },
  { labelKey: "rc.kpi.researchers", target: 127, icon: Users, sub: "rc.kpi.researchersSub" },
  { labelKey: "rc.kpi.institutions", target: 42, icon: Building2, sub: "rc.kpi.institutionsSub" },
  { labelKey: "rc.kpi.countries", target: 18, icon: Globe, sub: "rc.kpi.countriesSub" },
  { labelKey: "rc.kpi.collaborations", target: 89, icon: FlaskConical, sub: "rc.kpi.collaborationsSub" },
  { labelKey: "rc.kpi.markers", target: 8, icon: Dna, sub: "rc.kpi.markersSub", suffix: "+" },
];

// ── Animated KPI Card ──────────────────────────────────────────────────────

function KpiCard({ labelKey, target, icon: Icon, sub, suffix = "", delay }: {
  labelKey: string; target: number; icon: React.ElementType; sub: string; suffix?: string; delay: number;
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
            <div className="text-3xl font-bold text-primary">{value}{suffix}</div>
            <div className="text-sm font-medium text-foreground mt-1">{t(labelKey)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{t(sub)}</div>
          </CardContent>
        </Card>
      </div>
    </FadeUp>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ResearchHub() {
  const { t, dir } = useLanguage();
  const isRTL = dir === "rtl";

  return (
    <PageLayout>
      {/* ── Dark gradient hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a0e] via-[#122117] to-[#0a1e12] text-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--mewa-green)] rounded-full blur-[160px] opacity-[0.07]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--mewa-gold)] rounded-full blur-[140px] opacity-[0.05]" />

        <div className="container relative py-16 md:py-20">
          <FadeUp>
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Microscope className="h-5 w-5 text-[var(--mewa-gold)]" />
              <span className="text-sm font-medium tracking-wide text-[var(--mewa-gold)] uppercase">
                {t("rc.hero.badge")}
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className={`text-3xl md:text-5xl font-bold mb-4 leading-tight ${isRTL ? "text-right" : ""}`}>
              {t("rc.hero.title")}
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className={`text-lg md:text-xl text-white/70 max-w-2xl mb-6 ${isRTL ? "text-right mr-0 ml-auto" : ""}`}>
              {t("rc.hero.subtitle")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── KPI strip ── */}
      <section className="container -mt-8 relative z-10 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {KPI_DATA.map((kpi, i) => (
            <KpiCard key={kpi.labelKey} {...kpi} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── Main content with tabs ── */}
      <section className="container pb-16">
        <Tabs defaultValue="saudi" className="w-full">
          <FadeUp>
            <TabsList className="flex flex-wrap w-full h-auto gap-1 mb-8 bg-secondary/50 p-1.5 rounded-xl">
              {[
                { value: "saudi", icon: Shield, labelKey: "rc.tab.saudi" },
                { value: "regional", icon: BookOpen, labelKey: "rc.tab.regional" },
                { value: "drought", icon: Dna, labelKey: "rc.tab.drought" },
                { value: "vegetables", icon: Sprout, labelKey: "rc.tab.vegetables" },
                { value: "gaps", icon: Award, labelKey: "rc.tab.gaps" },
                { value: "researchers", icon: GraduationCap, labelKey: "rc.tab.researchers" },
                { value: "institutions", icon: Building2, labelKey: "rc.tab.institutions" },
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

          {/* ── Saudi Direct Studies ── */}
          <TabsContent value="saudi" className="space-y-4">
            <FadeUp>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">{t("rc.saudi.heading")}</h2>
                  <p className="text-sm text-muted-foreground">{t("rc.saudi.sub")}</p>
                </div>
              </div>
            </FadeUp>
            {DIRECT_SAUDI_STUDIES.map((s, i) => (
              <FadeUp key={s.code} delay={i * 0.08}>
                <Card className="border-primary/30 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 mb-1 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Badge className="bg-primary text-xs">{s.code}</Badge>
                          <Badge variant="outline" className="text-xs" style={{ color: CROP_BADGES[s.crop] || "#166534", borderColor: CROP_BADGES[s.crop] || "#166534" }}>{s.crop}</Badge>
                          <span className="text-xs text-muted-foreground">{s.year}</span>
                        </div>
                        <CardTitle className="text-base leading-snug">{s.title}</CardTitle>
                        <CardDescription className="mt-1">{s.authors} — <span className="italic">{s.journal}</span></CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs text-muted-foreground font-medium">{t("rc.markers")}:</span>
                      {s.markers.map((m) => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">📌 {s.focus}</p>
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </TabsContent>

          {/* ── Regional Studies ── */}
          <TabsContent value="regional" className="space-y-4">
            <FadeUp>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">{t("rc.regional.heading")}</h2>
                  <p className="text-sm text-muted-foreground">{t("rc.regional.sub")}</p>
                </div>
              </div>
            </FadeUp>
            {["Date Palm Genomics", "Stress Tolerance", "Food Security"].map((cat, ci) => (
              <FadeUp key={cat} delay={ci * 0.1}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">{cat}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {REGIONAL_STUDIES.filter((s) => s.category === cat).map((s) => (
                      <div key={s.title} className="border border-border rounded-lg p-3 hover:border-primary/40 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-snug">{s.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{s.authors} — <span className="italic">{s.journal}</span></p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge variant="outline" className="text-xs">{s.year}</Badge>
                            <Badge variant="secondary" className="text-xs">{s.crop}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </TabsContent>

          {/* ── Drought Studies ── */}
          <TabsContent value="drought" className="space-y-4">
            <FadeUp>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Dna className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">{t("rc.drought.heading")}</h2>
                  <p className="text-sm text-muted-foreground">{t("rc.drought.sub")}</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <Card className="bg-secondary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{t("rc.drought.markerTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {MARKER_STATS.map((m) => (
                      <div key={m.marker} className="bg-card border border-border rounded-lg px-3 py-2 text-center">
                        <div className="font-bold text-primary text-sm">{m.count}</div>
                        <div className="text-xs font-medium">{m.marker}</div>
                        <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeUp>

            {DROUGHT_STUDIES.map((s, i) => (
              <FadeUp key={s.title} delay={(i + 1) * 0.08}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-sm font-semibold leading-snug flex-1">{s.title}</CardTitle>
                      <Badge variant="outline" className="text-xs shrink-0">{s.year}</Badge>
                    </div>
                    <CardDescription>{s.authors} — <span className="italic">{s.journal}</span></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {s.markers.map((m) => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">📌 {s.note}</p>
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </TabsContent>

          {/* ── Vegetable & Seed Banking ── */}
          <TabsContent value="vegetables" className="space-y-6">
            <FadeUp>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Sprout className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">{t("rc.veg.heading")}</h2>
                  <p className="text-sm text-muted-foreground">{t("rc.veg.sub")}</p>
                </div>
              </div>
            </FadeUp>
            <div className="space-y-3">
              {VEGETABLE_STUDIES.map((s, i) => (
                <FadeUp key={s.title} delay={i * 0.08}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-sm font-semibold leading-snug flex-1">{s.title}</CardTitle>
                        <Badge variant="outline" className="text-xs shrink-0">{s.year}</Badge>
                      </div>
                      <CardDescription>{s.authors} — <span className="italic">{s.journal}</span></CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>📍 {s.region}</span>
                        {s.polymorphism !== "—" && <span>Polymorphism: {s.polymorphism}</span>}
                      </div>
                      <p className="text-xs font-medium text-primary mt-1">{s.note}</p>
                    </CardContent>
                  </Card>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3}>
              <div className={`flex items-center gap-2 mb-4 mt-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">{t("rc.seed.heading")}</h2>
                  <p className="text-sm text-muted-foreground">{t("rc.seed.sub")}</p>
                </div>
              </div>
            </FadeUp>
            <div className="space-y-3">
              {SEED_BANKING_STUDIES.map((s, i) => (
                <FadeUp key={s.title} delay={0.35 + i * 0.08}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-sm font-semibold leading-snug flex-1">{s.title}</CardTitle>
                        <Badge variant="outline" className="text-xs shrink-0">{s.year}</Badge>
                      </div>
                      <CardDescription>{s.authors} — <span className="italic">{s.journal}</span></CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">📌 {s.relevance}</p>
                    </CardContent>
                  </Card>
                </FadeUp>
              ))}
            </div>
          </TabsContent>

          {/* ── Gaps & Recommendations ── */}
          <TabsContent value="gaps" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FadeUp>
                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-base text-destructive/80">{t("rc.gaps.gapsTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {[
                      "Limited multi-institutional collaborative studies",
                      "Minimal SNP panel development for Saudi crop varieties",
                      "Few milk production trait studies in crops (focus on animal genomics)",
                      "Limited genomic resource databases beyond literature",
                      "Small sample sizes in some vegetable studies",
                    ].map((gap) => (
                      <div key={gap} className="flex gap-2">
                        <span className="text-destructive shrink-0">•</span>
                        <span>{gap}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={0.1}>
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-base">{t("rc.gaps.partnersTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {["King Saud University", "King Abdulaziz University", "Qassim University", "KAUST", "KACST", "ICARDA", "ICO", "FAO"].map((inst) => (
                        <div key={inst} className={`flex items-center gap-2 p-1.5 border-primary pl-3 ${isRTL ? "border-r-2 pr-3" : "border-l-2"}`}>
                          <span className="text-foreground">{inst}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>
            </div>

            <FadeUp delay={0.2}>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Users className="h-5 w-5 text-primary" />
                    {t("rc.gaps.recsTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {RECOMMENDATIONS.map((r) => (
                      <div key={r.num} className={`flex items-start gap-3 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                          {r.num}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{r.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{r.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeUp>

            <p className="text-xs text-muted-foreground text-right">
              Source: Comprehensive literature search · 22 studies · 2009–2025
            </p>
          </TabsContent>

          {/* ── Researchers tab (from Community) ── */}
          <TabsContent value="researchers" className="space-y-4">
            <FadeUp>
              <div className={`flex items-center gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">{t("rc.researchers.heading")}</h2>
                  <p className="text-sm text-muted-foreground">{t("rc.researchers.sub")}</p>
                </div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESEARCHERS.map((researcher, idx) => (
                <FadeUp key={idx} delay={idx * 0.07}>
                  <Card className="border-border hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className={`flex items-start justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary group-hover:scale-105 transition-transform">
                          {researcher.name.split(" ")[1][0]}
                        </div>
                        <Button size="sm" variant="outline" className={`gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Mail className="h-3 w-3" />
                          {t("rc.researchers.contact")}
                        </Button>
                      </div>
                      <CardTitle className="text-base">{researcher.name}</CardTitle>
                      <CardDescription className="text-sm">{researcher.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{researcher.institution}</span>
                        </div>
                        <div className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{researcher.location}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2">{t("rc.researchers.expertise")}:</h4>
                        <div className="flex flex-wrap gap-1">
                          {researcher.expertise.map((area, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{area}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-primary">{researcher.projects}</div>
                          <div className="text-muted-foreground">{t("rc.researchers.projects")}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-primary">{researcher.publications}</div>
                          <div className="text-muted-foreground">{t("rc.researchers.publications")}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeUp>
              ))}
            </div>
          </TabsContent>

          {/* ── Institutions tab (from Community) ── */}
          <TabsContent value="institutions" className="space-y-4">
            <FadeUp>
              <div className={`flex items-center gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">{t("rc.institutions.heading")}</h2>
                  <p className="text-sm text-muted-foreground">{t("rc.institutions.sub")}</p>
                </div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INSTITUTIONS.map((institution, idx) => (
                <FadeUp key={idx} delay={idx * 0.06}>
                  <Card className="border-border hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="flex-1">
                          <CardTitle className="text-base mb-1">{institution.name}</CardTitle>
                          <CardDescription className="text-xs">{institution.type}</CardDescription>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className={`text-sm text-muted-foreground flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <MapPin className="h-3 w-3" />
                        {institution.location}, {institution.country}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                        <div>
                          <span className="font-semibold text-primary">{institution.researchers}</span>
                          <span className="text-muted-foreground"> {t("rc.institutions.researchers")}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-primary">{institution.projects}</span>
                          <span className="text-muted-foreground"> {t("rc.institutions.projects")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeUp>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

    </PageLayout>
  );
}
