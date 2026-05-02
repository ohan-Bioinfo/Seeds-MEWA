/**
 * AI Prediction Center — Advanced AI theme
 * Dark glassmorphism · Neon accents · Animated pipelines · Futuristic layout
 */

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area,
} from "recharts";
import PageLayout from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brain, FlaskConical, Dna, Leaf, TrendingUp,
  CheckCircle2, Clock, ChevronRight, Microscope,
  BarChart3, Cpu, Database, Zap, Activity, Sparkles,
  Shield, Layers, Network,
} from "lucide-react";

// ── Theme tokens ──────────────────────────────────────────────────────────
const C = {
  cyan:   "#00d4ff",
  purple: "#a855f7",
  green:  "#10b981",
  amber:  "#f59e0b",
  red:    "#ef4444",
  bg:     "#020817",
  card:   "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
};

// ── Chart data ─────────────────────────────────────────────────────────────
const VIABILITY_TREND = [
  { year: "2016", predicted: 78, actual: 75 },
  { year: "2017", predicted: 85, actual: 88 },
  { year: "2018", predicted: 72, actual: 68 },
  { year: "2019", predicted: 91, actual: 95 },
  { year: "2020", predicted: 65, actual: 69 },
  { year: "2025", predicted: 82, actual: null },
  { year: "2026", predicted: 79, actual: null },
];

const RADAR_DATA = [
  { trait: "Germination", value: 88 },
  { trait: "Vigor",       value: 74 },
  { trait: "Moisture",    value: 62 },
  { trait: "Purity",      value: 95 },
  { trait: "Longevity",   value: 70 },
  { trait: "Pathogen",    value: 55 },
];

const PROTEIN_DATA = [
  { protein: "Legumin",  control: 45, stress: 28 },
  { protein: "Vicilin",  control: 38, stress: 20 },
  { protein: "HSP70",    control: 12, stress: 67 },
  { protein: "Dehydrin", control: 8,  stress: 55 },
  { protein: "Catalase", control: 30, stress: 48 },
  { protein: "SOD",      control: 22, stress: 41 },
];

// ── Module definitions ─────────────────────────────────────────────────────
const MODULES = [
  {
    icon: Leaf, en: "Seed Viability", ar: "حيوية البذور",
    desc: "ML model predicting germination viability from storage conditions, weight, and historical tests.",
    descAr: "نموذج تعلم آلي يتنبأ بنسبة إنبات البذور من بيانات التخزين والوزن.",
    progress: 35, status: "active" as const,
    tech: ["Random Forest", "XGBoost", "LSTM"], color: C.green,
  },
  {
    icon: FlaskConical, en: "Proteomics", ar: "البروتيوميكس",
    desc: "LC-MS/MS pipeline for stress-response protein identification and quantification.",
    descAr: "خط أنابيب LC-MS/MS لتعريف بروتينات الاستجابة للإجهاد.",
    progress: 20, status: "active" as const,
    tech: ["MaxQuant", "Perseus", "STRING DB"], color: C.purple,
  },
  {
    icon: Dna, en: "Genomic Traits", ar: "الصفات الجينومية",
    desc: "GWAS-based prediction of phenotypic traits (drought, yield) from 150-SNP panels.",
    descAr: "التنبؤ بالصفات الظاهرية من لوحات 150-SNP باستخدام GWAS.",
    progress: 15, status: "planned" as const,
    tech: ["GWAS", "GEBVs", "BLUP"], color: C.amber,
  },
  {
    icon: Brain, en: "Population ML", ar: "تعلم المجتمع",
    desc: "Deep learning clustering for diversity assessment and breeding optimization.",
    descAr: "تجميع المقتنيات بالتعلم العميق لتقييم التنوع.",
    progress: 25, status: "active" as const,
    tech: ["ADMIXTURE", "PCA-DL", "t-SNE"], color: C.cyan,
  },
];

// ── Roadmap ────────────────────────────────────────────────────────────────
const ROADMAP = [
  { period: "Q1 2025", en: "Data preprocessing & feature pipeline", ar: "معالجة البيانات وخط الميزات", status: "done", metric: "RMSE 6.2% · R² 0.81" },
  { period: "Q2–Q3 2025", en: "Seed viability baseline ML model", ar: "نموذج التعلم الآلي لحيوية البذور", status: "done", metric: "Trained on 773 accessions" },
  { period: "Q4 2025 – Q1 2026", en: "Proteomics LC-MS/MS pipeline", ar: "دمج بيانات البروتيوميكس", status: "active", metric: "Sample prep finalised" },
  { period: "Q2 2026", en: "GWAS genomic trait model", ar: "نموذج GWAS للصفات الجينومية", status: "planned", metric: "Pending variant calling" },
  { period: "Q3–Q4 2026", en: "Integrated AI platform launch", ar: "إطلاق منصة الذكاء الاصطناعي", status: "planned", metric: "Public dashboard" },
];

