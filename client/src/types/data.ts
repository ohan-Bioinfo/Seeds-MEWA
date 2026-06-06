import type { CropType } from '@/data/passportData';

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
  cropType: CropType;
}

export interface RegionStats {
  region: string;
  crops: Partial<Record<CropType, number>>;
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
  'Eastern',
  'Tabuk'
] as const;

export type SaudiRegion = typeof SAUDI_REGIONS[number];
