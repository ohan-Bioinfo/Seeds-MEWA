export interface SeedPassport {
  id: string;
  accessionId: string;
  localName: string;
  genus: string;
  species: string;
  scientificName: string;
  source: string;
  arabicName: string;
  country: string;
  province: string;
  location: string;
  cropType: 'wheat' | 'coffee';
}

export interface RegionStats {
  region: string;
  wheatCount: number;
  coffeeCount: number;
  totalCount: number;
}

export interface FilterState {
  cropType: string[];
  regions: string[];
  searchTerm: string;
}

export const SAUDI_REGIONS = [
  'Taif',
  'Aseer',
  'Al-Baha',
  'Najran',
  'Riyadh',
  'Qaseem',
  'Hail',
  'Jazan',
  'Tabuk'
] as const;

export type SaudiRegion = typeof SAUDI_REGIONS[number];
