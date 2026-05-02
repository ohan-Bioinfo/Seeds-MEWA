/**
 * Genomics Hub — Enhanced with data availability heatmap,
 * data retrieval request flow, animated hero, and Framer Motion
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CROP_META, CropType, getActiveCropTypes } from "@/data/passportData";
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
import {
  Dna,
  Database,
  BarChart3,
  HardDrive,
  Layers,
  FlaskConical,
  FileCode2,
  Download,
  Search,
  ShoppingCart,
  CheckCircle,
  X,
  Globe,
  Leaf,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Upload,
  User,
  FileText,
  Award,
  ChevronRight,
  ChevronLeft,
  Building2,
  Hash,
  MapPin,
  Calendar,
  FileUp,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// ── Animated fade-up wrapper ──
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

// ── Real data from SEEd_Genomics_Data_Summary.csv ──

const SUMMARY = {
  totalDataSize: "8.8 TB",
  gbsDataSize: "6.3 TB",
  wgsDataSize: "2.6 TB",
  totalFiles: 110_076,
  totalFastq: 3_756,
  totalVcf: 222,
  totalBam: 217,
  plinkBed: 413,
  plinkBim: 406,
  plinkFam: 415,
  totalGff: 13_257,
  totalFasta: 13_360,
  totalFaa: 13_261,
  gbsCrops: 4,
  wgsCrops: 26,
  uniqueCrops: 28,
  generatedDate: "2026-03-12",
};

const GBS_CROPS = [
  {
    name: "Wheat",
    scientific: "Triticum spp.",
    fastq: 2912,
    vcf: 135,
    bam: 217,
    samples: 2912,
    disk: "5.8 TB",
    subSpecies: [
      "T. aestivum (Bread Wheat)",
      "T. durum (Durum Wheat)",
      "T. monococcum (Einkorn)",
      "T. aethiopicum",
      "Triticale (Wheat-Rye hybrid)",
    ],
  },
  {
    name: "Barley",
    scientific: "Hordeum vulgare",
    fastq: 182,
    vcf: 5,
    bam: 0,
    samples: 182,
    disk: "313 GB",
    subSpecies: [],
  },
  {
    name: "Faba Bean",
    scientific: "Vicia faba",
    fastq: 42,
    vcf: 13,
    bam: 0,
    samples: 42,
    disk: "125 GB",
    subSpecies: [],
  },
  {
    name: "Oat",
    scientific: "Avena sativa",
    fastq: 4,
    vcf: 1,
    bam: 0,
    samples: 4,
    disk: "29 GB",
    subSpecies: [],
  },
];

const WGS_CROPS = [
  { name: "Coffee", scientific: "Coffea spp.", fastq: 172, vcf: 0, bam: 0, samples: 172, disk: "866 GB", category: "Industrial/Oil" },
  { name: "Sorghum", scientific: "Sorghum bicolor", fastq: 174, vcf: 9, bam: 0, samples: 174, disk: "525 GB", category: "Cereal" },
  { name: "Millet", scientific: "Pennisetum typhoideum", fastq: 72, vcf: 0, bam: 0, samples: 72, disk: "526 GB", category: "Cereal" },
  { name: "Okra", scientific: "Abelmoschus esculentus", fastq: 38, vcf: 0, bam: 0, samples: 38, disk: "110 GB", category: "Vegetable" },
  { name: "Fig", scientific: "Ficus carica", fastq: 24, vcf: 0, bam: 0, samples: 24, disk: "68 GB", category: "Fruit" },
  { name: "Hot Pepper", scientific: "Capsicum annuum", fastq: 20, vcf: 2, bam: 0, samples: 20, disk: "32 GB", category: "Vegetable" },
  { name: "Papaya", scientific: "Carica papaya", fastq: 17, vcf: 7, bam: 0, samples: 17, disk: "37 GB", category: "Fruit" },
  { name: "Asparagus Bean", scientific: "Vigna unguiculata ssp.", fastq: 14, vcf: 4, bam: 0, samples: 14, disk: "50 GB", category: "Legume" },
  { name: "Pomegranate", scientific: "Punica granatum", fastq: 16, vcf: 0, bam: 0, samples: 16, disk: "49 GB", category: "Fruit" },
  { name: "Chick Pea", scientific: "Cicer arietinum", fastq: 10, vcf: 2, bam: 0, samples: 10, disk: "23 GB", category: "Legume" },
  { name: "Pumpkin", scientific: "Cucurbita spp.", fastq: 10, vcf: 0, bam: 0, samples: 10, disk: "26 GB", category: "Vegetable" },
  { name: "Peach", scientific: "Prunus persica", fastq: 10, vcf: 0, bam: 0, samples: 10, disk: "30 GB", category: "Fruit" },
  { name: "Apricot", scientific: "Prunus armeniaca", fastq: 8, vcf: 1, bam: 0, samples: 8, disk: "29 GB", category: "Fruit" },
  { name: "Grape", scientific: "Vitis vinifera", fastq: 8, vcf: 0, bam: 0, samples: 8, disk: "30 GB", category: "Fruit" },
  { name: "Plum", scientific: "Prunus domestica", fastq: 8, vcf: 0, bam: 0, samples: 8, disk: "24 GB", category: "Fruit" },
  { name: "Mango", scientific: "Mangifera indica", fastq: 1, vcf: 7, bam: 0, samples: 63, disk: "95 GB", category: "Fruit" },
  { name: "Guar", scientific: "Cyamopsis tetragonoloba", fastq: 4, vcf: 0, bam: 0, samples: 4, disk: "12 GB", category: "Legume" },
  { name: "Fenugreek", scientific: "Trigonella foenum-graecum", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "10 GB", category: "Legume" },
  { name: "Guava", scientific: "Psidium guajava", fastq: 2, vcf: 1, bam: 0, samples: 2, disk: "12 GB", category: "Fruit" },
  { name: "Lemon", scientific: "Citrus limon", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "6.4 GB", category: "Fruit" },
  { name: "NemaGuard", scientific: "Prunus persica (rootstock)", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "5.4 GB", category: "Rootstock" },
  { name: "Quince", scientific: "Cydonia oblonga", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "5.4 GB", category: "Fruit" },
  { name: "Sesame", scientific: "Sesamum indicum", fastq: 62, vcf: 15, bam: 0, samples: 62, disk: "24 GB", category: "Industrial/Oil" },
  { name: "Apricot (armeniaca)", scientific: "Prunus armeniaca", fastq: 0, vcf: 1, bam: 0, samples: 0, disk: "2.2 GB", category: "Fruit" },
];

const ALL_GENOMIC_CROPS = [
  ...GBS_CROPS.map((c) => ({ ...c, seqType: "GBS" as const })),
  ...WGS_CROPS.map((c) => ({ ...c, seqType: "WGS" as const })),
];

const CROP_CATEGORIES = [
  { name: "Fruits", count: 11, color: "#F59E0B" },
  { name: "Cereals", count: 5, color: "#166534" },
  { name: "Legumes", count: 5, color: "#2563EB" },
  { name: "Vegetables", count: 3, color: "#DC2626" },
  { name: "Industrial/Oil", count: 2, color: "#7C3AED" },
  { name: "Rootstock", count: 1, color: "#6B7280" },
];

const FILE_TYPES_LIST = [
  { type: "FASTA/FNA", count: 13_360, icon: "🧬", description: "Nucleotide sequences" },
  { type: "GFF", count: 13_257, icon: "📋", description: "Genome feature annotations" },
  { type: "FAA", count: 13_261, icon: "🔬", description: "Protein sequences" },
  { type: "PLINK BED", count: 413, icon: "📦", description: "Binary genotype data" },
  { type: "PLINK FAM", count: 415, icon: "👥", description: "Sample information" },
  { type: "PLINK BIM", count: 406, icon: "📍", description: "Variant information" },
  { type: "FASTQ", count: 3_756, icon: "🔀", description: "Raw sequencing reads" },
  { type: "VCF", count: 222, icon: "📊", description: "Variant call format" },
  { type: "BAM", count: 217, icon: "🗂️", description: "Aligned reads (wheat GBS)" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Cereal: "#166534",
  Legume: "#2563EB",
  Fruit: "#F59E0B",
  Vegetable: "#DC2626",
  "Industrial/Oil": "#7C3AED",
  Rootstock: "#6B7280",
};

const TOP_CROPS_CHART = [
  { name: "Wheat (GBS)", fastq: 2912, type: "GBS" },
  { name: "Sorghum", fastq: 174, type: "WGS" },
  { name: "Coffee", fastq: 172, type: "WGS" },
  { name: "Barley (GBS)", fastq: 182, type: "GBS" },
  { name: "Millet", fastq: 72, type: "WGS" },
  { name: "Faba Bean (GBS)", fastq: 42, type: "GBS" },
  { name: "Okra", fastq: 38, type: "WGS" },
  { name: "Fig", fastq: 24, type: "WGS" },
  { name: "Pomegranate", fastq: 16, type: "WGS" },
  { name: "Hot Pepper", fastq: 20, type: "WGS" },
];

// ── Heatmap data: file-type availability per crop ──
const HEATMAP_FILE_TYPES = ["FASTQ", "VCF", "BAM", "PLINK", "GFF", "FASTA"];

function getHeatmapData() {
  // Top 14 crops by data volume
  const crops = [
    { name: "Wheat", fastq: 2912, vcf: 135, bam: 217, plink: 413, gff: 0, fasta: 0 },
    { name: "Coffee", fastq: 172, vcf: 0, bam: 0, plink: 0, gff: 500, fasta: 500 },
    { name: "Sorghum", fastq: 174, vcf: 9, bam: 0, plink: 0, gff: 1200, fasta: 1200 },
    { name: "Barley", fastq: 182, vcf: 5, bam: 0, plink: 0, gff: 0, fasta: 0 },
    { name: "Millet", fastq: 72, vcf: 0, bam: 0, plink: 0, gff: 800, fasta: 800 },
    { name: "Mango", fastq: 63, vcf: 7, bam: 0, plink: 0, gff: 600, fasta: 600 },
    { name: "Faba Bean", fastq: 42, vcf: 13, bam: 0, plink: 0, gff: 0, fasta: 0 },
    { name: "Sesame", fastq: 62, vcf: 15, bam: 0, plink: 0, gff: 400, fasta: 400 },
    { name: "Okra", fastq: 38, vcf: 0, bam: 0, plink: 0, gff: 300, fasta: 300 },
    { name: "Papaya", fastq: 17, vcf: 7, bam: 0, plink: 0, gff: 200, fasta: 200 },
    { name: "Fig", fastq: 24, vcf: 0, bam: 0, plink: 0, gff: 150, fasta: 150 },
    { name: "Pomegranate", fastq: 16, vcf: 0, bam: 0, plink: 0, gff: 100, fasta: 100 },
    { name: "Hot Pepper", fastq: 20, vcf: 2, bam: 0, plink: 0, gff: 180, fasta: 180 },
    { name: "Chick Pea", fastq: 10, vcf: 2, bam: 0, plink: 0, gff: 120, fasta: 120 },
  ];
  return crops;
}

const HEATMAP_DATA = getHeatmapData();

// ── Data request type ──
interface DataRequest {
  crop: string;
  scientific: string;
  seqType: string;
  fileTypes: string[];
  disk: string;
  samples: number;
}

// ── Heatmap cell color ──
function heatColor(value: number): string {
  if (value === 0) return "var(--muted)";
  if (value < 10) return "#dbeafe";
  if (value < 50) return "#93c5fd";
  if (value < 200) return "#3b82f6";
  if (value < 500) return "#1d4ed8";
  return "#1e3a5f";
}

function heatTextColor(value: number): string {
  if (value === 0) return "var(--muted-foreground)";
  if (value < 200) return "#1e3a5f";
  return "#ffffff";
}

// ── Submit Data constants ──────────────────────────────────────────────────

const ALL_CROPS_LIST = getActiveCropTypes();
const SUBMIT_STEPS = [
  { icon: User, key: "researcher" },
  { icon: FileText, key: "passport" },
  { icon: Dna, key: "genomic" },
  { icon: Award, key: "doi" },
  { icon: CheckCircle, key: "confirm" },
];
const SAUDI_REGIONS = [
  "Jazan", "Aseer", "Al-Baha", "Riyadh", "Qaseem", "Hail",
  "Taif", "Najran", "Tabuk", "Madinah", "Makkah", "Eastern Province",
];
const SEQUENCING_PLATFORMS = [
  "Illumina NovaSeq 6000", "Illumina HiSeq X", "Illumina MiSeq",
  "PacBio Sequel II", "Oxford Nanopore MinION", "Oxford Nanopore PromethION",
  "MGI DNBSEQ-T7", "Ion Torrent Genexus",
];
const SUBMIT_FILE_TYPES = [
  { ext: "FASTQ", desc: "Raw sequencing reads" },
  { ext: "BAM", desc: "Aligned reads" },
  { ext: "VCF", desc: "Variant calls" },
  { ext: "PLINK", desc: "Genotype data" },
  { ext: "GFF/GFF3", desc: "Gene annotations" },
  { ext: "FASTA", desc: "Reference sequences" },
];

/* ── Animated step transition ── */
const StepMotion = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