// ── Pipelines ──────────────────────────────────────────────────────────────
const PIPELINE_VIABILITY = [
  { icon: Database, title: "Input Data",  titleAr: "بيانات الإدخال",   items: ["Germination %", "Weight (g)", "Date collected", "Cold room"], color: C.green },
  { icon: Cpu,      title: "Features",    titleAr: "هندسة الميزات",    items: ["Normalization", "SMOTE", "PCA", "Time feats"], color: C.amber },
  { icon: Brain,    title: "ML Model",    titleAr: "نموذج الذكاء الآلي", items: ["Random Forest", "XGBoost", "LSTM", "Ensemble"], color: C.purple },
  { icon: TrendingUp, title: "Output",   titleAr: "المخرجات",           items: ["Viability %", "Risk level", "Alert", "CI band"], color: C.cyan },
];

const PIPELINE_PROTEOMICS = [
  { icon: FlaskConical, title: "Sample",    titleAr: "العينة",         items: ["Seed extract", "Tissue", "Embryo"], color: C.purple },
  { icon: Microscope,   title: "Prep",      titleAr: "التحضير",        items: ["Trypsin digest", "Fractionation", "Desalting"], color: C.amber },
  { icon: Zap,          title: "Mass Spec", titleAr: "طيف الكتلة",     items: ["LC-MS/MS", "MALDI-TOF", "DIA mode"], color: C.red },
  { icon: BarChart3,    title: "Analysis",  titleAr: "التحليل",        items: ["MaxQuant", "Perseus", "Label-free"], color: C.green },
  { icon: Brain,        title: "Insight",   titleAr: "الاستنتاج",       items: ["Stress markers", "Pathways", "Biomarkers"], color: C.cyan },
];

const PIPELINE_GENOMICS = [
  { icon: Database, title: "SNP Data",      titleAr: "بيانات SNP",     items: ["150-SNP panel", "5M+ SNPs", "VCF files"], color: C.amber },
  { icon: BarChart3, title: "GWAS / QTL",   titleAr: "GWAS / QTL",     items: ["Association", "Haplotypes", "Kinship"], color: C.purple },
  { icon: Dna,       title: "Gene Targets", titleAr: "الجينات المرشحة", items: ["QTL mapping", "GO terms", "KEGG"], color: C.red },
  { icon: TrendingUp, title: "Traits",      titleAr: "الصفات",         items: ["Drought", "Yield", "Disease resist."], color: C.cyan },
];

// ── Animated helpers ───────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function GlassCard({ children, className = "", glow = "" }: { children: React.ReactNode; className?: string; glow?: string }) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-md ${className}`}
      style={{ background: C.card, borderColor: glow || C.border, boxShadow: glow ? `0 0 24px ${glow}22, inset 0 0 24px ${glow}06` : "none" }}
    >
      {children}
    </div>
  );
}

// Pulsing dot indicator
function Pulse({ color }: { color: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: color }} />
    </span>
  );
}

