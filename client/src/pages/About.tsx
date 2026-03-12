import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Award, Users, Leaf, Database, Globe, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <PageLayout
      title="About MEWA Seed Center"
      description="Preserving Saudi Arabia's agricultural heritage and advancing crop improvement through science"
      hero
    >
      <div className="container py-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                To conserve, characterize, and utilize Saudi Arabia's plant genetic resources for sustainable agriculture, food security, and crop improvement. We serve as the national repository for agricultural germplasm, supporting research, breeding programs, and conservation efforts across the Kingdom and beyond.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                To be a world-class center of excellence in plant genetic resources management, recognized for our contributions to agricultural biodiversity conservation, genomic research, and climate-resilient crop development. We envision a future where Saudi germplasm plays a vital role in global food security.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Core Values</CardTitle>
            <CardDescription>
              Principles that guide our work and commitment to excellence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Leaf,
                  title: "Conservation",
                  description: "Protecting biodiversity and preserving genetic resources for future generations"
                },
                {
                  icon: Database,
                  title: "Open Science",
                  description: "Sharing data, knowledge, and resources to advance agricultural research globally"
                },
                {
                  icon: Globe,
                  title: "Collaboration",
                  description: "Building partnerships with researchers, institutions, and communities worldwide"
                },
                {
                  icon: TrendingUp,
                  title: "Innovation",
                  description: "Leveraging cutting-edge genomics and breeding technologies for crop improvement"
                },
              ].map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div key={idx} className="text-center space-y-3">
                    <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* What We Do */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">What We Do</CardTitle>
            <CardDescription>
              Our core activities and services for the scientific community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Germplasm Conservation",
                  description: "Long-term preservation of seed samples in controlled environments, maintaining viability and genetic integrity for wheat, coffee, barley, date palm, and other crops native to Saudi Arabia."
                },
                {
                  title: "Characterization & Evaluation",
                  description: "Comprehensive phenotypic and genotypic characterization of accessions, documenting morphological traits, agronomic performance, and molecular markers to support breeding and research."
                },
                {
                  title: "Seed Distribution",
                  description: "Providing seed samples to qualified researchers, breeding programs, and conservation projects worldwide through our Material Transfer Agreement system."
                },
                {
                  title: "Genomic Research",
                  description: "DNA sequencing, molecular marker development, and genome-wide association studies to identify genes controlling important traits like drought tolerance and disease resistance."
                },
                {
                  title: "Data Management",
                  description: "Maintaining comprehensive passport, characterization, and evaluation databases accessible to the global research community through our online portal."
                },
                {
                  title: "Capacity Building",
                  description: "Training programs, workshops, and collaborative research opportunities to strengthen expertise in germplasm management, breeding, and genomics across the region."
                },
              ].map((activity, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Achievements */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Key Achievements</CardTitle>
            </div>
            <CardDescription>
              Milestones in our journey to preserve and utilize Saudi germplasm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  year: "2026",
                  title: "Genomic Database Launch",
                  description: "Released comprehensive genomic database with DNA sequences and molecular markers for 643 accessions, enabling advanced breeding research."
                },
                {
                  year: "2025",
                  title: "Climate-Resilient Wheat Release",
                  description: "Developed and released MEWA-Wheat-1, a drought-tolerant variety adapted to arid conditions, increasing yields by 18% in marginal lands."
                },
                {
                  year: "2024",
                  title: "International Recognition",
                  description: "Designated as FAO Regional Genebank for Middle East coffee genetic resources, strengthening our role in global conservation efforts."
                },
                {
                  year: "2023",
                  title: "Digital Transformation",
                  description: "Launched online seed request portal and interactive germplasm database, improving accessibility for researchers worldwide."
                },
                {
                  year: "2022",
                  title: "Expansion of Collections",
                  description: "Collected and conserved 200+ traditional coffee accessions from southwestern Saudi Arabia, documenting unique genetic diversity."
                },
              ].map((achievement, idx) => (
                <div key={idx} className="flex gap-4 p-4 border-l-4 border-primary bg-secondary/30 rounded-r-lg">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {achievement.year.slice(2)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leadership Team */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl">Leadership Team</CardTitle>
            </div>
            <CardDescription>
              Dedicated professionals leading MEWA Seed Center's mission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Dr. Ahmed Al-Qahtani",
                  title: "Director, MEWA Seed Center",
                  bio: "Plant geneticist with 20+ years experience in germplasm conservation and characterization"
                },
                {
                  name: "Dr. Noura Al-Ghamdi",
                  title: "Head of Research",
                  bio: "Molecular biologist specializing in coffee genetics and diversity assessment"
                },
                {
                  name: "Dr. Fahad Al-Otaibi",
                  title: "Chief Breeding Officer",
                  bio: "Wheat breeder focused on developing climate-resilient varieties for arid regions"
                },
                {
                  name: "Dr. Layla Al-Harbi",
                  title: "Head of Genomics",
                  bio: "Computational biologist leading genomic sequencing and bioinformatics initiatives"
                },
                {
                  name: "Eng. Khalid Al-Mutairi",
                  title: "IT & Data Manager",
                  bio: "Information systems specialist managing databases and digital infrastructure"
                },
                {
                  name: "Dr. Sara Al-Dosari",
                  title: "Conservation Coordinator",
                  bio: "Seed physiologist overseeing long-term storage and viability monitoring"
                },
              ].map((member, idx) => (
                <Card key={idx} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-3">
                      {member.name.split(' ')[1][0]}
                    </div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary">
                      {member.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
