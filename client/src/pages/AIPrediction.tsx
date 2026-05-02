/**
 * AI Prediction — Under Development
 * Conceptual pipeline diagrams for seed viability and proteomics prediction.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, AreaChart, Area,
} from "recharts";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brain, FlaskConical, Dna, Leaf, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, Construction, ChevronRight, Microscope,
  BarChart3, Cpu, Database, Zap,
} from "lucide-react";

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

// ── Mock data for sample prediction charts ─────────────────────────────────

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

const PROTEIN_ABUNDANCE = [
  { protein: "Legumin",    control: 45, stress: 28 },
  { protein: "Vicilin",    control: 38, stress: 20 },
  { protein: "HSP70",      control: 12, stress: 67 },
  { protein: "Dehydrin",   control: 8,  stress: 55 },
  { protein: "Catalase",   control: 30, stress: 48 },
  { protein: "SOD",        control: 22, stress: 41 },
];

// ── Pipeline step component ────────────────────────────────────────────────

function PipelineStep({
  icon: Icon, title, titleAr, items, color, isRTL,
}: {
  icon: React.ElementType; title: string; titleAr: string;
  items: string[]; color: string; isRTL: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center min-w-[120px] max-w-[140px]">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-md" style={{ backgroundColor: color + "20", border: `2px solid ${color}` }}>
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <p className="text-xs font-bold text-gray-800 mb-1.5 leading-tight">
        {isRTL ? titleAr : title}
      </p>
      <ul className="space-y-0.5">
        {items.map(item => (
          <li key={item} className="text-[10px] text-gray-500 bg-gray-50 rounded px-1.5 py-0.5 border border-gray-100">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Arrow({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="flex items-center justify-center px-1 pt-6">
      <ChevronRight className={`w-5 h-5 text-gray-400 ${isRTL ? "rotate-180" : ""}`} />
    </div>
  );
}

// ── Module cards ───────────────────────────────────────────────────────────

const MODULES = [
  {
    icon: Leaf,
    en: "Seed Viability Prediction",
    ar: "التنبؤ بحيوية البذور",
    desc: "ML model predicting germination viability from storage conditions, weight, and historical test data.",
    descAr: "نموذج تعلم آلي يتنبأ بنسبة إنبات البذور من بيانات التخزين والوزن والاختبارات السابقة.",
    progress: 35,
    status: "in_progress",
    tech: ["Random Forest", "XGBoost", "Time-series"],
    color: "#0B5F3A",
  },
  {
    icon: FlaskConical,
    en: "Proteomics Analysis",
    ar: "تحليل البروتيوميكس",
    desc: "LC-MS/MS data pipeline for stress-response protein identification and quantification.",
    descAr: "خط أنابيب بيانات LC-MS/MS لتعريف بروتينات الاستجابة للإجهاد وتحديد كمياتها.",
    progress: 20,
    status: "in_progress",
    tech: ["MaxQuant", "Perseus", "STRING DB"],
    color: "#7c3aed",
  },
  {
    icon: Dna,
    en: "Genomic Trait Prediction",
    ar: "التنبؤ بالصفات الجينومية",
    desc: "GWAS-based prediction of phenotypic traits (drought tolerance, yield) from SNP fingerprint panels.",
    descAr: "التنبؤ بالصفات الظاهرية من لوحات البصمة الجينية (150-SNP) باستخدام GWAS.",
    progress: 15,
    status: "planned",
    tech: ["GWAS", "GEBVs", "BLUP"],
    color: "#D97706",
  },
  {
    icon: Brain,
    en: "Population Structure ML",
    ar: "التعلم الآلي لتركيب المجتمع",
    desc: "Deep learning clustering of accessions for diversity assessment and breeding program optimization.",
    descAr: "تجميع المقتنيات بالتعلم العميق لتقييم التنوع وتحسين برامج التربية.",
    progress: 25,
    status: "in_progress",
    tech: ["ADMIXTURE", "PCA-DL", "t-SNE"],
    color: "#DC143C",
  },
];

// ── Main Component ─────────────────────────────────────────────────────────

export default function AIPrediction() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a0e] via-[#122117] to-[#0a1e12] text-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--mewa-green)] rounded-full blur-[160px] opacity-[0.07]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600 rounded-full blur-[140px] opacity-[0.05]" />

        <div className="container relative py-16 md:py-20">
          <FadeUp>
            <div className={`flex items-center gap-2 mb-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
              <Badge className="bg-amber-500/20 border-amber-400/40 text-amber-300 text-xs px-3 py-1">
                <Construction className="w-3 h-3 me-1.5" />
                {isRTL ? "تحت التطوير" : "Under Development"}
              </Badge>
              <Badge className="bg-white/10 border-white/20 text-white/80 text-xs px-3 py-1">
                <Brain className="w-3 h-3 me-1.5" />
                {isRTL ? "ذكاء اصطناعي · تعلم آلي" : "AI · Machine Learning"}
              </Badge>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className={`text-3xl md:text-5xl font-bold mb-4 leading-tight ${isRTL ? "text-right" : ""}`}>
              {isRTL ? "مركز التنبؤ بالذكاء الاصطناعي" : "AI Prediction Center"}
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className={`text-lg text-white/70 max-w-2xl mb-6 ${isRTL ? "text-right" : ""}`}>
              {isRTL
                ? "منصة متكاملة للتنبؤ بحيوية البذور وتحليل البروتيوميكس والصفات الجينومية باستخدام نماذج التعلم الآلي — قيد الإنشاء."
                : "Integrated platform for seed viability prediction, proteomics analysis, and genomic trait modelling using machine learning — currently in development."}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Under Development Banner ── */}
      <div className="bg-amber-50 border-b-2 border-amber-200">
        <div className="container py-3">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Construction className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              {isRTL
                ? "هذه الصفحة تعرض خرائط مفاهيمية للأنظمة قيد التطوير. البيانات والرسوم البيانية تمثيلية فقط."
                : "This page shows conceptual diagrams of systems currently in development. All data and charts are illustrative only."}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-10 space-y-12">

        {/* ── Module progress cards ── */}
        <FadeUp>
          <h2 className={`text-xl font-bold text-gray-900 mb-6 ${isRTL ? "text-right" : ""}`}>
            {isRTL ? "حالة وحدات النظام" : "Module Development Status"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODULES.map((m, i) => {
              const Icon = m.icon;
              return (
                <FadeUp key={m.en} delay={i * 0.08}>
                  <Card className="border-2 hover:shadow-md transition-shadow" style={{ borderColor: m.color + "30" }}>
                    <CardHeader className="pb-3">
                      <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
                          <Icon className="w-5 h-5" style={{ color: m.color }} />
                        </div>
                        <Badge
                          className={`text-[10px] ${m.status === "planned" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-700"}`}
                        >
                          {m.status === "planned"
                            ? (isRTL ? "مخطط" : "Planned")
                            : (isRTL ? "قيد التنفيذ" : "In Progress")}
                        </Badge>
                      </div>
                      <CardTitle className={`text-sm leading-snug ${isRTL ? "text-right" : ""}`}>
                        {isRTL ? m.ar : m.en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className={`text-xs text-gray-500 leading-relaxed ${isRTL ? "text-right" : ""}`}>
                        {isRTL ? m.descAr : m.desc}
                      </p>
                      <div>
                        <div className={`flex items-center justify-between mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <span className="text-[10px] text-gray-400">{isRTL ? "التقدم" : "Progress"}</span>
                          <span className="text-xs font-bold" style={{ color: m.color }}>{m.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: m.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${m.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                      <div className={`flex flex-wrap gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {m.tech.map(t => (
                          <span key={t} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{t}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeUp>
              );
            })}
          </div>
        </FadeUp>

        {/* ── Pipeline 1: Seed Viability ── */}
        <FadeUp>
          <Card className="border-2 border-green-100">
            <CardHeader className="border-b border-green-50 bg-green-50/50">
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-700" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <CardTitle className="text-base">{isRTL ? "خط أنابيب التنبؤ بحيوية البذور" : "Seed Viability Prediction Pipeline"}</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">{isRTL ? "من بيانات التخزين إلى توقع نسبة الإنبات" : "From storage data to germination probability"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              {/* Pipeline flow */}
              <div className={`flex items-start justify-center gap-0 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <PipelineStep icon={Database} title="Input Data" titleAr="بيانات الإدخال"
                  items={["Germination %", "Weight (g)", "Date collected", "Cold room"]} color="#0B5F3A" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={Cpu} title="Feature Engineering" titleAr="هندسة الميزات"
                  items={["Normalization", "SMOTE", "PCA reduction", "Time features"]} color="#D97706" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={Brain} title="ML Model" titleAr="نموذج التعلم الآلي"
                  items={["Random Forest", "XGBoost", "LSTM network", "Ensemble"]} color="#7c3aed" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={TrendingUp} title="Output" titleAr="المخرجات"
                  items={["Viability score", "Risk level", "Regen. alert", "Conf. interval"]} color="#DC143C" isRTL={isRTL} />
              </div>

              {/* Sample prediction charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <p className={`text-xs font-medium text-gray-600 mb-2 ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "نموذج: توقع مقابل قيم فعلية (غرفة 1)" : "Sample: Predicted vs Actual Germination (Room 1)"}
                  </p>
                  <div dir="ltr" className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={VIABILITY_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                        <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => [`${v}%`]} />
                        <Line type="monotone" dataKey="actual" stroke="#0B5F3A" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
                        <Line type="monotone" dataKey="predicted" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} name="Predicted" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <p className={`text-xs font-medium text-gray-600 mb-2 ${isRTL ? "text-right" : ""}`}>
                    {isRTL ? "نموذج: مؤشرات جودة البذور (رادار)" : "Sample: Seed Quality Indicators (Radar)"}
                  </p>
                  <div dir="ltr" className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={RADAR_DATA} margin={{ top: 4, right: 20, left: 20, bottom: 4 }}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="trait" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar dataKey="value" stroke="#0B5F3A" fill="#0B5F3A" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Pipeline 2: Proteomics ── */}
        <FadeUp>
          <Card className="border-2 border-purple-100">
            <CardHeader className="border-b border-purple-50 bg-purple-50/50">
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-purple-700" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <CardTitle className="text-base">{isRTL ? "خط أنابيب تحليل البروتيوميكس" : "Proteomics Analysis Pipeline"}</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">{isRTL ? "LC-MS/MS · تعريف البروتينات · التحليل الوظيفي" : "LC-MS/MS · Protein identification · Functional analysis"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className={`flex items-start justify-center gap-0 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <PipelineStep icon={FlaskConical} title="Biological Sample" titleAr="العينة البيولوجية"
                  items={["Seed extract", "Tissue", "Endosperm", "Embryo"]} color="#7c3aed" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={Microscope} title="Sample Prep" titleAr="تحضير العينة"
                  items={["Trypsin digest", "Fractionation", "Desalting", "Reduction"]} color="#D97706" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={Zap} title="Mass Spec" titleAr="طيف الكتلة"
                  items={["LC-MS/MS", "MALDI-TOF", "DIA mode", "High-res MS2"]} color="#DC143C" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={BarChart3} title="Data Analysis" titleAr="تحليل البيانات"
                  items={["MaxQuant", "Perseus", "Label-free", "PTM analysis"]} color="#0B5F3A" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={Brain} title="Biological Insight" titleAr="الاستنتاج البيولوجي"
                  items={["Stress markers", "Pathway map", "Biomarkers", "Gene Ontology"]} color="#6B4423" isRTL={isRTL} />
              </div>

              <div className="mt-8">
                <p className={`text-xs font-medium text-gray-600 mb-2 ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "نموذج: وفرة البروتين — حالة إجهاد مقابل تحكم (غرفة تبريد 1)" : "Sample: Protein Abundance — Stress vs Control (Cold Room 1)"}
                </p>
                <div dir="ltr" className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PROTEIN_ABUNDANCE} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="protein" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="control" stroke="#0B5F3A" fill="#0B5F3A" fillOpacity={0.2} name="Control" />
                      <Area type="monotone" dataKey="stress" stroke="#DC143C" fill="#DC143C" fillOpacity={0.2} name="Stress" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Pipeline 3: Genomic Trait Prediction ── */}
        <FadeUp>
          <Card className="border-2 border-amber-100">
            <CardHeader className="border-b border-amber-50 bg-amber-50/50">
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Dna className="w-5 h-5 text-amber-700" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <CardTitle className="text-base">{isRTL ? "التنبؤ بالصفات الجينومية" : "Genomic-to-Phenotype Prediction"}</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">{isRTL ? "من لوحات البصمة الجينية (150-SNP) إلى الصفات الظاهرية" : "From 150-SNP fingerprint panels to phenotypic traits"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className={`flex items-start justify-center gap-0 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <PipelineStep icon={Database} title="SNP Data" titleAr="بيانات SNP"
                  items={["150-SNP panel", "WGS variants", "5M+ SNPs", "VCF files"]} color="#D97706" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={BarChart3} title="GWAS / QTL" titleAr="GWAS / QTL"
                  items={["Association", "Haplotypes", "LD structure", "Kinship matrix"]} color="#7c3aed" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={Dna} title="Candidate Genes" titleAr="الجينات المرشحة"
                  items={["QTL mapping", "Gene annot.", "GO terms", "KEGG pathways"]} color="#DC143C" isRTL={isRTL} />
                <Arrow isRTL={isRTL} />
                <PipelineStep icon={TrendingUp} title="Trait Prediction" titleAr="توقع الصفات"
                  items={["Drought toler.", "Yield", "Disease resist.", "Heat adapt."]} color="#0B5F3A" isRTL={isRTL} />
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Development Roadmap ── */}
        <FadeUp>
          <Card className="border-2 border-gray-100">
            <CardHeader>
              <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Clock className="w-5 h-5 text-gray-500" />
                {isRTL ? "خارطة طريق التطوير" : "Development Roadmap"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    period: "Q1 2025", periodAr: "الربع الأول 2025",
                    label: "Data preprocessing & feature pipeline", labelAr: "معالجة البيانات وخط الميزات",
                    status: "done", note: "Germination data cleaned, storage conditions normalised",
                    noteAr: "تنظيف بيانات الإنبات وتطبيع ظروف التخزين",
                  },
                  {
                    period: "Q2–Q3 2025", periodAr: "الربع 2–3 2025",
                    label: "Seed viability baseline ML model", labelAr: "نموذج التعلم الآلي الأساسي لحيوية البذور",
                    status: "done", note: "Random Forest trained, RMSE = 6.2%, R² = 0.81",
                    noteAr: "تدريب Random Forest، RMSE = 6.2%، R² = 0.81",
                  },
                  {
                    period: "Q4 2025 – Q1 2026", periodAr: "الربع 4 2025 – الربع 1 2026",
                    label: "Proteomics data integration & LC-MS/MS pipeline", labelAr: "دمج بيانات البروتيوميكس وخط LC-MS/MS",
                    status: "active", note: "Sample preparation protocol finalised; data acquisition ongoing",
                    noteAr: "اكتمل بروتوكول التحضير؛ جمع البيانات جارٍ",
                  },
                  {
                    period: "Q2 2026", periodAr: "الربع الثاني 2026",
                    label: "Genomic trait GWAS model (drought & yield)", labelAr: "نموذج GWAS للصفات الجينومية (الجفاف والإنتاجية)",
                    status: "planned", note: "Pending: WGS variant calling completion for sorghum & millet",
                    noteAr: "في انتظار: إتمام استدعاء المتغيرات لـ Sorghum وMillet",
                  },
                  {
                    period: "Q3–Q4 2026", periodAr: "الربع 3–4 2026",
                    label: "Integrated AI prediction platform launch", labelAr: "إطلاق منصة التنبؤ بالذكاء الاصطناعي المتكاملة",
                    status: "planned", note: "Public dashboard with live germination predictions",
                    noteAr: "لوحة تحكم عامة مع توقعات الإنبات الحية",
                  },
                ].map((item, i) => (
                  <div key={i} className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        item.status === "done" ? "bg-green-100 border-green-500" :
                        item.status === "active" ? "bg-amber-100 border-amber-500" :
                        "bg-gray-100 border-gray-300"
                      }`}>
                        {item.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                         item.status === "active" ? <Clock className="w-4 h-4 text-amber-600" /> :
                         <AlertTriangle className="w-4 h-4 text-gray-400" />}
                      </div>
                      {i < 4 && <div className="w-0.5 h-6 bg-gray-200 mt-1" />}
                    </div>
                    <div className={`pb-4 ${isRTL ? "text-right" : ""}`}>
                      <span className="text-[10px] font-mono text-gray-400">{isRTL ? item.periodAr : item.period}</span>
                      <p className="text-sm font-semibold text-gray-800 leading-snug mt-0.5">
                        {isRTL ? item.labelAr : item.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{isRTL ? item.noteAr : item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeUp>

      </div>
    </PageLayout>
  );
}
