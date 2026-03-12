import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, FileText, Microscope, TrendingUp, ExternalLink } from "lucide-react";

export default function ResearchHub() {
  return (
    <PageLayout
      title="Research Hub"
      description="Collaborative research platform for agricultural scientists and breeding programs"
      hero
    >
      <div className="container py-12">
        {/* Research Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">24</div>
              <p className="text-xs text-muted-foreground mt-1">Ongoing research</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Publications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">156</div>
              <p className="text-xs text-muted-foreground mt-1">Peer-reviewed papers</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collaborators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">42</div>
              <p className="text-xs text-muted-foreground mt-1">Partner institutions</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Breeding Lines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">387</div>
              <p className="text-xs text-muted-foreground mt-1">Advanced lines</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="projects">Research Projects</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="breeding">Breeding Programs</TabsTrigger>
            <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Research Projects</CardTitle>
                <CardDescription>
                  Current research initiatives at MEWA Seed Center
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Climate-Resilient Wheat Varieties for Arid Regions",
                      pi: "Dr. Fahad Al-Otaibi",
                      institution: "King Saud University",
                      duration: "2024-2027",
                      status: "Active",
                      focus: ["Drought tolerance", "Heat stress", "Yield stability"],
                      funding: "KACST"
                    },
                    {
                      title: "Genetic Diversity Assessment of Saudi Coffee Germplasm",
                      pi: "Dr. Noura Al-Ghamdi",
                      institution: "MEWA Research Center",
                      duration: "2025-2026",
                      status: "Active",
                      focus: ["Molecular markers", "Population structure", "Conservation"],
                      funding: "MEWA"
                    },
                    {
                      title: "Development of Disease-Resistant Barley Cultivars",
                      pi: "Dr. Mohammed Al-Shehri",
                      institution: "King Abdulaziz University",
                      duration: "2023-2026",
                      status: "Active",
                      focus: ["Fungal resistance", "QTL mapping", "Marker-assisted selection"],
                      funding: "KAUST"
                    },
                    {
                      title: "Sustainable Date Palm Production Systems",
                      pi: "Dr. Sara Al-Dosari",
                      institution: "Qassim University",
                      duration: "2025-2028",
                      status: "Active",
                      focus: ["Water efficiency", "Integrated pest management", "Quality traits"],
                      funding: "KACST"
                    },
                  ].map((project, idx) => (
                    <Card key={idx} className="border-border hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {project.pi}
                              </div>
                              <div>•</div>
                              <div>{project.institution}</div>
                            </div>
                          </div>
                          <Badge className="bg-primary">{project.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {project.focus.map((area, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                          <div className="text-muted-foreground">
                            Duration: <span className="text-foreground font-medium">{project.duration}</span>
                          </div>
                          <div className="text-muted-foreground">
                            Funding: <span className="text-foreground font-medium">{project.funding}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Publications</CardTitle>
                <CardDescription>
                  Peer-reviewed research using MEWA germplasm resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Genetic diversity and population structure of Saudi wheat landraces revealed by SSR markers",
                      authors: "Al-Otaibi F, Al-Shehri M, Al-Qahtani A",
                      journal: "Saudi Journal of Biological Sciences",
                      year: 2026,
                      doi: "10.1016/j.sjbs.2026.01.234",
                      citations: 12,
                      type: "Research Article"
                    },
                    {
                      title: "Drought tolerance mechanisms in traditional coffee varieties from southwestern Saudi Arabia",
                      authors: "Al-Ghamdi N, Al-Dosari S, Mohammed K",
                      journal: "Plant Physiology and Biochemistry",
                      year: 2026,
                      doi: "10.1016/j.plaphy.2026.02.156",
                      citations: 8,
                      type: "Research Article"
                    },
                    {
                      title: "Marker-assisted selection for heat tolerance in Saudi wheat breeding programs",
                      authors: "Al-Shehri M, Al-Otaibi F, Hassan R",
                      journal: "Crop Science",
                      year: 2025,
                      doi: "10.1002/csc2.20987",
                      citations: 24,
                      type: "Research Article"
                    },
                    {
                      title: "Conservation and utilization of plant genetic resources in Saudi Arabia: Current status and future prospects",
                      authors: "Al-Qahtani A, Al-Ghamdi N, Al-Dosari S",
                      journal: "Genetic Resources and Crop Evolution",
                      year: 2025,
                      doi: "10.1007/s10722-025-01234-5",
                      citations: 31,
                      type: "Review"
                    },
                  ].map((pub, idx) => (
                    <Card key={idx} className="border-border hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold mb-2 leading-snug">
                              {pub.title}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {pub.authors}
                            </div>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {pub.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <div className="space-y-1">
                            <div className="text-muted-foreground">
                              <span className="italic">{pub.journal}</span> ({pub.year})
                            </div>
                            <div className="text-xs text-muted-foreground">
                              DOI: {pub.doi} • Cited by {pub.citations}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1">
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breeding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Breeding Programs</CardTitle>
                <CardDescription>
                  Crop improvement initiatives utilizing MEWA germplasm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      crop: "Wheat",
                      program: "Saudi Wheat Improvement Program",
                      objectives: ["Drought tolerance", "Disease resistance", "Quality traits", "Yield potential"],
                      lines: 156,
                      trials: 12,
                      releases: 3,
                      coordinator: "Dr. Fahad Al-Otaibi"
                    },
                    {
                      crop: "Coffee",
                      program: "Saudi Coffee Enhancement Initiative",
                      objectives: ["Climate adaptation", "Cup quality", "Pest resistance", "Productivity"],
                      lines: 48,
                      trials: 6,
                      releases: 1,
                      coordinator: "Dr. Noura Al-Ghamdi"
                    },
                    {
                      crop: "Barley",
                      program: "Barley Breeding for Marginal Lands",
                      objectives: ["Salt tolerance", "Low water requirement", "Feed quality", "Early maturity"],
                      lines: 89,
                      trials: 8,
                      releases: 2,
                      coordinator: "Dr. Mohammed Al-Shehri"
                    },
                    {
                      crop: "Date Palm",
                      program: "Date Palm Genetic Improvement",
                      objectives: ["Fruit quality", "Water efficiency", "Disease resistance", "Shelf life"],
                      lines: 94,
                      trials: 5,
                      releases: 1,
                      coordinator: "Dr. Sara Al-Dosari"
                    },
                  ].map((program, idx) => (
                    <Card key={idx} className="border-primary/20">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{program.crop} Breeding</CardTitle>
                          <Microscope className="h-5 w-5 text-primary" />
                        </div>
                        <CardDescription className="font-medium text-foreground">
                          {program.program}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Breeding Objectives:</h4>
                          <div className="flex flex-wrap gap-1">
                            {program.objectives.map((obj, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {obj}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{program.lines}</div>
                            <div className="text-xs text-muted-foreground">Lines</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{program.trials}</div>
                            <div className="text-xs text-muted-foreground">Trials</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{program.releases}</div>
                            <div className="text-xs text-muted-foreground">Releases</div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border">
                          <div className="text-xs text-muted-foreground mb-2">Program Coordinator:</div>
                          <div className="text-sm font-medium text-foreground">{program.coordinator}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Variety Releases</CardTitle>
                <CardDescription>
                  New cultivars developed from MEWA germplasm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "MEWA-Wheat-1", crop: "Wheat", year: 2025, traits: "Drought tolerant, High yield", region: "Central & Western" },
                    { name: "Saudi Coffee Elite", crop: "Coffee", year: 2024, traits: "Premium quality, Disease resistant", region: "Southern" },
                    { name: "MEWA-Barley-3", crop: "Barley", year: 2025, traits: "Salt tolerant, Early maturity", region: "Eastern" },
                  ].map((variety, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-semibold text-foreground">{variety.name}</div>
                          <div className="text-sm text-muted-foreground">{variety.crop} • {variety.traits}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{variety.year}</div>
                        <div className="text-xs text-muted-foreground">{variety.region}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Research Collaboration
                  </CardTitle>
                  <CardDescription>
                    Partner with MEWA Seed Center on research projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We welcome collaborative research proposals from universities, research institutions, and breeding programs worldwide.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Joint research projects and funding applications</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Student research and thesis projects</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Technology transfer and capacity building</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>International germplasm exchange programs</span>
                    </li>
                  </ul>
                  <Button className="w-full mewa-gradient text-white">
                    Submit Proposal
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Training & Workshops
                  </CardTitle>
                  <CardDescription>
                    Capacity building programs and technical training
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    MEWA offers training programs in plant genetic resources management, breeding, and genomics.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Germplasm characterization and evaluation</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Molecular marker techniques</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Breeding methodology and selection</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Bioinformatics and data analysis</span>
                    </li>
                  </ul>
                  <Button className="w-full mewa-gradient text-white">
                    View Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Data Sharing
                  </CardTitle>
                  <CardDescription>
                    Access and contribute to MEWA databases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We encourage data sharing to advance agricultural research and breeding programs.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Phenotypic evaluation data</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Genotypic and molecular marker data</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Environmental and agronomic trial results</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Germplasm characterization information</span>
                    </li>
                  </ul>
                  <Button className="w-full mewa-gradient text-white">
                    Data Portal
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Partner Institutions</CardTitle>
                  <CardDescription>
                    Our research and breeding network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {[
                      "King Saud University",
                      "King Abdulaziz University",
                      "Qassim University",
                      "King Abdullah University of Science and Technology (KAUST)",
                      "King Abdulaziz City for Science and Technology (KACST)",
                      "International Center for Agricultural Research in the Dry Areas (ICARDA)",
                      "International Coffee Organization (ICO)",
                      "Food and Agriculture Organization (FAO)",
                    ].map((institution, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border-l-2 border-primary pl-3">
                        <span className="text-foreground">{institution}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
