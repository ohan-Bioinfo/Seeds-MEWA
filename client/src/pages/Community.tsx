import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, MapPin, GraduationCap, Building2, Globe } from "lucide-react";

export default function Community() {
  return (
    <PageLayout
      title="Scientific Community"
      description="Connect with researchers, breeders, and institutions working with Saudi germplasm"
      hero
    >
      <div className="container py-12">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Researchers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">127</div>
              <p className="text-xs text-muted-foreground mt-1">Active members</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Institutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">42</div>
              <p className="text-xs text-muted-foreground mt-1">Partner organizations</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">18</div>
              <p className="text-xs text-muted-foreground mt-1">Global reach</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collaborations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">89</div>
              <p className="text-xs text-muted-foreground mt-1">Joint projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Researchers Directory */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Featured Researchers</CardTitle>
            <CardDescription>
              Scientists and breeders working with MEWA germplasm resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Dr. Fahad Al-Otaibi",
                  title: "Professor of Plant Breeding",
                  institution: "King Saud University",
                  location: "Riyadh, Saudi Arabia",
                  expertise: ["Wheat breeding", "Drought tolerance", "Molecular markers"],
                  projects: 8,
                  publications: 34
                },
                {
                  name: "Dr. Noura Al-Ghamdi",
                  title: "Senior Researcher",
                  institution: "MEWA Research Center",
                  location: "Jeddah, Saudi Arabia",
                  expertise: ["Coffee genetics", "Germplasm conservation", "Diversity analysis"],
                  projects: 6,
                  publications: 22
                },
                {
                  name: "Dr. Mohammed Al-Shehri",
                  title: "Associate Professor",
                  institution: "King Abdulaziz University",
                  location: "Jeddah, Saudi Arabia",
                  expertise: ["Barley breeding", "Disease resistance", "QTL mapping"],
                  projects: 7,
                  publications: 28
                },
                {
                  name: "Dr. Sara Al-Dosari",
                  title: "Assistant Professor",
                  institution: "Qassim University",
                  location: "Buraydah, Saudi Arabia",
                  expertise: ["Date palm genetics", "Tissue culture", "Quality traits"],
                  projects: 5,
                  publications: 18
                },
                {
                  name: "Dr. Ahmed Al-Qahtani",
                  title: "Germplasm Curator",
                  institution: "MEWA Seed Center",
                  location: "Riyadh, Saudi Arabia",
                  expertise: ["Seed conservation", "Passport data", "Characterization"],
                  projects: 12,
                  publications: 31
                },
                {
                  name: "Dr. Layla Al-Harbi",
                  title: "Research Scientist",
                  institution: "KACST",
                  location: "Riyadh, Saudi Arabia",
                  expertise: ["Genomics", "Bioinformatics", "Gene expression"],
                  projects: 9,
                  publications: 26
                },
              ].map((researcher, idx) => (
                <Card key={idx} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                        {researcher.name.split(' ')[1][0]}
                      </div>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Mail className="h-3 w-3" />
                        Contact
                      </Button>
                    </div>
                    <CardTitle className="text-base">{researcher.name}</CardTitle>
                    <CardDescription className="text-sm">{researcher.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{researcher.institution}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{researcher.location}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-foreground mb-2">Research Expertise:</h4>
                      <div className="flex flex-wrap gap-1">
                        {researcher.expertise.map((area, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-primary">{researcher.projects}</div>
                        <div className="text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-primary">{researcher.publications}</div>
                        <div className="text-muted-foreground">Publications</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partner Institutions */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Institutions</CardTitle>
            <CardDescription>
              Universities and research organizations collaborating with MEWA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "King Saud University",
                  type: "University",
                  location: "Riyadh",
                  country: "Saudi Arabia",
                  researchers: 18,
                  projects: 12
                },
                {
                  name: "King Abdulaziz University",
                  type: "University",
                  location: "Jeddah",
                  country: "Saudi Arabia",
                  researchers: 14,
                  projects: 9
                },
                {
                  name: "Qassim University",
                  type: "University",
                  location: "Buraydah",
                  country: "Saudi Arabia",
                  researchers: 11,
                  projects: 7
                },
                {
                  name: "KAUST",
                  type: "Research Institute",
                  location: "Thuwal",
                  country: "Saudi Arabia",
                  researchers: 9,
                  projects: 6
                },
                {
                  name: "KACST",
                  type: "Research Institute",
                  location: "Riyadh",
                  country: "Saudi Arabia",
                  researchers: 16,
                  projects: 11
                },
                {
                  name: "ICARDA",
                  type: "International Organization",
                  location: "Beirut",
                  country: "Lebanon",
                  researchers: 8,
                  projects: 5
                },
                {
                  name: "FAO",
                  type: "International Organization",
                  location: "Rome",
                  country: "Italy",
                  researchers: 5,
                  projects: 4
                },
                {
                  name: "CIMMYT",
                  type: "International Organization",
                  location: "Mexico City",
                  country: "Mexico",
                  researchers: 6,
                  projects: 3
                },
                {
                  name: "University of California Davis",
                  type: "University",
                  location: "Davis, CA",
                  country: "United States",
                  researchers: 4,
                  projects: 2
                },
              ].map((institution, idx) => (
                <Card key={idx} className="border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{institution.name}</CardTitle>
                        <CardDescription className="text-xs">{institution.type}</CardDescription>
                      </div>
                      <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {institution.location}, {institution.country}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <div>
                        <span className="font-semibold text-primary">{institution.researchers}</span>
                        <span className="text-muted-foreground"> researchers</span>
                      </div>
                      <div>
                        <span className="font-semibold text-primary">{institution.projects}</span>
                        <span className="text-muted-foreground"> projects</span>
                      </div>
                    </div>
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
