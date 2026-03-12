/**
 * Research Hub — Saudi Arabia Crop Genomics & Genetics Literature
 * Studies sourced from: answer_ceb8d085.markdown (2009–2025)
 * 22 comprehensive studies across date palm, wheat, vegetables, food security
 */
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, FileText, ExternalLink, Dna, Sprout, Shield } from "lucide-react";

// ── Data from answer_ceb8d085.markdown ───────────────────────────────────────

const DIRECT_SAUDI_STUDIES = [
  {
    code: "SAU-CROP-001",
    title: "Shaping the future of date palm through new genetic improvement strategies",
    crop: "Date Palm",
    year: 2025,
    markers: ["CRISPR-Cas9", "SNP", "Transcriptome", "Metabolome"],
    authors: "Nasser Al Kaabi et al.",
    journal: "Functional Plant Biology",
    type: "Saudi Direct",
    focus: "Genetic improvement & editing",
  },
  {
    code: "SAU-CROP-002",
    title: "Correlation and genetic analyses in Saudi Arabian wheat reveal correlation networks and several trait-associated markers",
    crop: "Wheat",
    year: 2020,
    markers: ["ISSR", "SSR", "SCoT"],
    authors: "Mohammed Ali Alshehri et al.",
    journal: "ELEWA Biosciences",
    type: "Saudi Direct",
    focus: "19 primers · 195 alleles · 60% polymorphism",
  },
  {
    code: "SAU-CROP-003",
    title: "CRISPR/Cas9: A Practical Approach in Date Palm Genome Editing",
    crop: "Date Palm",
    year: 2017,
    markers: ["CRISPR/Cas9", "Whole Genome"],
    authors: "Muhammad Naeem Sattar et al.",
    journal: "Frontiers Media",
    type: "Saudi Direct",
    focus: "Genome editing — first Saudi application",
  },
  {
    code: "SAU-CROP-004",
    title: "Harnessing rhizospheric core microbiomes from arid regions for enhancing date palm resilience to climate change effects",
    crop: "Date Palm",
    year: 2024,
    markers: ["Microbiome Genomics", "Stress Response Genes"],
    authors: "Ameni Ben Zineb et al.",
    journal: "Frontiers Media",
    type: "Saudi Direct",
    focus: "Climate resilience via microbiome",
  },
];

const REGIONAL_STUDIES = [
  {
    title: "Recent advances in date palm genomics: A comprehensive review",
    crop: "Date Palm", year: 2022,
    authors: "Hifzur Rahman et al.", journal: "Frontiers Media",
    category: "Date Palm Genomics",
  },
  {
    title: "Genetic Diversity and Adaptation of Date Palm (Phoenix dactylifera L.)",
    crop: "Date Palm", year: 2009,
    authors: "Sakina Elshibli", journal: "—",
    category: "Date Palm Genomics",
  },
  {
    title: "Phoenix dactylifera in vitro culture and transformation of Thio-60 antifungal gene via chitosan nanoparticle",
    crop: "Date Palm", year: 2023,
    authors: "Kholoud Abd Allah et al.", journal: "Springer",
    category: "Date Palm Genomics",
  },
  {
    title: "How to Cope With Stress in the Desert—The Date Palm Approach",
    crop: "Date Palm", year: 2024,
    authors: "Baoguo Du et al.", journal: "Wiley",
    category: "Stress Tolerance",
  },
  {
    title: "Applicability of Start Codon Targeted (SCoT) markers for the assessment of genetic diversity in bread wheat germplasm",
    crop: "Wheat", year: 2024,
    authors: "Muhammad Tanveer Altaf et al.", journal: "Springer",
    category: "Stress Tolerance",
  },
  {
    title: "A Blueprint for Building Resilience and Food Security in MENA and SSA Drylands: Diversifying Agriculture With Neglected and Underutilized Species",
    crop: "Multiple (26 NUS crops)", year: 2025,
    authors: "Krishna Prasad Devkota et al.", journal: "Wiley",
    category: "Food Security",
  },
  {
    title: "Oasis agriculture revitalization and carbon sequestration for climate-resilient communities",
    crop: "Multiple", year: 2024,
    authors: "Faten Dhawi & Megbel Aleidan", journal: "Frontiers Media",
    category: "Food Security",
  },
];

