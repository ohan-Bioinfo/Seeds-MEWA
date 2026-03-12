import PageLayout from "@/components/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dna,
  Database,
  BarChart3,
  HardDrive,
  FileCode2,
  Layers,
  FlaskConical,
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

// ── Real data from SEEd_Genomics_Data_Summary.csv (generated 2026-03-12) ──────

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
  { name: "Mango", scientific: "Mangifera indica", fastq: 1, vcf: 7, bam: 0, samples: 1, disk: "95 GB", category: "Fruit" },
  { name: "Guar", scientific: "Cyamopsis tetragonoloba", fastq: 4, vcf: 0, bam: 0, samples: 4, disk: "12 GB", category: "Legume" },
  { name: "Fenugreek", scientific: "Trigonella foenum-graecum", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "10 GB", category: "Legume" },
  { name: "Guava", scientific: "Psidium guajava", fastq: 2, vcf: 1, bam: 0, samples: 2, disk: "12 GB", category: "Fruit" },
  { name: "Lemon", scientific: "Citrus limon", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "6.4 GB", category: "Fruit" },
  { name: "NemaGuard", scientific: "Prunus persica (rootstock)", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "5.4 GB", category: "Rootstock" },
  { name: "Quince", scientific: "Cydonia oblonga", fastq: 2, vcf: 0, bam: 0, samples: 2, disk: "5.4 GB", category: "Fruit" },
  { name: "Sesame", scientific: "Sesamum indicum", fastq: 0, vcf: 15, bam: 0, samples: 0, disk: "24 GB", category: "Industrial/Oil" },
  { name: "Apricot (armeniaca)", scientific: "Prunus armeniaca", fastq: 0, vcf: 1, bam: 0, samples: 0, disk: "2.2 GB", category: "Fruit" },
];

const CROP_CATEGORIES = [
  { name: "Fruits", count: 11, color: "#F59E0B" },
  { name: "Cereals", count: 5, color: "#166534" },
  { name: "Legumes", count: 5, color: "#2563EB" },
  { name: "Vegetables", count: 3, color: "#DC2626" },
  { name: "Industrial/Oil", count: 2, color: "#7C3AED" },
  { name: "Rootstock", count: 1, color: "#6B7280" },
];

