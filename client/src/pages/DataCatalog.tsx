import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import DataTable from '@/components/DataTable';
import FilterPanel from '@/components/FilterPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SeedPassport } from '@/types/data';
import { loadAllData, filterData } from '@/lib/dataLoader';
import { Download, FileSpreadsheet, Database, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DataCatalog() {
  const { t, dir } = useLanguage();
  const [allData, setAllData] = useState<SeedPassport[]>([]);
  const [filteredData, setFilteredData] = useState<SeedPassport[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllData().then(data => {
      setAllData(data);
      setFilteredData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filtered = filterData(allData, {
      cropType: selectedCrops,
      regions: selectedRegions,
      searchTerm: searchTerm
    });
    setFilteredData(filtered);
  }, [selectedCrops, selectedRegions, searchTerm, allData]);

  const handleCropChange = (crops: string[]) => {
    setSelectedCrops(crops);
  };

  const handleRegionChange = (regions: string[]) => {
    setSelectedRegions(regions);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleExportCSV = () => {
    const headers = ['Accession ID', 'Local Name', 'Scientific Name', 'Genus', 'Species', 'Source', 'Arabic Name', 'Country', 'Province', 'Location', 'Crop Type'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.accessionId,
        `"${row.localName}"`,
        `"${row.scientificName}"`,
        row.genus,
        row.species,
        `"${row.source}"`,
        `"${row.arabicName}"`,
        row.country,
        row.province,
        row.location,
        row.cropType
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mewa-seed-catalog-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Data exported successfully!');
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mewa-seed-catalog-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Data exported successfully!');
  };

  if (loading) {
    return (
      <PageLayout title={t('catalog.title')} description={t('catalog.description')}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={t('catalog.title')}
      description={t('catalog.description')}
      hero
    >
      <div className="container py-12">
        {/* Stats and Export Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Database className="h-4 w-4" />
                {t('catalog.totalRecords')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{filteredData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredData.length === allData.length ? t('catalog.allAccessions') : `${t('common.filter')} ${allData.length}`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('catalog.wheat')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#B8860B]">
                {filteredData.filter(d => d.cropType === 'wheat').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t('catalog.triticum')}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('catalog.coffee')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#6F4E37]">
                {filteredData.filter(d => d.cropType === 'coffee').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t('catalog.coffea')}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Export Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-3 w-3 mr-1" />
                CSV
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={handleExportJSON}>
                <Download className="h-3 w-3 mr-1" />
                JSON
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Fingerprint Access Banner */}
        <Card className="mb-8 border-primary bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">Genetic Fingerprint Database</h3>
                  <p className="text-sm text-muted-foreground">
                    Access molecular markers, DNA barcodes, and genetic fingerprints for all accessions
                  </p>
                </div>
              </div>
              <Button className="mewa-gradient text-white" onClick={() => window.location.href = '/fingerprints'}>
                <Fingerprint className="h-4 w-4 mr-2" />
                View Fingerprints
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content: Filters + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              selectedCrops={selectedCrops}
              selectedRegions={selectedRegions}
              searchTerm={searchTerm}
              onCropChange={handleCropChange}
              onRegionChange={handleRegionChange}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Data Table */}
          <div className="lg:col-span-3">
            <DataTable data={filteredData} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