const DROUGHT_STUDIES = [
  {
    title: "Molecular and agro-morphological diversity assessment of some bread wheat genotypes and their crosses for drought tolerance",
    authors: "Mohamed A. Ezzat et al.", year: 2024, journal: "PeerJ Inc.",
    markers: ["ISSR", "SCoT"], note: "Saudi-applicable wheat breeding",
  },
  {
    title: "Multivariate Analysis of Morpho-Physiological Traits Reveals Differential Drought Tolerance Potential of Bread Wheat Genotypes at the Seedling Stage",
    authors: "Mohammed Mohi-Ud-Din et al.", year: 2021, journal: "MDPI",
    markers: ["Morpho-physiological"], note: "127 genotypes · 90% accuracy",
  },
  {
    title: "ISSR Markers-Trait Associations and Stability Analysis in Bread Wheat Varieties",
    authors: "M.H. Motawea et al.", year: 2015, journal: "—",
    markers: ["ISSR"], note: "7 drought-tolerant varieties identified (DSI<1)",
  },
  {
    title: "Plant responses to environmental stresses—from gene to biotechnology",
    authors: "Mohammad Ahanger et al.", year: 2017, journal: "Oxford University Press",
    markers: ["Review"], note: "Comprehensive stress response review",
  },
  {
    title: "Salt-Tolerant Crops: Time to Deliver",
    authors: "Vanessa Melino & Mark Tester", year: 2023, journal: "Annual Reviews",
    markers: ["Review"], note: "Salinity tolerance strategies for arid regions",
  },
];

const VEGETABLE_STUDIES = [
  {
    title: "Exploring Genetic Variability among and within Hail Tomato Landraces Based on Sequence-Related Amplified Polymorphism Markers",
    authors: "Reem H. Alzahib et al.", year: 2021, journal: "MDPI",
    region: "Hail, Saudi Arabia", polymorphism: "100%",
    note: "🇸🇦 Direct Saudi Arabia study",
  },
  {
    title: "Morphological, Biochemical, and Molecular Diversity Assessment of Egyptian Bottle Gourd Cultivars",
    authors: "Ehab A. Ibrahim et al.", year: 2024, journal: "Cambridge University Press",
    region: "Regional (applicable to KSA)", polymorphism: "—",
    note: "Vegetable genetic diversity",
  },
  {
    title: "Assessment of genetic variability among Jordanian tomato landrace using inter-simple sequence repeats markers",
    authors: "Mohammad Brake et al.", year: 2021, journal: "Hashemite University",
    region: "Regional context", polymorphism: "—",
    note: "Tomato landrace conservation",
  },
];