// Pipeline node
function Node({ icon: Icon, title, titleAr, items, color, isRTL }: {
  icon: React.ElementType; title: string; titleAr: string;
  items: string[]; color: string; isRTL: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center" style={{ minWidth: 100, maxWidth: 128 }}>
      <motion.div
        whileHover={{ scale: 1.08 }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 cursor-default"
        style={{ background: `${color}18`, border: `1.5px solid ${color}60`, boxShadow: `0 0 16px ${color}30` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </motion.div>
      <p className="text-[11px] font-bold text-white/90 mb-2 leading-tight">{isRTL ? titleAr : title}</p>
      <ul className="space-y-1">
        {items.map(it => (
          <li key={it} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${color}12`, color: `${color}cc`, border: `1px solid ${color}25` }}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function Connector({ isRTL, color = "#ffffff30" }: { isRTL: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-center px-2 pt-5 shrink-0">
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
        <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} style={{ color }} />
      </motion.div>
    </div>
  );
}

// Animated counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1);
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function AIPrediction() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <PageLayout>
      {/* full dark wrapper */}
      <div style={{ background: "linear-gradient(135deg, #020817 0%, #0d0a1a 40%, #020c17 100%)", minHeight: "100vh" }}>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-16">
          {/* Animated background blobs */}
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 7, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: C.cyan, transform: "translate(30%, -30%)" }} />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.16, 0.08] }} transition={{ duration: 9, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: C.purple, transform: "translate(-30%, 30%)" }} />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 11, repeat: Infinity, delay: 4 }}
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full blur-[90px]" style={{ background: C.green, transform: "translate(-50%, -50%)" }} />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: `linear-gradient(${C.cyan} 1px, transparent 1px), linear-gradient(90deg, ${C.cyan} 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />

          {/* Scanning beam */}
          <motion.div className="absolute top-0 left-0 right-0 h-px opacity-40"
            style={{ background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)` }}
            animate={{ y: [0, 400, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

          <div className="container relative z-10">
            <FadeUp>
              <div className={`flex items-center gap-2 mb-6 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${C.amber}18`, border: `1px solid ${C.amber}40`, color: C.amber }}>
                  <Pulse color={C.amber} />
                  {isRTL ? "تحت التطوير" : "Under Development"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${C.cyan}12`, border: `1px solid ${C.cyan}30`, color: C.cyan }}>
                  <Brain className="w-3 h-3" />
                  {isRTL ? "ذكاء اصطناعي · تعلم آلي" : "AI · Machine Learning"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${C.purple}12`, border: `1px solid ${C.purple}30`, color: C.purple }}>
                  <Dna className="w-3 h-3" />
                  {isRTL ? "جينوميات" : "Genomics"}
                </span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className={`text-4xl sm:text-6xl font-black mb-4 leading-tight tracking-tight ${isRTL ? "text-right" : ""}`}
                style={{ background: `linear-gradient(135deg, #ffffff 0%, ${C.cyan} 50%, ${C.purple} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {isRTL ? "مركز التنبؤ بالذكاء الاصطناعي" : "AI Prediction Center"}
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className={`text-base sm:text-lg max-w-2xl mb-10 leading-relaxed ${isRTL ? "text-right" : ""}`} style={{ color: "rgba(255,255,255,0.55)" }}>
                {isRTL
                  ? "منصة متكاملة للتنبؤ بحيوية البذور وتحليل البروتيوميكس والصفات الجينومية باستخدام نماذج التعلم الآلي المتقدمة."
                  : "Integrated platform for seed viability prediction, proteomics analysis, and genomic trait modelling using advanced machine learning models."}
              </p>
            </FadeUp>

            {/* Hero stat strip */}
            <FadeUp delay={0.3}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Database, label: isRTL ? "مقتنى مُدرَّب" : "Accessions Trained", value: 773, color: C.green },
                  { icon: Activity, label: isRTL ? "دقة النموذج R²" : "Model R² Score", value: 81, suffix: "%", color: C.cyan },
                  { icon: Layers, label: isRTL ? "خوارزميات" : "Algorithms", value: 4, color: C.purple },
                  { icon: Network, label: isRTL ? "مسارات بيانات" : "Data Pipelines", value: 3, color: C.amber },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }}
                      className="rounded-xl p-4 text-center" style={{ background: `${s.color}0c`, border: `1px solid ${s.color}25` }}>
                      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
                      <div className="text-2xl font-black" style={{ color: s.color }}>
                        <Counter target={s.value} suffix={s.suffix} />
                      </div>
                      <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Notice bar */}
        <div style={{ background: `${C.amber}10`, borderTop: `1px solid ${C.amber}25`, borderBottom: `1px solid ${C.amber}25` }}>
          <div className="container py-2.5">
            <p className={`text-xs flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`} style={{ color: `${C.amber}cc` }}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              {isRTL
                ? "البيانات والمخططات تمثيلية فقط — الأنظمة قيد التطوير."
                : "All data and charts are illustrative only — systems currently in development."}
            </p>
          </div>
        </div>

        <div className="container py-14 space-y-14">

          {/* ── Module cards ──────────────────────────────────────────────── */}
          <FadeUp>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-5 ${isRTL ? "text-right" : ""}`} style={{ color: C.cyan }}>
              {isRTL ? "وحدات النظام" : "System Modules"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MODULES.map((m, i) => {
                const Icon = m.icon;
                return (
                  <FadeUp key={m.en} delay={i * 0.09}>
                    <GlassCard glow={m.color} className="p-5 h-full">
                      <div className={`flex items-start justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}18`, border: `1.5px solid ${m.color}50` }}>
                          <Icon className="w-5 h-5" style={{ color: m.color }} />
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{
                          background: m.status === "planned" ? "rgba(255,255,255,0.06)" : `${m.color}18`,
                          color: m.status === "planned" ? "rgba(255,255,255,0.35)" : m.color,
                          border: `1px solid ${m.status === "planned" ? "rgba(255,255,255,0.1)" : m.color + "40"}`,
                        }}>
                          {m.status === "planned" ? (isRTL ? "مخطط" : "Planned") : (isRTL ? "جارٍ" : "Active")}
                        </span>
                      </div>
                      <h3 className={`text-sm font-bold text-white mb-2 ${isRTL ? "text-right" : ""}`}>{isRTL ? m.ar : m.en}</h3>
                      <p className={`text-xs leading-relaxed mb-4 ${isRTL ? "text-right" : ""}`} style={{ color: "rgba(255,255,255,0.45)" }}>
                        {isRTL ? m.descAr : m.desc}
                      </p>
                      {/* Progress */}
                      <div className="mb-3">
                        <div className={`flex justify-between text-[10px] mb-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <span style={{ color: "rgba(255,255,255,0.35)" }}>{isRTL ? "التقدم" : "Progress"}</span>
                          <span className="font-bold" style={{ color: m.color }}>{m.progress}%</span>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }}
                            initial={{ width: 0 }} whileInView={{ width: `${m.progress}%` }} viewport={{ once: true }}
                            transition={{ duration: 1.4, ease: "easeOut", delay: i * 0.12 }} />
                        </div>
                      </div>
                      {/* Tech tags */}
                      <div className={`flex flex-wrap gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {m.tech.map(t => (
                          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>{t}</span>
                        ))}
                      </div>
                    </GlassCard>
                  </FadeUp>
                );
              })}
            </div>
          </FadeUp>

          {/* ── Pipeline 1: Seed Viability ────────────────────────────────── */}
          <FadeUp>
            <GlassCard glow={C.green} className="p-6 sm:p-8">
              <div className={`flex items-center gap-3 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.green}15`, border: `1.5px solid ${C.green}50` }}>
                  <Leaf className="w-5 h-5" style={{ color: C.green }} />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <h2 className="text-base font-bold text-white">{isRTL ? "خط التنبؤ بحيوية البذور" : "Seed Viability Prediction Pipeline"}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{isRTL ? "من بيانات التخزين إلى توقع الإنبات" : "Storage data → ML inference → viability score"}</p>
                </div>
              </div>
              <div className={`flex items-start justify-center flex-wrap gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                {PIPELINE_VIABILITY.map((step, i) => (
                  <div key={step.title} className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Node {...step} isRTL={isRTL} />
                    {i < PIPELINE_VIABILITY.length - 1 && <Connector isRTL={isRTL} color={PIPELINE_VIABILITY[i].color} />}
                  </div>
                ))}
              </div>
              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div>
                  <p className="text-[11px] font-semibold mb-3" style={{ color: C.green }}>{isRTL ? "توقع مقابل قيم فعلية" : "Predicted vs Actual — Cold Room 1"}</p>
                  <div dir="ltr" className="h-40 rounded-xl p-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.green}20` }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={VIABILITY_TREND} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                        <XAxis dataKey="year" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[50, 100]} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0d1117", border: `1px solid ${C.green}40`, borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v}%`]} />
                        <Line type="monotone" dataKey="actual" stroke={C.green} strokeWidth={2} dot={{ r: 2.5, fill: C.green }} name="Actual" connectNulls={false} />
                        <Line type="monotone" dataKey="predicted" stroke={C.cyan} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 2.5, fill: C.cyan }} name="Predicted" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold mb-3" style={{ color: C.cyan }}>{isRTL ? "مؤشرات جودة البذور" : "Seed Quality Radar"}</p>
                  <div dir="ltr" className="h-40 rounded-xl p-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.cyan}20` }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={RADAR_DATA} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="trait" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.4)" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7, fill: "rgba(255,255,255,0.2)" }} />
                        <Radar dataKey="value" stroke={C.cyan} fill={C.cyan} fillOpacity={0.15} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </GlassCard>
          </FadeUp>

          {/* ── Pipeline 2: Proteomics ────────────────────────────────────── */}
          <FadeUp>
            <GlassCard glow={C.purple} className="p-6 sm:p-8">
              <div className={`flex items-center gap-3 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.purple}15`, border: `1.5px solid ${C.purple}50` }}>
                  <FlaskConical className="w-5 h-5" style={{ color: C.purple }} />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <h2 className="text-base font-bold text-white">{isRTL ? "خط تحليل البروتيوميكس" : "Proteomics Analysis Pipeline"}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>LC-MS/MS · MaxQuant · STRING DB</p>
                </div>
              </div>
              <div className={`flex items-start justify-center flex-wrap gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                {PIPELINE_PROTEOMICS.map((step, i) => (
                  <div key={step.title} className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Node {...step} isRTL={isRTL} />
                    {i < PIPELINE_PROTEOMICS.length - 1 && <Connector isRTL={isRTL} color={PIPELINE_PROTEOMICS[i].color} />}
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <p className="text-[11px] font-semibold mb-3" style={{ color: C.purple }}>{isRTL ? "وفرة البروتين — إجهاد مقابل تحكم" : "Protein Abundance — Stress vs Control"}</p>
                <div dir="ltr" className="h-44 rounded-xl p-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.purple}20` }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PROTEIN_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                      <XAxis dataKey="protein" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0d1117", border: `1px solid ${C.purple}40`, borderRadius: 8, fontSize: 11 }} />
                      <Area type="monotone" dataKey="control" stroke={C.green} fill={C.green} fillOpacity={0.12} name="Control" strokeWidth={1.5} />
                      <Area type="monotone" dataKey="stress" stroke={C.red} fill={C.red} fillOpacity={0.12} name="Stress" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </GlassCard>
          </FadeUp>

          {/* ── Pipeline 3: Genomic Traits ────────────────────────────────── */}
          <FadeUp>
            <GlassCard glow={C.amber} className="p-6 sm:p-8">
              <div className={`flex items-center gap-3 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.amber}15`, border: `1.5px solid ${C.amber}50` }}>
                  <Dna className="w-5 h-5" style={{ color: C.amber }} />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <h2 className="text-base font-bold text-white">{isRTL ? "التنبؤ بالصفات الجينومية" : "Genomic-to-Phenotype Prediction"}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>150-SNP panels → GWAS → trait inference</p>
                </div>
              </div>
              <div className={`flex items-start justify-center flex-wrap gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                {PIPELINE_GENOMICS.map((step, i) => (
                  <div key={step.title} className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Node {...step} isRTL={isRTL} />
                    {i < PIPELINE_GENOMICS.length - 1 && <Connector isRTL={isRTL} color={PIPELINE_GENOMICS[i].color} />}
                  </div>
                ))}
              </div>
            </GlassCard>
          </FadeUp>

          {/* ── Roadmap ───────────────────────────────────────────────────── */}
          <FadeUp>
            <GlassCard className="p-6 sm:p-8">
              <div className={`flex items-center gap-2 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Clock className="w-4 h-4" style={{ color: C.cyan }} />
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.cyan }}>
                  {isRTL ? "خارطة طريق التطوير" : "Development Roadmap"}
                </p>
              </div>
              <div className="space-y-0">
                {ROADMAP.map((item, i) => {
                  const color = item.status === "done" ? C.green : item.status === "active" ? C.cyan : "rgba(255,255,255,0.2)";
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: isRTL ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center z-10" style={{ background: `${color}18`, border: `2px solid ${color}`, boxShadow: item.status !== "planned" ? `0 0 12px ${color}50` : "none" }}>
                          {item.status === "done"
                            ? <CheckCircle2 className="w-4 h-4" style={{ color }} />
                            : item.status === "active"
                              ? <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}><Activity className="w-4 h-4" style={{ color }} /></motion.div>
                              : <Clock className="w-4 h-4" style={{ color }} />}
                        </div>
                        {i < ROADMAP.length - 1 && (
                          <div className="w-px flex-1 my-1" style={{ background: `linear-gradient(${color}60, rgba(255,255,255,0.05))`, minHeight: 24 }} />
                        )}
                      </div>
                      <div className={`pb-6 flex-1 ${isRTL ? "text-right" : ""}`}>
                        <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{item.period}</span>
                        <p className="text-sm font-semibold text-white mt-0.5">{isRTL ? item.ar : item.en}</p>
                        <p className="text-[11px] mt-1 font-mono" style={{ color }}>▸ {item.metric}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </FadeUp>

          {/* ── Tech stack footer ─────────────────────────────────────────── */}
          <FadeUp>
            <div className={`flex flex-wrap items-center gap-2 justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
              {["Python 3.11", "scikit-learn", "TensorFlow", "PyTorch", "MaxQuant", "PLINK2", "R/Bioconductor", "ADMIXTURE"].map(t => (
                <span key={t} className="text-[10px] font-mono px-2.5 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}>
                  {t}
                </span>
              ))}
            </div>
          </FadeUp>

        </div>
      </div>
    </PageLayout>
  );
}