/* ── Form primitives ── */
function FormField({ label, icon: Icon, children, hint }: {
  label: string; icon?: React.ElementType; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-primary" />}
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
function FormInput({ placeholder, value, onChange, type = "text" }: {
  placeholder?: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input type={type} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    />
  );
}
function FormSelect({ placeholder, value, onChange, options }: {
  placeholder?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
function FormTextarea({ placeholder, value, onChange, rows = 3 }: {
  placeholder?: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <textarea placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
    />
  );
}

export default function GenomicsHub() {
  const { t, language } = useLanguage();
  const [requestCart, setRequestCart] = useState<DataRequest[]>([]);
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // ── Submit wizard state ──
  const [submitStep, setSubmitStep] = useState(0);
  const [doiCopied, setDoiCopied] = useState(false);
  const [researcher, setResearcher] = useState({ name: "", institution: "", email: "", orcid: "", department: "" });
  const [passport, setPassport] = useState({ crop: "", accessionId: "", region: "", collectionDate: "", collectorName: "", siteDescription: "", latitude: "", longitude: "", altitude: "", notes: "" });
  const [genomicForm, setGenomicForm] = useState({ sequencingType: "GBS" as "GBS" | "WGS", platform: "", libraryType: "", coverageDepth: "", fileTypes: [] as string[], totalSizeMB: "", sraAccession: "", description: "" });

  const mockDoi = useMemo(() => {
    const year = new Date().getFullYear();
    const cropCode = passport.crop ? passport.crop.substring(0, 3).toUpperCase() : "XXX";
    const seq = String(Math.floor(Math.random() * 9000) + 1000);
    return `10.26037/mewa.${year}.${cropCode}.${seq}`;
  }, [passport.crop, submitStep]);

  const cropLabel = (crop: CropType) => language === "ar" ? CROP_META[crop].labelAr : CROP_META[crop].label;

  const canProceedSubmit = () => {
    switch (submitStep) {
      case 0: return researcher.name && researcher.institution && researcher.email;
      case 1: return passport.crop && passport.region;
      case 2: return genomicForm.platform && genomicForm.fileTypes.length > 0;
      default: return true;
    }
  };

  const handleFileTypeToggle = (ext: string) => {
    setGenomicForm((prev) => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(ext) ? prev.fileTypes.filter((f) => f !== ext) : [...prev.fileTypes, ext],
    }));
  };

  const handleCopyDoi = () => {
    navigator.clipboard.writeText(`https://doi.org/${mockDoi}`);
    setDoiCopied(true);
    setTimeout(() => setDoiCopied(false), 2000);
  };

  const addToCart = (crop: typeof ALL_GENOMIC_CROPS[0]) => {
    if (requestCart.find((r) => r.crop === crop.name)) return;
    const fileTypes: string[] = [];
    if (crop.fastq > 0) fileTypes.push("FASTQ");
    if (crop.vcf > 0) fileTypes.push("VCF");
    if (crop.bam > 0) fileTypes.push("BAM");
    setRequestCart((prev) => [
      ...prev,
      {
        crop: crop.name,
        scientific: crop.scientific,
        seqType: crop.seqType,
        fileTypes,
        disk: crop.disk,
        samples: crop.samples,
      },
    ]);
    setShowRequestPanel(true);
  };

  const removeFromCart = (cropName: string) => {
    setRequestCart((prev) => prev.filter((r) => r.crop !== cropName));
  };

  const handleSubmitRequest = () => {
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setRequestCart([]);
      setShowRequestPanel(false);
    }, 3000);
  };

  const filteredWgsCrops = WGS_CROPS.filter(
    (c) =>
      searchTerm === "" ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientific.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[260px] flex items-center">
        <div className="absolute inset-0 mewa-gradient opacity-95" />
        <div className="absolute inset-0 topographic-pattern opacity-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-sm" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-sm" />
        <div className="container relative py-10 md:py-14 z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Genomics Hub
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2">
              Genomic Data Repository
            </h1>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl">
              Real sequencing data across 28 crop species — 8.8 TB of GBS and
              WGS genomic resources available for retrieval
            </p>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm">
              <HardDrive className="w-3 h-3 me-1.5" />
              8.8 TB Total
            </Badge>
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm">
              <Layers className="w-3 h-3 me-1.5" />
              28 Crop Species
            </Badge>
            <Badge className="bg-white/15 border-white/25 text-white backdrop-blur-sm">
              <Database className="w-3 h-3 me-1.5" />
              110,076 Files
            </Badge>
          </motion.div>
        </div>
      </section>

      <div className="container py-8 sm:py-12">
        {/* ── Top Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            {
              label: "Total Data",
              value: "8.8 TB",
              sub: `GBS: ${SUMMARY.gbsDataSize} · WGS: ${SUMMARY.wgsDataSize}`,
              icon: HardDrive,
              color: "#0B5F3A",
            },
            {
              label: "Unique Crops",
              value: "28",
              sub: `${SUMMARY.gbsCrops} GBS · ${SUMMARY.wgsCrops} WGS`,
              icon: Layers,
              color: "#D4AF37",
            },
            {
              label: "FASTQ Files",
              value: "3,756",
              sub: "Raw sequencing reads",
              icon: Dna,
              color: "#2563EB",
            },
            {
              label: "Total Files",
              value: "110,076",
              sub: "Across 2,446 directories",
              icon: Database,
              color: "#C0392B",
            },
          ].map(({ label, value, sub, icon: Icon, color }, i) => (
            <FadeUp key={label} delay={i * 0.08}>
              <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-80"
                  style={{ backgroundColor: color }}
                />
                <CardContent className="pt-5 pb-4 px-4">
                  <div className="flex items-start justify-between mb-1">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${color}18` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/30" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sub}
                  </p>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>

        {/* ── Data Availability Heatmap ── */}
        <FadeUp>
          <Card className="mb-8 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Data Availability Heatmap
              </CardTitle>
              <CardDescription>
                File type availability per crop — click any cell to add to your
                data request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-start px-3 py-2 text-xs font-semibold text-muted-foreground w-28">
                        Crop
                      </th>
                      {HEATMAP_FILE_TYPES.map((ft) => (
                        <th
                          key={ft}
                          className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground"
                        >
                          {ft}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                        Request
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEATMAP_DATA.map((crop, ri) => {
                      const vals = [
                        crop.fastq,
                        crop.vcf,
                        crop.bam,
                        crop.plink,
                        crop.gff,
                        crop.fasta,
                      ];
                      const inCart = requestCart.some(
                        (r) => r.crop === crop.name,
                      );
                      return (
                        <motion.tr
                          key={crop.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: ri * 0.03 }}
                          className="border-t border-border/50"
                        >
                          <td className="px-3 py-2 text-xs font-medium text-foreground whitespace-nowrap">
                            {crop.name}
                          </td>
                          {vals.map((v, ci) => (
                            <td key={ci} className="px-1 py-1 text-center">
                              <div
                                className="mx-auto w-full max-w-[56px] rounded-md py-1.5 text-[11px] font-mono font-medium transition-all hover:scale-110 cursor-default"
                                style={{
                                  backgroundColor: heatColor(v),
                                  color: heatTextColor(v),
                                }}
                                title={`${crop.name} — ${HEATMAP_FILE_TYPES[ci]}: ${v.toLocaleString()} files`}
                              >
                                {v > 0 ? v.toLocaleString() : "—"}
                              </div>
                            </td>
                          ))}
                          <td className="px-2 py-1 text-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const match = ALL_GENOMIC_CROPS.find(
                                  (c) => c.name === crop.name,
                                );
                                if (match) addToCart(match);
                              }}
                              disabled={inCart}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                                inCart
                                  ? "bg-primary/10 text-primary"
                                  : "bg-primary text-white hover:bg-primary/90"
                              }`}
                            >
                              {inCart ? (
                                <>
                                  <CheckCircle className="w-3 h-3" /> Added
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3 h-3" /> Add
                                </>
                              )}
                            </motion.button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3 mt-4 text-[10px] text-muted-foreground">
                <span>File count:</span>
                {[
                  { label: "None", color: "var(--muted)" },
                  { label: "<10", color: "#dbeafe" },
                  { label: "<50", color: "#93c5fd" },
                  { label: "<200", color: "#3b82f6" },
                  { label: "<500", color: "#1d4ed8" },
                  { label: "500+", color: "#1e3a5f" },
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
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Tabs ── */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="text-xs sm:text-sm"><span className="hidden sm:inline">Overview</span></TabsTrigger>
            <TabsTrigger value="gbs" className="text-xs sm:text-sm"><span className="hidden sm:inline">GBS Data</span></TabsTrigger>
            <TabsTrigger value="wgs" className="text-xs sm:text-sm"><span className="hidden sm:inline">WGS Data</span></TabsTrigger>
            <TabsTrigger value="files" className="text-xs sm:text-sm"><span className="hidden sm:inline">File Types</span></TabsTrigger>
            <TabsTrigger value="submit" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("submit.tab")}</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FadeUp>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Samples by Crop (Top 10 by FASTQ)
                    </CardTitle>
                    <CardDescription>
                      GBS shown in green, WGS in blue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={TOP_CROPS_CHART}
                        margin={{ left: -10, bottom: 60 }}
                      >
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          angle={-40}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(v: number) => [
                            v.toLocaleString(),
                            "FASTQ files",
                          ]}
                        />
                        <Bar dataKey="fastq" radius={[4, 4, 0, 0]}>
                          {TOP_CROPS_CHART.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={
                                entry.type === "GBS" ? "#166534" : "#2563EB"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </FadeUp>

              <FadeUp delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Layers className="h-4 w-4 text-primary" />
                      Crop Categories (28 total)
                    </CardTitle>
                    <CardDescription>
                      Distribution across biological groups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={CROP_CATEGORIES}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={45}
                          paddingAngle={3}
                          label={({ name, count }) => `${name} (${count})`}
                          labelLine={false}
                        >
                          {CROP_CATEGORIES.map((cat) => (
                            <Cell key={cat.name} fill={cat.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: number) => [v, "crops"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </FadeUp>
            </div>

            {/* GBS vs WGS */}
            <FadeUp delay={0.15}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Sequencing Strategy Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-semibold">
                          GBS (Genotyping-by-Sequencing)
                        </span>
                        <Badge variant="secondary">
                          {SUMMARY.gbsCrops} crops
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1 pl-5">
                        <div>
                          Total size:{" "}
                          <span className="font-medium text-foreground">
                            {SUMMARY.gbsDataSize}
                          </span>
                        </div>
                        <div>
                          Samples:{" "}
                          <span className="font-medium text-foreground">
                            ~3,140
                          </span>{" "}
                          (dominated by wheat)
                        </div>
                        <div>
                          FASTQ:{" "}
                          <span className="font-medium text-foreground">
                            3,140
                          </span>{" "}
                          | VCF:{" "}
                          <span className="font-medium text-foreground">
                            154
                          </span>{" "}
                          | BAM:{" "}
                          <span className="font-medium text-foreground">
                            217
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <span className="font-semibold">
                          WGS (Whole-Genome Sequencing)
                        </span>
                        <Badge variant="secondary">
                          {SUMMARY.wgsCrops} crops
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1 pl-5">
                        <div>
                          Total size:{" "}
                          <span className="font-medium text-foreground">
                            {SUMMARY.wgsDataSize}
                          </span>
                        </div>
                        <div>
                          Samples:{" "}
                          <span className="font-medium text-foreground">
                            ~618
                          </span>{" "}
                          across 26 crops
                        </div>
                        <div>
                          FASTQ:{" "}
                          <span className="font-medium text-foreground">
                            616
                          </span>{" "}
                          | VCF:{" "}
                          <span className="font-medium text-foreground">
                            68
                          </span>{" "}
                          | Largest: Coffee (866 GB)
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </TabsContent>

          {/* ── GBS Tab ── */}
          <TabsContent value="gbs" className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Dna className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">
                  GBS (Genotyping-by-Sequencing)
                </h2>
                <p className="text-sm text-muted-foreground">
                  {SUMMARY.gbsDataSize} across {SUMMARY.gbsCrops} crops
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GBS_CROPS.map((crop, i) => {
                const inCart = requestCart.some((r) => r.crop === crop.name);
                return (
                  <FadeUp key={crop.name} delay={i * 0.06}>
                    <Card className="border-primary/20 group hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              {crop.name}
                            </CardTitle>
                            <CardDescription className="italic text-xs">
                              {crop.scientific}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {crop.disk}
                            </Badge>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                addToCart({ ...crop, seqType: "GBS" })
                              }
                              disabled={inCart}
                              className={`p-1.5 rounded-lg transition-all ${inCart ? "bg-primary/10 text-primary" : "bg-primary text-white hover:bg-primary/90"}`}
                              title="Add to data request"
                            >
                              {inCart ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[
                            {
                              label: "FASTQ",
                              value: crop.fastq.toLocaleString(),
                            },
                            { label: "VCF", value: crop.vcf },
                            { label: "BAM", value: crop.bam },
                          ].map(({ label, value }) => (
                            <div
                              key={label}
                              className="bg-secondary/60 rounded-lg p-2"
                            >
                              <div className="text-lg font-bold text-primary">
                                {value}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {label}
                              </div>
                            </div>
                          ))}
                        </div>
                        {crop.subSpecies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {crop.subSpecies.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-xs font-normal"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </FadeUp>
                );
              })}
            </div>
          </TabsContent>

          {/* ── WGS Tab ── */}
          <TabsContent value="wgs" className="space-y-4">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">
                    WGS (Whole-Genome Sequencing)
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {SUMMARY.wgsDataSize} across {SUMMARY.wgsCrops} crops
                  </p>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/60 text-left">
                    <th className="px-4 py-3 font-semibold text-foreground">
                      Crop
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground">
                      Scientific Name
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground text-center">
                      Category
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground text-center">
                      FASTQ
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground text-center">
                      VCF
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground text-right">
                      Disk
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground text-center">
                      Request
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredWgsCrops
                    .sort((a, b) => b.fastq - a.fastq)
                    .map((crop, i) => {
                      const inCart = requestCart.some(
                        (r) => r.crop === crop.name,
                      );
                      return (
                        <tr
                          key={`${crop.name}-${i}`}
                          className="hover:bg-secondary/40 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium">
                            {crop.name}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground italic text-xs">
                            {crop.scientific}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge
                              variant="outline"
                              style={{
                                borderColor:
                                  CATEGORY_COLORS[crop.category] + "60",
                                color: CATEGORY_COLORS[crop.category],
                                backgroundColor:
                                  CATEGORY_COLORS[crop.category] + "10",
                              }}
                              className="text-xs"
                            >
                              {crop.category}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center font-mono">
                            {crop.fastq > 0 ? (
                              crop.fastq
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-mono">
                            {crop.vcf > 0 ? (
                              crop.vcf
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground font-mono text-xs">
                            {crop.disk}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                addToCart({ ...crop, seqType: "WGS" })
                              }
                              disabled={inCart}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                                inCart
                                  ? "bg-primary/10 text-primary"
                                  : "bg-primary text-white hover:bg-primary/90"
                              }`}
                            >
                              {inCart ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                              {inCart ? "Added" : "Request"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── File Types Tab ── */}
          <TabsContent value="files" className="space-y-6">
            <FadeUp>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode2 className="h-5 w-5 text-primary" />
                    File Type Breakdown
                  </CardTitle>
                  <CardDescription>
                    110,076 files across 2,446 directories — {SUMMARY.totalDataSize}{" "}
                    total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {FILE_TYPES_LIST.map((ft) => {
                      const pct = Math.round((ft.count / 14_000) * 100);
                      return (
                        <div
                          key={ft.type}
                          className="border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{ft.icon}</span>
                              <span className="font-semibold text-sm">
                                .{ft.type}
                              </span>
                            </div>
                            <span className="text-xl font-bold text-primary">
                              {ft.count.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            {ft.description}
                          </p>
                          <div className="w-full bg-secondary rounded-full h-1.5">
                            <div
                              className="bg-primary rounded-full h-1.5 transition-all"
                              style={{
                                width: `${Math.min(pct, 100)}%`,
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

            <FadeUp delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    PLINK Genotype Dataset
                  </CardTitle>
                  <CardDescription>
                    Binary genotype data for population genetics and GWAS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      {
                        label: "BED files",
                        value: SUMMARY.plinkBed,
                        desc: "Binary genotype matrix",
                      },
                      {
                        label: "BIM files",
                        value: SUMMARY.plinkBim,
                        desc: "Variant map",
                      },
                      {
                        label: "FAM files",
                        value: SUMMARY.plinkFam,
                        desc: "Sample pedigree",
                      },
                    ].map(({ label, value, desc }) => (
                      <div
                        key={label}
                        className="bg-secondary/60 rounded-xl p-4"
                      >
                        <div className="text-2xl font-bold text-primary">
                          {value}
                        </div>
                        <div className="font-medium text-sm mt-1">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          </TabsContent>

          {/* ── Submit Data Tab (merged from SubmitData page) ── */}
          <TabsContent value="submit">
            <FadeUp>
              <div className="max-w-2xl mx-auto">
                {/* Step indicator */}
                <div className="flex items-center justify-center mb-8">
                  {SUBMIT_STEPS.map((s, i) => {
                    const SIcon = s.icon;
                    const isActive = i === submitStep;
                    const isDone = i < submitStep;
                    return (
                      <div key={s.key} className="flex items-center">
                        <motion.button
                          onClick={() => i <= submitStep && setSubmitStep(i)}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                            isDone ? "bg-primary border-primary text-white"
                              : isActive ? "bg-primary/10 border-primary text-primary"
                                : "bg-muted border-border text-muted-foreground"
                          } ${i <= submitStep ? "cursor-pointer" : "cursor-default"}`}
                        >
                          {isDone ? <CheckCircle className="w-5 h-5" /> : <SIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </motion.button>
                        {i < SUBMIT_STEPS.length - 1 && (
                          <div className={`w-8 sm:w-16 h-0.5 mx-1 rounded-full transition-colors ${i < submitStep ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Step label */}
                <div className="text-center mb-6">
                  <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground">
                    {t(`submit.step.${SUBMIT_STEPS[submitStep].key}.title`)}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(`submit.step.${SUBMIT_STEPS[submitStep].key}.desc`)}
                  </p>
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                  {/* Step 1: Researcher Info */}
                  {submitStep === 0 && (
                    <StepMotion key="researcher">
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label={t("submit.field.fullName")} icon={User}>
                              <FormInput placeholder="Dr. Ahmed Al-Rashid" value={researcher.name} onChange={(v) => setResearcher({ ...researcher, name: v })} />
                            </FormField>
                            <FormField label={t("submit.field.institution")} icon={Building2}>
                              <FormInput placeholder="King Saud University" value={researcher.institution} onChange={(v) => setResearcher({ ...researcher, institution: v })} />
                            </FormField>
                          </div>
                          <FormField label={t("submit.field.department")}>
                            <FormInput placeholder="Department of Plant Sciences" value={researcher.department} onChange={(v) => setResearcher({ ...researcher, department: v })} />
                          </FormField>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label={t("submit.field.email")}>
                              <FormInput placeholder="researcher@ksu.edu.sa" type="email" value={researcher.email} onChange={(v) => setResearcher({ ...researcher, email: v })} />
                            </FormField>
                            <FormField label={t("submit.field.orcid")} icon={Hash} hint={t("submit.hint.orcid")}>
                              <FormInput placeholder="0000-0002-1234-5678" value={researcher.orcid} onChange={(v) => setResearcher({ ...researcher, orcid: v })} />
                            </FormField>
                          </div>
                        </CardContent>
                      </Card>
                    </StepMotion>
                  )}

                  {/* Step 2: Passport Data */}
                  {submitStep === 1 && (
                    <StepMotion key="passport">
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label={t("submit.field.crop")} icon={Leaf}>
                              <FormSelect
                                placeholder={t("submit.placeholder.selectCrop")}
                                value={passport.crop}
                                onChange={(v) => setPassport({ ...passport, crop: v })}
                                options={ALL_CROPS_LIST.map((c) => ({ value: c, label: `${CROP_META[c].icon} ${cropLabel(c)} (${CROP_META[c].scientificName})` }))}
                              />
                            </FormField>
                            <FormField label={t("submit.field.accessionId")}>
                              <FormInput placeholder="SA-WHT-2026-001" value={passport.accessionId} onChange={(v) => setPassport({ ...passport, accessionId: v })} />
                            </FormField>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label={t("submit.field.region")} icon={MapPin}>
                              <FormSelect
                                placeholder={t("submit.placeholder.selectRegion")}
                                value={passport.region}
                                onChange={(v) => setPassport({ ...passport, region: v })}
                                options={SAUDI_REGIONS.map((r) => ({ value: r, label: r }))}
                              />
                            </FormField>
                            <FormField label={t("submit.field.collectionDate")} icon={Calendar}>
                              <FormInput type="date" value={passport.collectionDate} onChange={(v) => setPassport({ ...passport, collectionDate: v })} />
                            </FormField>
                          </div>
                          <FormField label={t("submit.field.collectorName")}>
                            <FormInput placeholder="Name of collector or collecting team" value={passport.collectorName} onChange={(v) => setPassport({ ...passport, collectorName: v })} />
                          </FormField>
                          <FormField label={t("submit.field.siteDescription")}>
                            <FormTextarea placeholder="Description of the collection site, soil type, elevation..." value={passport.siteDescription} onChange={(v) => setPassport({ ...passport, siteDescription: v })} />
                          </FormField>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField label={t("submit.field.latitude")}>
                              <FormInput placeholder="21.4225" value={passport.latitude} onChange={(v) => setPassport({ ...passport, latitude: v })} />
                            </FormField>
                            <FormField label={t("submit.field.longitude")}>
                              <FormInput placeholder="39.8262" value={passport.longitude} onChange={(v) => setPassport({ ...passport, longitude: v })} />
                            </FormField>
                            <FormField label={t("submit.field.altitude")}>
                              <FormInput placeholder="1500m" value={passport.altitude} onChange={(v) => setPassport({ ...passport, altitude: v })} />
                            </FormField>
                          </div>
                        </CardContent>
                      </Card>
                    </StepMotion>
                  )}

                  {/* Step 3: Genomic Data */}
                  {submitStep === 2 && (
                    <StepMotion key="genomic">
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <FormField label={t("submit.field.sequencingType")} icon={FlaskConical}>
                            <div className="flex gap-2">
                              {(["GBS", "WGS"] as const).map((type) => (
                                <button key={type} onClick={() => setGenomicForm({ ...genomicForm, sequencingType: type })}
                                  className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                                    genomicForm.sequencingType === type ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                                  }`}
                                >
                                  {type}
                                  <span className="block text-[10px] font-normal mt-0.5">{type === "GBS" ? "Genotyping-by-Sequencing" : "Whole Genome Sequencing"}</span>
                                </button>
                              ))}
                            </div>
                          </FormField>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label={t("submit.field.platform")} icon={HardDrive}>
                              <FormSelect
                                placeholder={t("submit.placeholder.selectPlatform")}
                                value={genomicForm.platform}
                                onChange={(v) => setGenomicForm({ ...genomicForm, platform: v })}
                                options={SEQUENCING_PLATFORMS.map((p) => ({ value: p, label: p }))}
                              />
                            </FormField>
                            <FormField label={t("submit.field.coverageDepth")}>
                              <FormInput placeholder="30x" value={genomicForm.coverageDepth} onChange={(v) => setGenomicForm({ ...genomicForm, coverageDepth: v })} />
                            </FormField>
                          </div>
                          <FormField label={t("submit.field.fileTypes")} icon={FileUp} hint={t("submit.hint.fileTypes")}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {SUBMIT_FILE_TYPES.map((ft) => (
                                <button key={ft.ext} onClick={() => handleFileTypeToggle(ft.ext)}
                                  className={`flex flex-col items-start p-2.5 rounded-lg border-2 text-start transition-all ${
                                    genomicForm.fileTypes.includes(ft.ext) ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                                  }`}
                                >
                                  <span className="text-xs font-bold">{ft.ext}</span>
                                  <span className="text-[10px] opacity-70">{ft.desc}</span>
                                </button>
                              ))}
                            </div>
                          </FormField>
                          <FormField label={t("submit.field.uploadFiles")}>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                              <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">{t("submit.upload.dragDrop")}</p>
                              <p className="text-[11px] text-muted-foreground/60 mt-1">{t("submit.upload.maxSize")}</p>
                            </div>
                          </FormField>
                          <FormField label={t("submit.field.sraAccession")}>
                            <FormInput placeholder="SRR12345678" value={genomicForm.sraAccession} onChange={(v) => setGenomicForm({ ...genomicForm, sraAccession: v })} />
                          </FormField>
                          <FormField label={t("submit.field.dataDescription")}>
                            <FormTextarea placeholder="Brief description of the genomic dataset..." value={genomicForm.description} onChange={(v) => setGenomicForm({ ...genomicForm, description: v })} />
                          </FormField>
                        </CardContent>
                      </Card>
                    </StepMotion>
                  )}

                  {/* Step 4: DOI Preview */}
                  {submitStep === 3 && (
                    <StepMotion key="doi">
                      <Card className="border-primary/40 overflow-hidden">
                        <div className="h-2 mewa-gradient" />
                        <CardHeader className="pb-3 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                            <Award className="w-8 h-8 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{t("submit.doi.title")}</CardTitle>
                          <p className="text-sm text-muted-foreground">{t("submit.doi.description")}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/60 rounded-xl p-4 text-center mb-4">
                            <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider font-medium">Digital Object Identifier</p>
                            <p className="text-xl sm:text-2xl font-mono font-bold text-primary break-all">{mockDoi}</p>
                            <button onClick={handleCopyDoi} className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                              <Copy className="w-3 h-3" />
                              {doiCopied ? t("submit.doi.copied") : t("submit.doi.copyLink")}
                            </button>
                          </div>
                          <div className="bg-card border border-border rounded-lg p-3 mb-4">
                            <p className="text-[11px] text-muted-foreground mb-1">{t("submit.doi.resolvesTo")}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-primary font-medium break-all">https://doi.org/{mockDoi}</span>
                              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-foreground">{t("submit.doi.metadataPreview")}</p>
                            <div className="bg-muted/40 rounded-lg p-3 space-y-1.5 text-xs">
                              {[
                                ["Creator", researcher.name || "—"],
                                ["Publisher", "MEWA Seed Data Center"],
                                ["Resource Type", "Genomic Dataset"],
                                ["Subject", `${passport.crop ? CROP_META[passport.crop as CropType]?.scientificName : "—"} — ${genomicForm.sequencingType}`],
                                ["GeoLocation", `${passport.region || "—"}, Saudi Arabia`],
                                ["Year", String(new Date().getFullYear())],
                                ["Rights", "CC BY 4.0"],
                              ].map(([label, val]) => (
                                <div key={label} className="flex justify-between">
                                  <span className="text-muted-foreground">{label}</span>
                                  <span className="font-medium">{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20">DataCite</Badge>
                            <Badge className="bg-accent/20 text-foreground border-accent/30">CC BY 4.0</Badge>
                            <Badge variant="outline" className="text-muted-foreground">Schema 4.5</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </StepMotion>
                  )}

                  {/* Step 5: Confirmation */}
                  {submitStep === 4 && (
                    <StepMotion key="confirm">
                      <Card className="overflow-hidden">
                        <div className="h-2 mewa-gold-gradient" />
                        <CardContent className="pt-8 pb-6 text-center">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}
                            className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"
                          >
                            <CheckCircle className="w-10 h-10 text-primary" />
                          </motion.div>
                          <h3 className="text-xl font-display font-bold text-foreground mb-2">{t("submit.confirm.title")}</h3>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{t("submit.confirm.description")}</p>
                          <div className="bg-muted/40 rounded-xl p-4 text-start max-w-sm mx-auto space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-primary shrink-0" /><span className="text-muted-foreground">{researcher.name}</span></div>
                            <div className="flex items-center gap-2 text-sm"><Leaf className="w-4 h-4 text-primary shrink-0" /><span className="text-muted-foreground">{passport.crop ? cropLabel(passport.crop as CropType) : "—"} — {passport.region}</span></div>
                            <div className="flex items-center gap-2 text-sm"><Dna className="w-4 h-4 text-primary shrink-0" /><span className="text-muted-foreground">{genomicForm.sequencingType} / {genomicForm.fileTypes.join(", ")}</span></div>
                            <div className="flex items-center gap-2 text-sm"><Award className="w-4 h-4 text-primary shrink-0" /><span className="font-mono text-primary text-xs">{mockDoi}</span></div>
                          </div>
                          <p className="text-xs text-muted-foreground">{t("submit.confirm.reviewNote")}</p>
                        </CardContent>
                      </Card>
                    </StepMotion>
                  )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-6">
                  <button onClick={() => setSubmitStep((s) => Math.max(0, s - 1))} disabled={submitStep === 0}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${submitStep === 0 ? "text-muted-foreground/40 cursor-not-allowed" : "text-foreground hover:bg-muted"}`}
                  >
                    <ChevronLeft className="w-4 h-4" /> {t("submit.nav.back")}
                  </button>
                  {submitStep < SUBMIT_STEPS.length - 1 ? (
                    <button onClick={() => setSubmitStep((s) => Math.min(SUBMIT_STEPS.length - 1, s + 1))} disabled={!canProceedSubmit()}
                      className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${canProceedSubmit() ? "bg-primary text-white hover:bg-primary/90 shadow-sm" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                    >
                      {submitStep === 3 ? t("submit.nav.mintDoi") : t("submit.nav.next")}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => setSubmitStep(0)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 shadow-sm transition-all"
                    >
                      {t("submit.nav.submitAnother")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </FadeUp>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-right mt-6">
          Data snapshot: {SUMMARY.generatedDate}
        </p>
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
                    Request submitted! You will receive an email with download
                    instructions.
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Data Request ({requestCart.length}{" "}
                        {requestCart.length === 1 ? "dataset" : "datasets"})
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {requestCart.map((r) => (
                          <Badge
                            key={r.crop}
                            variant="outline"
                            className="text-[10px] cursor-pointer hover:bg-destructive/10"
                            onClick={() => removeFromCart(r.crop)}
                          >
                            {r.crop} ({r.seqType}) ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRequestCart([]);
                        setShowRequestPanel(false);
                      }}
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
                      Submit Request
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