const SEED_BANKING_STUDIES = [
  {
    title: "Effective seedbank management to ensure food security and preserve biodiversity",
    authors: "Samik Bhattacharya & Klaus Mummenhoff", year: 2024, journal: "Springer",
    relevance: "Genomic viability prediction models for seed banks",
  },
  {
    title: "A Blueprint for Building Resilience and Food Security in MENA Drylands",
    authors: "Krishna Prasad Devkota et al.", year: 2025, journal: "Wiley",
    relevance: "26 neglected/underutilized species documented for MENA region",
  },
  {
    title: "Oasis agriculture revitalization and carbon sequestration for climate-resilient communities",
    authors: "Faten Dhawi & Megbel Aleidan", year: 2024, journal: "Frontiers Media",
    relevance: "Traditional oasis agricultural system revitalization",
  },
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

export default function ResearchHub() {
  return (
    <PageLayout
      title="Research Hub"
      description="Saudi Arabia Crop Genomics & Genetics — 22 comprehensive studies (2009–2025)"
      hero
    >
      <div className="container py-10">

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Studies", value: "22", sub: "2009–2025", icon: BookOpen },
            { label: "Direct Saudi Studies", value: "4", sub: "KSA-specific research", icon: Shield },
            { label: "Crops Covered", value: "10+", sub: "Date palm, wheat, vegetables…", icon: Sprout },
            { label: "Marker Types", value: "8+", sub: "ISSR, SSR, SCoT, CRISPR…", icon: Dna },
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

        <Tabs defaultValue="saudi" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="saudi">Saudi Direct</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="drought">Drought Studies</TabsTrigger>
            <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
            <TabsTrigger value="gaps">Gaps & Recs</TabsTrigger>
          </TabsList>

          {/* ── Saudi Direct Studies ── */}
          <TabsContent value="saudi" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Primary Saudi Arabia Direct Studies</h2>
                <p className="text-sm text-muted-foreground">4 studies conducted directly in KSA</p>
              </div>
            </div>
            {DIRECT_SAUDI_STUDIES.map((s) => (
              <Card key={s.code} className="border-primary/30 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-primary text-xs">{s.code}</Badge>
                        <Badge variant="outline" className="text-xs" style={{ color: CROP_BADGES[s.crop] || "#166534", borderColor: CROP_BADGES[s.crop] || "#166534" }}>
                          {s.crop}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{s.year}</span>
                      </div>
                      <CardTitle className="text-base leading-snug">{s.title}</CardTitle>
                      <CardDescription className="mt-1">{s.authors} — <span className="italic">{s.journal}</span></CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground font-medium">Markers:</span>
                    {s.markers.map((m) => (
                      <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">📌 {s.focus}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ── Regional Studies ── */}
          <TabsContent value="regional" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Regional Studies Applicable to Saudi Arabia</h2>
                <p className="text-sm text-muted-foreground">7 studies from MENA region with direct KSA relevance</p>
              </div>
            </div>

            {["Date Palm Genomics", "Stress Tolerance", "Food Security"].map((cat) => (
              <Card key={cat}>
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
            ))}
          </TabsContent>

          {/* ── Drought Studies ── */}
          <TabsContent value="drought" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Dna className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold">Wheat Drought Tolerance & Stress Studies</h2>
                <p className="text-sm text-muted-foreground">5 studies — multiple marker types, direct Saudi applications</p>
              </div>
            </div>

            {/* Marker usage summary */}
            <Card className="bg-secondary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Most Frequent Molecular Markers</CardTitle>
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

            {DROUGHT_STUDIES.map((s) => (
              <Card key={s.title} className="hover:shadow-md transition-shadow">
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
            ))}
          </TabsContent>

          {/* ── Vegetable & Seed Banking ── */}
          <TabsContent value="vegetables" className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">Saudi Vegetable & Landrace Studies</h2>
                  <p className="text-sm text-muted-foreground">3 studies — genetic diversity preservation and breeding</p>
                </div>
              </div>
              <div className="space-y-3">
                {VEGETABLE_STUDIES.map((s) => (
                  <Card key={s.title} className="hover:shadow-md transition-shadow">
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
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="font-semibold">Food Security & Seed Banking Studies</h2>
                  <p className="text-sm text-muted-foreground">3 studies — seed conservation and arid-region food security</p>
                </div>
              </div>
              <div className="space-y-3">
                {SEED_BANKING_STUDIES.map((s) => (
                  <Card key={s.title} className="hover:shadow-md transition-shadow">
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
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Gaps & Recommendations ── */}
          <TabsContent value="gaps" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-base text-destructive/80">Research Gaps in Saudi Agriculture</CardTitle>
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

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base">Partner Institutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {[
                      "King Saud University", "King Abdulaziz University", "Qassim University",
                      "KAUST", "KACST", "ICARDA", "ICO", "FAO",
                    ].map((inst) => (
                      <div key={inst} className="flex items-center gap-2 p-1.5 border-l-2 border-primary pl-3">
                        <span className="text-foreground">{inst}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recommendations for Saudi Agricultural Genomics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {RECOMMENDATIONS.map((r) => (
                    <div key={r.num} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
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

            <p className="text-xs text-muted-foreground text-right">
              Source: Comprehensive literature search · 22 studies · 2009–2025
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
