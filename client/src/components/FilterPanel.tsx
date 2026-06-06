/* Design Philosophy: Data-Driven Cartography with Agricultural Heritage
   Filter Panel: Clean, functional filters with Saudi region focus
   Checkboxes for crop types and regions with search functionality
*/

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { SAUDI_REGIONS } from '@/types/data';
import { CROP_META, getPassportCropTypes } from '@/data/passportData';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterPanelProps {
  selectedCrops: string[];
  selectedRegions: string[];
  searchTerm: string;
  onCropChange: (crops: string[]) => void;
  onRegionChange: (regions: string[]) => void;
  onSearchChange: (term: string) => void;
}

export default function FilterPanel({
  selectedCrops,
  selectedRegions,
  searchTerm,
  onCropChange,
  onRegionChange,
  onSearchChange
}: FilterPanelProps) {
  const { language } = useLanguage();
  const handleCropToggle = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      onCropChange(selectedCrops.filter(c => c !== crop));
    } else {
      onCropChange([...selectedCrops, crop]);
    }
  };
  
  const handleRegionToggle = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionChange(selectedRegions.filter(r => r !== region));
    } else {
      onRegionChange([...selectedRegions, region]);
    }
  };
  
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg font-display">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Accession ID, location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {/* Crop Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Crop Type</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getPassportCropTypes().map((crop) => (
              <div key={crop} className="flex items-center space-x-2">
                <Checkbox
                  id={crop}
                  checked={selectedCrops.includes(crop)}
                  onCheckedChange={() => handleCropToggle(crop)}
                />
                <label
                  htmlFor={crop}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CROP_META[crop].color }}
                  ></span>
                  {language === 'ar' ? CROP_META[crop].labelAr : CROP_META[crop].label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Region Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Saudi Regions</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {SAUDI_REGIONS.map(region => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={region}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => handleRegionToggle(region)}
                />
                <label
                  htmlFor={region}
                  className="text-sm cursor-pointer"
                >
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Clear Filters */}
        {(selectedCrops.length > 0 || selectedRegions.length > 0 || searchTerm) && (
          <button
            onClick={() => {
              onCropChange([]);
              onRegionChange([]);
              onSearchChange('');
            }}
            className="text-sm text-[#4A5D3F] hover:underline"
          >
            Clear all filters
          </button>
        )}
      </CardContent>
    </Card>
  );
}
