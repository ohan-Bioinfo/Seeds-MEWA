import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SeedCenterMap from '@/components/SeedCenterMap';
import { seedCenters, SeedCenter, getCentersByRegion } from '@/data/seedCenters';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Wheat, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  Building2,
  TrendingUp,
  Package,
  Database
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const REGIONS = ['Taif', 'Aseer', 'Al-Baha', 'Najran', 'Riyadh', 'Qaseem', 'Hail', 'Jazan', 'Tabuk'];

export default function Centers() {
  const { t, language, dir } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState<SeedCenter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredCenters = seedCenters.filter(center => {
    if (selectedRegion && center.region !== selectedRegion) return false;
    if (selectedCrop && !center.crops.some(crop => 
      crop.name.toLowerCase().includes(selectedCrop.toLowerCase())
    )) return false;
    return true;
  });

  const handleCenterClick = (center: SeedCenter) => {
    setSelectedCenter(center);
    setDialogOpen(true);
  };

  return (
    <PageLayout
      title={language === 'ar' ? 'مراكز البذور' : 'Seed Centers'}
      description={language === 'ar' ? 'استكشف مراكز البذور في جميع أنحاء المملكة' : 'Explore seed centers across the Kingdom'}
      hero
    >
      <div className="container py-8 md:py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Building2 className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary">{seedCenters.length}</div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {language === 'ar' ? 'مركز' : 'Centers'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Users className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {seedCenters.reduce((sum, c) => sum + c.staff, 0)}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {language === 'ar' ? 'موظف' : 'Staff'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Database className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {seedCenters.reduce((sum, c) => sum + c.tracking.accessionsStored, 0)}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {language === 'ar' ? 'عينة' : 'Accessions'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Package className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {(seedCenters.reduce((sum, c) => sum + c.seedExchange.distributed, 0) / 1000).toFixed(0)}K
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {language === 'ar' ? 'كجم موزعة' : 'kg Distributed'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {language === 'ar' ? 'المنطقة' : 'Region'}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">{language === 'ar' ? 'جميع المناطق' : 'All Regions'}</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {language === 'ar' ? 'المحصول' : 'Crop'}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">{language === 'ar' ? 'جميع المحاصيل' : 'All Crops'}</option>
                  <option value="wheat">{language === 'ar' ? 'القمح' : 'Wheat'}</option>
                  <option value="coffee">{language === 'ar' ? 'البن' : 'Coffee'}</option>
                  <option value="dates">{language === 'ar' ? 'التمور' : 'Dates'}</option>
                  <option value="barley">{language === 'ar' ? 'الشعير' : 'Barley'}</option>
                </select>
              </div>

              {(selectedRegion || selectedCrop) && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRegion('');
                      setSelectedCrop('');
                    }}
                  >
                    {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map and List Tabs */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="map">
              {language === 'ar' ? 'عرض الخريطة' : 'Map View'}
            </TabsTrigger>
            <TabsTrigger value="list">
              {language === 'ar' ? 'عرض القائمة' : 'List View'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <SeedCenterMap
              selectedRegion={selectedRegion}
              selectedCrop={selectedCrop}
              onCenterClick={handleCenterClick}
            />
          </TabsContent>

          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredCenters.map(center => (
                <Card 
                  key={center.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCenterClick(center)}
                >
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">
                      {language === 'ar' ? center.nameAr : center.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {center.city}, {center.region}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {center.crops.slice(0, 3).map((crop, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {language === 'ar' ? crop.nameAr : crop.name}
                        </Badge>
                      ))}
                      {center.crops.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{center.crops.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{center.staff} {language === 'ar' ? 'موظف' : 'staff'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{center.established}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'العينات' : 'Accessions'}
                        </span>
                        <span className="font-semibold">{center.tracking.accessionsStored}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Center Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCenter && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl">
                  {language === 'ar' ? selectedCenter.nameAr : selectedCenter.name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {language === 'ar' ? selectedCenter.contact.addressAr : selectedCenter.contact.address}
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedCenter.area}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' ? 'المساحة' : 'Area'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedCenter.staff}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' ? 'الموظفون' : 'Staff'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedCenter.crops.length}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' ? 'المحاصيل' : 'Crops'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-primary">{selectedCenter.established}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' ? 'التأسيس' : 'Est.'}
                    </div>
                  </div>
                </div>

                {/* Crops */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Wheat className="h-5 w-5 text-primary" />
                    {language === 'ar' ? 'المحاصيل المزروعة' : 'Crops Planted'}
                  </h3>
                  <div className="space-y-2">
                    {selectedCenter.crops.map((crop, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                        <div>
                          <div className="font-medium">{language === 'ar' ? crop.nameAr : crop.name}</div>
                          <div className="text-xs text-muted-foreground">{crop.plantingSeason}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{crop.area}</div>
                          <div className="text-xs text-muted-foreground">{crop.varieties} varieties</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {language === 'ar' ? 'الأنشطة' : 'Activities'}
                  </h3>
                  <div className="space-y-2">
                    {selectedCenter.activities.map((activity, idx) => (
                      <div key={idx} className="p-3 bg-secondary rounded-lg">
                        <Badge className="mb-2">{activity.type}</Badge>
                        <p className="text-sm">
                          {language === 'ar' ? activity.descriptionAr : activity.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seed Exchange */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    {language === 'ar' ? 'تبادل البذور' : 'Seed Exchange'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedCenter.seedExchange.distributed.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'كجم موزعة/سنة' : 'kg Distributed/year'}
                      </div>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedCenter.seedExchange.received.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'كجم مستلمة/سنة' : 'kg Received/year'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">
                      {language === 'ar' ? 'الشركاء' : 'Partners'}:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCenter.seedExchange.partners.map((partner, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {partner}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${selectedCenter.contact.phone}`} className="hover:underline">
                        {selectedCenter.contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${selectedCenter.contact.email}`} className="hover:underline">
                        {selectedCenter.contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
