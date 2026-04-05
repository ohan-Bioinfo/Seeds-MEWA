/**
 * Submit Data — Multi-step wizard for genomic + passport data submission
 * Prototype front-end: demonstrates researcher submission flow & DOI minting
 * Steps: 1) Researcher Info  2) Passport Data  3) Genomic Data  4) DOI Preview  5) Confirmation
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { CROP_META, CropType, getActiveCropTypes } from "@/data/passportData";
import {
  User,
  FileText,
  Dna,
  Award,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  Globe,
  Building2,
  Hash,
  Leaf,
  MapPin,
  Calendar,
  FlaskConical,
  HardDrive,
  FileUp,
  ExternalLink,
  Copy,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const ALL_CROPS = getActiveCropTypes();
const STEPS = [
  { icon: User, key: "researcher" },
  { icon: FileText, key: "passport" },
  { icon: Dna, key: "genomic" },
  { icon: Award, key: "doi" },
  { icon: CheckCircle, key: "confirm" },
];

const SAUDI_REGIONS = [
  "Jazan",
  "Aseer",
  "Al-Baha",
  "Riyadh",
  "Qaseem",
  "Hail",
  "Taif",
  "Najran",
  "Tabuk",
  "Madinah",
  "Makkah",
  "Eastern Province",
];

const SEQUENCING_PLATFORMS = [
  "Illumina NovaSeq 6000",
  "Illumina HiSeq X",
  "Illumina MiSeq",
  "PacBio Sequel II",
  "Oxford Nanopore MinION",
  "Oxford Nanopore PromethION",
  "MGI DNBSEQ-T7",
  "Ion Torrent Genexus",
];

const FILE_TYPES = [
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

/* ── Form field component ── */
function Field({
  label,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  hint?: string;
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

/* ── Styled input ── */
function Input({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    />
  );
}

/* ── Styled select ── */
function Select({
  placeholder,
  value,
  onChange,
  options,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ── Styled textarea ── */
function Textarea({
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
    />
  );
}

export default function SubmitData() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(0);
  const [doiCopied, setDoiCopied] = useState(false);

  // Form state
  const [researcher, setResearcher] = useState({
    name: "",
    institution: "",
    email: "",
    orcid: "",
    department: "",
  });
  const [passport, setPassport] = useState({
    crop: "" as string,
    accessionId: "",
    region: "",
    collectionDate: "",
    collectorName: "",
    siteDescription: "",
    latitude: "",
    longitude: "",
    altitude: "",
    notes: "",
  });
  const [genomic, setGenomic] = useState({
    sequencingType: "GBS" as "GBS" | "WGS",
    platform: "",
    libraryType: "",
    coverageDepth: "",
    fileTypes: [] as string[],
    totalSizeMB: "",
    sraAccession: "",
    description: "",
  });

  // Generate mock DOI
  const mockDoi = useMemo(() => {
    const year = new Date().getFullYear();
    const cropCode = passport.crop
      ? passport.crop.substring(0, 3).toUpperCase()
      : "XXX";
    const seq = String(Math.floor(Math.random() * 9000) + 1000);
    return `10.26037/mewa.${year}.${cropCode}.${seq}`;
  }, [passport.crop, step]);

  const cropLabel = (crop: CropType) =>
    language === "ar" ? CROP_META[crop].labelAr : CROP_META[crop].label;

  const canProceed = () => {
    switch (step) {
      case 0:
        return researcher.name && researcher.institution && researcher.email;
      case 1:
        return passport.crop && passport.region;
      case 2:
        return genomic.platform && genomic.fileTypes.length > 0;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleFileTypeToggle = (ext: string) => {
    setGenomic((prev) => ({
      ...prev,
      fileTypes: prev.fileTypes.includes(ext)
        ? prev.fileTypes.filter((f) => f !== ext)
        : [...prev.fileTypes, ext],
    }));
  };

  const handleCopyDoi = () => {
    navigator.clipboard.writeText(`https://doi.org/${mockDoi}`);
    setDoiCopied(true);
    setTimeout(() => setDoiCopied(false), 2000);
  };

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[220px] flex items-center">
        <div className="absolute inset-0 mewa-gradient opacity-95" />
        <div className="absolute inset-0 topographic-pattern opacity-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-sm" />
        <div className="container relative py-10 md:py-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {t("submit.badge.new")}
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
              {t("submit.hero.title")}
            </h1>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl">
              {t("submit.hero.description")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container py-8">
        {/* ── Step indicator ── */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={s.key} className="flex items-center">
                <motion.button
                  onClick={() => i <= step && setStep(i)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isDone
                      ? "bg-primary border-primary text-white"
                      : isActive
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground"
                  } ${i <= step ? "cursor-pointer" : "cursor-default"}`}
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </motion.button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 rounded-full transition-colors ${
                      i < step ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step label */}
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-display font-semibold text-foreground">
            {t(`submit.step.${STEPS[step].key}.title`)}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t(`submit.step.${STEPS[step].key}.desc`)}
          </p>
        </div>

        {/* ── Step content ── */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Researcher Info */}
            {step === 0 && (
              <StepMotion key="researcher">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label={t("submit.field.fullName")} icon={User}>
                        <Input
                          placeholder="Dr. Ahmed Al-Rashid"
                          value={researcher.name}
                          onChange={(v) =>
                            setResearcher({ ...researcher, name: v })
                          }
                        />
                      </Field>
                      <Field
                        label={t("submit.field.institution")}
                        icon={Building2}
                      >
                        <Input
                          placeholder="King Saud University"
                          value={researcher.institution}
                          onChange={(v) =>
                            setResearcher({ ...researcher, institution: v })
                          }
                        />
                      </Field>
                    </div>
                    <Field label={t("submit.field.department")}>
                      <Input
                        placeholder="Department of Plant Sciences"
                        value={researcher.department}
                        onChange={(v) =>
                          setResearcher({ ...researcher, department: v })
                        }
                      />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label={t("submit.field.email")}>
                        <Input
                          placeholder="researcher@ksu.edu.sa"
                          type="email"
                          value={researcher.email}
                          onChange={(v) =>
                            setResearcher({ ...researcher, email: v })
                          }
                        />
                      </Field>
                      <Field
                        label={t("submit.field.orcid")}
                        icon={Hash}
                        hint={t("submit.hint.orcid")}
                      >
                        <Input
                          placeholder="0000-0002-1234-5678"
                          value={researcher.orcid}
                          onChange={(v) =>
                            setResearcher({ ...researcher, orcid: v })
                          }
                        />
                      </Field>
                    </div>
                  </CardContent>
                </Card>
              </StepMotion>
            )}

            {/* Step 2: Passport Data */}
            {step === 1 && (
              <StepMotion key="passport">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label={t("submit.field.crop")} icon={Leaf}>
                        <Select
                          placeholder={t("submit.placeholder.selectCrop")}
                          value={passport.crop}
                          onChange={(v) =>
                            setPassport({ ...passport, crop: v })
                          }
                          options={ALL_CROPS.map((c) => ({
                            value: c,
                            label: `${CROP_META[c].icon} ${cropLabel(c)} (${CROP_META[c].scientificName})`,
                          }))}
                        />
                      </Field>
                      <Field label={t("submit.field.accessionId")}>
                        <Input
                          placeholder="SA-WHT-2026-001"
                          value={passport.accessionId}
                          onChange={(v) =>
                            setPassport({ ...passport, accessionId: v })
                          }
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label={t("submit.field.region")} icon={MapPin}>
                        <Select
                          placeholder={t("submit.placeholder.selectRegion")}
                          value={passport.region}
                          onChange={(v) =>
                            setPassport({ ...passport, region: v })
                          }
                          options={SAUDI_REGIONS.map((r) => ({
                            value: r,
                            label: r,
                          }))}
                        />
                      </Field>
                      <Field
                        label={t("submit.field.collectionDate")}
                        icon={Calendar}
                      >
                        <Input
                          type="date"
                          value={passport.collectionDate}
                          onChange={(v) =>
                            setPassport({ ...passport, collectionDate: v })
                          }
                        />
                      </Field>
                    </div>
                    <Field label={t("submit.field.collectorName")}>
                      <Input
                        placeholder="Name of collector or collecting team"
                        value={passport.collectorName}
                        onChange={(v) =>
                          setPassport({ ...passport, collectorName: v })
                        }
                      />
                    </Field>
                    <Field label={t("submit.field.siteDescription")}>
                      <Textarea
                        placeholder="Description of the collection site, soil type, elevation..."
                        value={passport.siteDescription}
                        onChange={(v) =>
                          setPassport({ ...passport, siteDescription: v })
                        }
                      />
                    </Field>
                    <div className="grid grid-cols-3 gap-4">
                      <Field label={t("submit.field.latitude")}>
                        <Input
                          placeholder="21.4225"
                          value={passport.latitude}
                          onChange={(v) =>
                            setPassport({ ...passport, latitude: v })
                          }
                        />
                      </Field>
                      <Field label={t("submit.field.longitude")}>
                        <Input
                          placeholder="39.8262"
                          value={passport.longitude}
                          onChange={(v) =>
                            setPassport({ ...passport, longitude: v })
                          }
                        />
                      </Field>
                      <Field label={t("submit.field.altitude")}>
                        <Input
                          placeholder="1500m"
                          value={passport.altitude}
                          onChange={(v) =>
                            setPassport({ ...passport, altitude: v })
                          }
                        />
                      </Field>
                    </div>
                  </CardContent>
                </Card>
              </StepMotion>
            )}

            {/* Step 3: Genomic Data */}
            {step === 2 && (
              <StepMotion key="genomic">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {/* Sequencing type toggle */}
                    <Field
                      label={t("submit.field.sequencingType")}
                      icon={FlaskConical}
                    >
                      <div className="flex gap-2">
                        {(["GBS", "WGS"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() =>
                              setGenomic({
                                ...genomic,
                                sequencingType: type,
                              })
                            }
                            className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                              genomic.sequencingType === type
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            {type}
                            <span className="block text-[10px] font-normal mt-0.5">
                              {type === "GBS"
                                ? "Genotyping-by-Sequencing"
                                : "Whole Genome Sequencing"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label={t("submit.field.platform")}
                        icon={HardDrive}
                      >
                        <Select
                          placeholder={t("submit.placeholder.selectPlatform")}
                          value={genomic.platform}
                          onChange={(v) =>
                            setGenomic({ ...genomic, platform: v })
                          }
                          options={SEQUENCING_PLATFORMS.map((p) => ({
                            value: p,
                            label: p,
                          }))}
                        />
                      </Field>
                      <Field label={t("submit.field.coverageDepth")}>
                        <Input
                          placeholder="30x"
                          value={genomic.coverageDepth}
                          onChange={(v) =>
                            setGenomic({ ...genomic, coverageDepth: v })
                          }
                        />
                      </Field>
                    </div>

                    {/* File types multi-select */}
                    <Field
                      label={t("submit.field.fileTypes")}
                      icon={FileUp}
                      hint={t("submit.hint.fileTypes")}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {FILE_TYPES.map((ft) => (
                          <button
                            key={ft.ext}
                            onClick={() => handleFileTypeToggle(ft.ext)}
                            className={`flex flex-col items-start p-2.5 rounded-lg border-2 text-start transition-all ${
                              genomic.fileTypes.includes(ft.ext)
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            <span className="text-xs font-bold">{ft.ext}</span>
                            <span className="text-[10px] opacity-70">
                              {ft.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </Field>

                    {/* Mock file upload area */}
                    <Field label={t("submit.field.uploadFiles")}>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {t("submit.upload.dragDrop")}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-1">
                          {t("submit.upload.maxSize")}
                        </p>
                      </div>
                    </Field>

                    <Field label={t("submit.field.sraAccession")}>
                      <Input
                        placeholder="SRR12345678"
                        value={genomic.sraAccession}
                        onChange={(v) =>
                          setGenomic({ ...genomic, sraAccession: v })
                        }
                      />
                    </Field>

                    <Field label={t("submit.field.dataDescription")}>
                      <Textarea
                        placeholder="Brief description of the genomic dataset..."
                        value={genomic.description}
                        onChange={(v) =>
                          setGenomic({ ...genomic, description: v })
                        }
                      />
                    </Field>
                  </CardContent>
                </Card>
              </StepMotion>
            )}

            {/* Step 4: DOI Preview */}
            {step === 3 && (
              <StepMotion key="doi">
                <div className="space-y-4">
                  {/* DOI Card */}
                  <Card className="border-primary/40 overflow-hidden">
                    <div className="h-2 mewa-gradient" />
                    <CardHeader className="pb-3 text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        {t("submit.doi.title")}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t("submit.doi.description")}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {/* DOI Display */}
                      <div className="bg-muted/60 rounded-xl p-4 text-center mb-4">
                        <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider font-medium">
                          Digital Object Identifier
                        </p>
                        <p className="text-xl sm:text-2xl font-mono font-bold text-primary break-all">
                          {mockDoi}
                        </p>
                        <button
                          onClick={handleCopyDoi}
                          className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                        >
                          <Copy className="w-3 h-3" />
                          {doiCopied
                            ? t("submit.doi.copied")
                            : t("submit.doi.copyLink")}
                        </button>
                      </div>

                      {/* Resolves to URL */}
                      <div className="bg-card border border-border rounded-lg p-3 mb-4">
                        <p className="text-[11px] text-muted-foreground mb-1">
                          {t("submit.doi.resolvesTo")}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-primary font-medium break-all">
                            https://doi.org/{mockDoi}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                        </div>
                      </div>

                      {/* DataCite metadata preview */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-foreground">
                          {t("submit.doi.metadataPreview")}
                        </p>
                        <div className="bg-muted/40 rounded-lg p-3 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Creator
                            </span>
                            <span className="font-medium">
                              {researcher.name || "—"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Publisher
                            </span>
                            <span className="font-medium">
                              MEWA Seed Data Center
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Resource Type
                            </span>
                            <span className="font-medium">
                              Genomic Dataset
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Subject
                            </span>
                            <span className="font-medium">
                              {passport.crop
                                ? CROP_META[passport.crop as CropType]
                                    ?.scientificName
                                : "—"}{" "}
                              — {genomic.sequencingType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              GeoLocation
                            </span>
                            <span className="font-medium">
                              {passport.region || "—"}, Saudi Arabia
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Year</span>
                            <span className="font-medium">
                              {new Date().getFullYear()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Rights
                            </span>
                            <span className="font-medium">CC BY 4.0</span>
                          </div>
                        </div>
                      </div>

                      {/* DataCite badge */}
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          DataCite
                        </Badge>
                        <Badge className="bg-accent/20 text-foreground border-accent/30">
                          CC BY 4.0
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Schema 4.5
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </StepMotion>
            )}

            {/* Step 5: Confirmation */}
            {step === 4 && (
              <StepMotion key="confirm">
                <Card className="overflow-hidden">
                  <div className="h-2 mewa-gold-gradient" />
                  <CardContent className="pt-8 pb-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 12,
                      }}
                      className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"
                    >
                      <CheckCircle className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      {t("submit.confirm.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      {t("submit.confirm.description")}
                    </p>

                    {/* Submission summary */}
                    <div className="bg-muted/40 rounded-xl p-4 text-start max-w-sm mx-auto space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">
                          {researcher.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Leaf className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">
                          {passport.crop
                            ? cropLabel(passport.crop as CropType)
                            : "—"}{" "}
                          — {passport.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Dna className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">
                          {genomic.sequencingType} /{" "}
                          {genomic.fileTypes.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-mono text-primary text-xs">
                          {mockDoi}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {t("submit.confirm.reviewNote")}
                    </p>
                  </CardContent>
                </Card>
              </StepMotion>
            )}
          </AnimatePresence>

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                step === 0
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t("submit.nav.back")}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                disabled={!canProceed()}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  canProceed()
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {step === 3 ? t("submit.nav.mintDoi") : t("submit.nav.next")}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 shadow-sm transition-all"
              >
                {t("submit.nav.submitAnother")}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
