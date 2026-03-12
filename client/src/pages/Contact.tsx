import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with MEWA Seed Center team for inquiries, collaboration, or support"
      hero
    >
      <div className="container py-12">
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">info@mewa.gov.sa</p>
              <p className="text-sm text-muted-foreground">seedcenter@mewa.gov.sa</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <Phone className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">+966 11 XXX XXXX</p>
              <p className="text-sm text-muted-foreground">Ext: 234 (Seed Center)</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ministry of Environment, Water & Agriculture
              </p>
              <p className="text-sm text-muted-foreground">Riyadh, Saudi Arabia</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Office Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Sunday - Thursday</p>
              <p className="text-sm text-muted-foreground">8:00 AM - 4:00 PM</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 2 business days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Ahmed" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Al-Otaibi" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="ahmed@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+966 5X XXX XXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution / Organization</Label>
                  <Input id="institution" placeholder="King Saud University" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="seed-request">Seed Request</SelectItem>
                      <SelectItem value="research">Research Collaboration</SelectItem>
                      <SelectItem value="data">Data Access</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full mewa-gradient text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Department Contacts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Contacts</CardTitle>
                <CardDescription>
                  Reach out to specific departments for specialized assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    department: "Seed Exchange & Distribution",
                    contact: "Dr. Ahmed Al-Qahtani",
                    email: "seedexchange@mewa.gov.sa",
                    phone: "Ext. 234"
                  },
                  {
                    department: "Genomics & Molecular Biology",
                    contact: "Dr. Layla Al-Harbi",
                    email: "genomics@mewa.gov.sa",
                    phone: "Ext. 245"
                  },
                  {
                    department: "Research Collaboration",
                    contact: "Dr. Fahad Al-Otaibi",
                    email: "research@mewa.gov.sa",
                    phone: "Ext. 256"
                  },
                  {
                    department: "Data Management & IT Support",
                    contact: "Eng. Khalid Al-Mutairi",
                    email: "itsupport@mewa.gov.sa",
                    phone: "Ext. 267"
                  },
                ].map((dept, idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <h4 className="font-semibold text-foreground mb-2">{dept.department}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${dept.email}`} className="hover:text-primary">
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{dept.phone}</span>
                      </div>
                      <div className="text-xs mt-1">{dept.contact}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">How do I request seed samples?</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit our <a href="/exchange" className="text-primary hover:underline">Seeders Exchange</a> page to browse available accessions and submit a request form.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Can I access genomic data?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Our <a href="/genomics" className="text-primary hover:underline">Genomics Hub</a> provides access to DNA sequences, molecular markers, and analysis tools.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">How can I collaborate on research?</h4>
                  <p className="text-sm text-muted-foreground">
                    Check our <a href="/research" className="text-primary hover:underline">Research Hub</a> for collaboration opportunities and submit a research proposal.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">What is the typical response time?</h4>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to all inquiries within 2 business days. Seed requests may take 5-10 business days for processing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