const FILE_TYPES = [
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

// Top crops by FASTQ for chart (GBS + WGS combined, top 10)
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

export default function GenomicsHub() {
  return (
    <PageLayout
      title="Genomics Hub"
      description="Real sequencing data across 28 crop species — 8.8 TB of GBS and WGS genomic resources"
      hero
    >
      <div className="container py-12">

        {/* ── Top Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Data", value: "8.8 TB", sub: `GBS: ${SUMMARY.gbsDataSize} · WGS: ${SUMMARY.wgsDataSize}`, icon: HardDrive },
            { label: "Unique Crops", value: "28", sub: `${SUMMARY.gbsCrops} GBS · ${SUMMARY.wgsCrops} WGS`, icon: Layers },
            { label: "FASTQ Files", value: "3,756", sub: "Raw sequencing reads", icon: Dna },
            { label: "Total Files", value: "110,076", sub: `Across ${SUMMARY.totalFiles.toLocaleString()} files in 2,446 dirs`, icon: Database },
          ].map(({ label, value, sub, icon: Icon }) => (
            <Card key={label} className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gbs">GBS Data</TabsTrigger>
            <TabsTrigger value="wgs">WGS Data</TabsTrigger>
            <TabsTrigger value="files">File Types</TabsTrigger>
          </TabsList>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Samples per crop (top 10) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Samples by Crop (Top 10 by FASTQ files)
                  </CardTitle>
                  <CardDescription>GBS shown in green, WGS in blue</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={TOP_CROPS_CHART} margin={{ left: -10, bottom: 60 }}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        angle={-40}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number) => [v.toLocaleString(), "FASTQ files"]} />
                      <Bar dataKey="fastq" radius={[4, 4, 0, 0]}>
                        {TOP_CROPS_CHART.map(entry => (
                          <Cell
                            key={entry.name}
                            fill={entry.type === "GBS" ? "#166534" : "#2563EB"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Crop categories donut */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Layers className="h-4 w-4 text-primary" />
                    Crop Categories (28 total)
                  </CardTitle>
                  <CardDescription>Distribution across biological groups</CardDescription>
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
                        {CROP_CATEGORIES.map(cat => (
                          <Cell key={cat.name} fill={cat.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [v, "crops"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* GBS vs WGS comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sequencing Strategy Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="font-semibold">GBS (Genotyping-by-Sequencing)</span>
                      <Badge variant="secondary">{SUMMARY.gbsCrops} crops</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1 pl-5">
                      <div>Total size: <span className="font-medium text-foreground">{SUMMARY.gbsDataSize}</span></div>
                      <div>Samples: <span className="font-medium text-foreground">~3,140</span> (dominated by wheat)</div>
                      <div>FASTQ files: <span className="font-medium text-foreground">3,140</span></div>
                      <div>VCF files: <span className="font-medium text-foreground">154</span></div>
                      <div>BAM files: <span className="font-medium text-foreground">217</span> (wheat only)</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="font-semibold">WGS (Whole-Genome Sequencing)</span>
                      <Badge variant="secondary">{SUMMARY.wgsCrops} crops</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1 pl-5">
                      <div>Total size: <span className="font-medium text-foreground">{SUMMARY.wgsDataSize}</span></div>
                      <div>Samples: <span className="font-medium text-foreground">~618</span> across 26 crops</div>
                      <div>FASTQ files: <span className="font-medium text-foreground">616</span></div>
                      <div>VCF files: <span className="font-medium text-foreground">68</span></div>
                      <div>Largest: Coffee (866 GB), Millet (526 GB)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-right">
              Data snapshot: {SUMMARY.generatedDate}
            </p>
          </TabsContent>

          {/* ── GBS Tab ── */}
          <TabsContent value="gbs" className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Dna className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">GBS (Genotyping-by-Sequencing)</h2>
                <p className="text-sm text-muted-foreground">
                  {SUMMARY.gbsDataSize} across {SUMMARY.gbsCrops} crops — primarily large-scale wheat panel
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GBS_CROPS.map(crop => (
                <Card key={crop.name} className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{crop.name}</CardTitle>
                        <CardDescription className="italic text-xs">{crop.scientific}</CardDescription>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        {crop.disk}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: "FASTQ", value: crop.fastq.toLocaleString() },
                        { label: "VCF", value: crop.vcf },
                        { label: "BAM", value: crop.bam },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-secondary/60 rounded-lg p-2">
                          <div className="text-lg font-bold text-primary">{value}</div>
                          <div className="text-xs text-muted-foreground">{label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">~{crop.samples.toLocaleString()} samples</span>
                    </div>
                    {crop.subSpecies.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Sub-species / Taxa:</p>
                        <div className="flex flex-wrap gap-1">
                          {crop.subSpecies.map(s => (
                            <Badge key={s} variant="secondary" className="text-xs font-normal">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── WGS Tab ── */}
          <TabsContent value="wgs" className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">WGS (Whole-Genome Sequencing)</h2>
                <p className="text-sm text-muted-foreground">
                  {SUMMARY.wgsDataSize} across {SUMMARY.wgsCrops} diverse crops — fruits, vegetables, legumes, and more
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/60 text-left">
                    <th className="px-4 py-3 font-semibold text-foreground">Crop</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Scientific Name</th>
                    <th className="px-4 py-3 font-semibold text-foreground text-center">Category</th>
                    <th className="px-4 py-3 font-semibold text-foreground text-center">FASTQ</th>
                    <th className="px-4 py-3 font-semibold text-foreground text-center">VCF</th>
                    <th className="px-4 py-3 font-semibold text-foreground text-right">Disk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {WGS_CROPS.sort((a, b) => b.fastq - a.fastq).map((crop, i) => (
                    <tr
                      key={`${crop.name}-${i}`}
                      className="hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{crop.name}</td>
                      <td className="px-4 py-3 text-muted-foreground italic text-xs">{crop.scientific}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: CATEGORY_COLORS[crop.category] + "60",
                            color: CATEGORY_COLORS[crop.category],
                            backgroundColor: CATEGORY_COLORS[crop.category] + "10",
                          }}
                          className="text-xs"
                        >
                          {crop.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        {crop.fastq > 0 ? crop.fastq : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        {crop.vcf > 0 ? crop.vcf : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground font-mono text-xs">
                        {crop.disk}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── File Types Tab ── */}
          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode2 className="h-5 w-5 text-primary" />
                  File Type Breakdown
                </CardTitle>
                <CardDescription>
                  110,076 files across 2,446 directories — {SUMMARY.totalDataSize} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FILE_TYPES.map(ft => {
                    const pct = Math.round((ft.count / 14_000) * 100); // rough scale
                    return (
                      <div
                        key={ft.type}
                        className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{ft.icon}</span>
                            <span className="font-semibold text-sm">.{ft.type}</span>
                          </div>
                          <span className="text-xl font-bold text-primary">
                            {ft.count.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{ft.description}</p>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                          <div
                            className="bg-primary rounded-full h-1.5 transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* PLINK summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">PLINK Genotype Dataset</CardTitle>
                <CardDescription>Binary genotype data for population genetics and GWAS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: "BED files", value: SUMMARY.plinkBed, desc: "Binary genotype matrix" },
                    { label: "BIM files", value: SUMMARY.plinkBim, desc: "Variant map" },
                    { label: "FAM files", value: SUMMARY.plinkFam, desc: "Sample pedigree" },
                  ].map(({ label, value, desc }) => (
                    <div key={label} className="bg-secondary/60 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">{value}</div>
                      <div className="font-medium text-sm mt-1">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </PageLayout>
  );
}
