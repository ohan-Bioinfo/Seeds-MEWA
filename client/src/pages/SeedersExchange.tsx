import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sprout, Send, Package, FileCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function SeedersExchange() {
  return (
    <PageLayout
      title="Seeders Exchange"
      description="Request seed samples for research, breeding programs, and conservation efforts"
      hero
    >
      <div className="container py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20 hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="h-5 w-5 text-primary" />
                Request Seeds
              </CardTitle>
              <CardDescription>Submit a new seed request for research</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mewa-gradient text-white">
                New Request
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" />
                Browse Catalog
              </CardTitle>
              <CardDescription>Explore available seed accessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Catalog
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5 text-primary" />
                Track Requests
              </CardTitle>
              <CardDescription>Monitor your request status</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                My Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="available">Available Seeds</TabsTrigger>
            <TabsTrigger value="process">Request Process</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Seed Collections</CardTitle>
                <CardDescription>
                  High-demand accessions available for immediate request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      id: "W 129",
                      name: "قمح الجبل",
                      species: "Triticum aestivum L",
                      region: "Al-Baha",
                      traits: ["Drought tolerant", "High protein"],
                      availability: "Available",
                      quantity: "500g"
                    },
                    {
                      id: "C 25",
                      name: "بن خولاني",
                      species: "Coffea arabica",
                      region: "Jazan",
                      traits: ["Disease resistant", "High yield"],
                      availability: "Available",
                      quantity: "200g"
                    },
                    {
                      id: "W 131",
                      name: "قمح (صيداء)",
                      species: "Triticum aestivum L",
                      region: "Taif",
                      traits: ["Heat tolerant", "Early maturity"],
                      availability: "Limited",
                      quantity: "250g"
                    },
                    {
                      id: "C 27",
                      name: "بن خولاني",
                      species: "Coffea arabica",
                      region: "Aseer",
                      traits: ["Aromatic", "Premium quality"],
                      availability: "Available",
                      quantity: "300g"
                    },
                    {
                      id: "W 222",
                      name: "قمح دمياط",
                      species: "Triticum aestivum L",
                      region: "Riyadh",
                      traits: ["Salt tolerant", "High biomass"],
                      availability: "Available",
                      quantity: "400g"
                    },
                    {
                      id: "C 30",
                      name: "بن عذبي",
                      species: "Coffea arabica",
                      region: "Al-Baha",
                      traits: ["Shade adapted", "Consistent yield"],
                      availability: "Available",
                      quantity: "250g"
                    },
                  ].map((seed) => (
                    <Card key={seed.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1">{seed.name}</CardTitle>
                            <CardDescription className="text-xs italic">{seed.species}</CardDescription>
                          </div>
                          <Badge variant={seed.availability === "Available" ? "default" : "secondary"} className="text-xs">
                            {seed.availability}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Accession:</span>
                            <span className="font-mono font-medium">{seed.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Region:</span>
                            <span className="font-medium">{seed.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Available:</span>
                            <span className="font-medium">{seed.quantity}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {seed.traits.map((trait, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>

                        <Button size="sm" className="w-full mewa-gradient text-white">
                          <Send className="h-3 w-3 mr-1" />
                          Request Sample
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seed Request Workflow</CardTitle>
                <CardDescription>
                  Step-by-step process for requesting seed samples from MEWA Seed Center
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Submit Request",
                      description: "Complete the online request form with research details and required accessions",
                      icon: Send,
                      status: "active"
                    },
                    {
                      step: 2,
                      title: "Review & Approval",
                      description: "MEWA team reviews your request and research justification (2-5 business days)",
                      icon: FileCheck,
                      status: "pending"
                    },
                    {
                      step: 3,
                      title: "MTA Agreement",
                      description: "Sign Material Transfer Agreement outlining terms of use and data sharing",
                      icon: FileCheck,
                      status: "pending"
                    },
                    {
                      step: 4,
                      title: "Seed Preparation",
                      description: "Seeds are prepared, packaged, and quality-checked for shipment",
                      icon: Package,
                      status: "pending"
                    },
                    {
                      step: 5,
                      title: "Shipment",
                      description: "Seeds are shipped to your institution with tracking information",
                      icon: CheckCircle2,
                      status: "pending"
                    },
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            step.status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          {step.step < 5 && (
                            <div className="w-0.5 h-12 bg-border my-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">Step {step.step}: {step.title}</h4>
                            {step.status === 'active' && (
                              <Badge className="bg-primary">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Request Status</CardTitle>
                <CardDescription>Track your recent seed requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "REQ-2026-001", accessions: "W 129, W 131", date: "2026-02-10", status: "approved", stage: "Preparation" },
                    { id: "REQ-2026-002", accessions: "C 25, C 27", date: "2026-02-12", status: "pending", stage: "Under Review" },
                    { id: "REQ-2025-089", accessions: "W 222", date: "2025-12-15", status: "shipped", stage: "Delivered" },
                  ].map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        {request.status === 'shipped' ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : request.status === 'approved' ? (
                          <Clock className="h-5 w-5 text-accent" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-semibold text-foreground">{request.id}</div>
                          <div className="text-sm text-muted-foreground">{request.accessions}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{request.stage}</div>
                          <div className="text-xs text-muted-foreground">{request.date}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Research Institutions:</strong> Universities, research centers, and government agencies conducting agricultural research
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Breeding Programs:</strong> Registered plant breeding organizations with documented programs
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Conservation Projects:</strong> Approved conservation and biodiversity initiatives
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Educational Use:</strong> Academic institutions for teaching and student research projects
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Research Proposal:</strong> Detailed description of research objectives and methodology
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Institutional Letter:</strong> Official letter from your organization supporting the request
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>MTA Signature:</strong> Signed Material Transfer Agreement acknowledging terms and conditions
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Import Permits:</strong> Required phytosanitary certificates for international requests
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Terms of Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Seeds provided by MEWA Seed Center are for research and breeding purposes only. Recipients must:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Use seeds only for stated research objectives</li>
                    <li>Not distribute seeds to third parties without permission</li>
                    <li>Acknowledge MEWA in publications using the germplasm</li>
                    <li>Share research results and data as outlined in MTA</li>
                    <li>Comply with Nagoya Protocol and national regulations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <strong className="text-foreground">Seed Exchange Coordinator</strong>
                    <p className="text-muted-foreground">Dr. Ahmed Al-Qahtani</p>
                  </div>
                  <div>
                    <strong className="text-foreground">Email</strong>
                    <p className="text-muted-foreground">seedexchange@mewa.gov.sa</p>
                  </div>
                  <div>
                    <strong className="text-foreground">Phone</strong>
                    <p className="text-muted-foreground">+966 11 XXX XXXX ext. 234</p>
                  </div>
                  <div>
                    <strong className="text-foreground">Office Hours</strong>
                    <p className="text-muted-foreground">Sunday - Thursday, 8:00 AM - 4:00 PM</p>
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
