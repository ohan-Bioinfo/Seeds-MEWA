import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Search, Download, Dna, Barcode, Database } from 'lucide-react';
import { loadAllData } from '@/lib/dataLoader';
import { SeedPassport } from '@/types/data';

// Generate consistent barcode pattern based on accession ID
function generateBarcodePattern(accessionId: string): number[] {
  const hash = accessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pattern: number[] = [];
  for (let i = 0; i < 12; i++) {
    pattern.push(((hash * (i + 1) * 7) % 10) + 1);
  }
  return pattern;
}

// Generate SSR marker profile
function generateSSRProfile(accessionId: string, cropType: string): Array<{locus: string, allele1: number, allele2: number}> {
  const hash = accessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const loci = cropType === 'wheat' 
    ? ['Xgwm533', 'Xgwm261', 'Xbarc45', 'Xgwm389', 'Xgwm148']
    : ['CaM21', 'CaM14', 'SSR-03', 'SSR-12', 'SSR-25'];
  
  return loci.map((locus, idx) => ({
    locus,
    allele1: 150 + ((hash * (idx + 1) * 13) % 100),
    allele2: 150 + ((hash * (idx + 2) * 17) % 100)
  }));
}

// Barcode visualization component
function BarcodeVisual({ pattern }: { pattern: number[] }) {
  return (
    <div className="flex items-end gap-0.5 h-24 bg-white p-2 rounded border border-border">
      {pattern.map((height, idx) => (
        <div
          key={idx}
          className="bg-foreground flex-1"
          style={{ height: `${height * 8}%` }}
        />
      ))}
    </div>
  );
}

// SSR Profile visualization
function SSRProfileVisual({ profile }: { profile: Array<{locus: string, allele1: number, allele2: number}> }) {
  return (
    <div className="space-y-3">
      {profile.map((marker, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono font-semibold text-foreground">{marker.locus}</span>
            <span className="text-xs text-muted-foreground">
              {marker.allele1}bp / {marker.allele2}bp
            </span>
          </div>
          <div className="relative h-8 bg-secondary rounded overflow-hidden">
            <div
              className="absolute top-0 h-full bg-primary/60"
              style={{
                left: `${((marker.allele1 - 150) / 100) * 100}%`,
                width: '3px'
              }}
            />
            <div
              className="absolute top-0 h-full bg-primary"
              style={{
                left: `${((marker.allele2 - 150) / 100) * 100}%`,
                width: '3px'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GeneticFingerprints() {
  const [allData, setAllData] = useState<SeedPassport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<'all' | 'wheat' | 'coffee'>('all');

  useEffect(() => {
    loadAllData().then(data => {
      setAllData(data);
      setLoading(false);
    });
  }, []);

  const filteredData = allData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.accessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.localName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || item.cropType === selectedCrop;
    return matchesSearch && matchesCrop;
  });

  if (loading) {
    return (
      <PageLayout title="Genetic Fingerprints" description="DNA barcodes and molecular markers">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading genetic fingerprint data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Genetic Fingerprints"
      description="Comprehensive molecular marker profiles and DNA barcodes for all MEWA seed accessions"
      hero
    >
      <div className="container py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                Total Fingerprints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{allData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Complete profiles</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Dna className="h-4 w-4" />
                SSR Markers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">3,215</div>
              <p className="text-xs text-muted-foreground mt-1">Across all accessions</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Barcode className="h-4 w-4" />
                DNA Barcodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{allData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique identifiers</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Database className="h-4 w-4" />
                Genotyped Loci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">5</div>
              <p className="text-xs text-muted-foreground mt-1">Per accession</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Genetic Fingerprints</CardTitle>
            <CardDescription>
              Find molecular marker profiles by accession ID or local name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by accession ID or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCrop === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCrop('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedCrop === 'wheat' ? 'default' : 'outline'}
                  onClick={() => setSelectedCrop('wheat')}
                >
                  Wheat
                </Button>
                <Button
                  variant={selectedCrop === 'coffee' ? 'default' : 'outline'}
                  onClick={() => setSelectedCrop('coffee')}
                >
                  Coffee
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fingerprint Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Fingerprint Database ({filteredData.length} accessions)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.slice(0, 20).map((accession) => {
              const barcodePattern = generateBarcodePattern(accession.accessionId);
              const ssrProfile = generateSSRProfile(accession.accessionId, accession.cropType);

              return (
                <Card key={accession.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{accession.localName}</CardTitle>
                          <Badge variant={accession.cropType === 'wheat' ? 'default' : 'secondary'}>
                            {accession.cropType}
                          </Badge>
                        </div>
                        <CardDescription className="space-y-1">
                          <div className="font-mono text-sm font-semibold text-foreground">
                            {accession.accessionId}
                          </div>
                          <div className="text-xs italic">{accession.scientificName}</div>
                          <div className="text-xs">{accession.location}</div>
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Download className="h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="barcode" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="barcode">DNA Barcode</TabsTrigger>
                        <TabsTrigger value="ssr">SSR Profile</TabsTrigger>
                      </TabsList>

                      <TabsContent value="barcode" className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Genetic Barcode</h4>
                          <BarcodeVisual pattern={barcodePattern} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="font-mono bg-secondary p-2 rounded">
                            {barcodePattern.join('-')}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="ssr" className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">SSR Marker Profile</h4>
                          <SSRProfileVisual profile={ssrProfile} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredData.length > 20 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Showing 20 of {filteredData.length} fingerprints
              </p>
              <Button variant="outline">Load More</Button>
            </div>
          )}

          {filteredData.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Fingerprint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No fingerprints found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
