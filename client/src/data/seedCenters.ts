/**
 * Seed stations — derived from المحطات/فهرس_المحطات.json (updated 2026-04-23).
 * 9 real stations: staff, area, coordinates, and operational stats from source data.
 * Fields with no data in the source are left blank / zero.
 */

export interface SeedCenter {
  id: string;
  name: string;
  nameAr: string;
  region: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  established: string;
  area: string; // hectares
  staff: number;
  crops: {
    name: string;
    nameAr: string;
    area: string;
    varieties: number;
    plantingSeason: string;
  }[];
  activities: {
    type: 'breeding' | 'conservation' | 'distribution' | 'research' | 'training';
    description: string;
    descriptionAr: string;
  }[];
  seedExchange: {
    distributed: number; // seedlings / cuttings produced (مجموع إنتاج العقل/الشتلات)
    received: number;
    partners: string[];
  };
  tracking: {
    accessionsStored: number;
    germplasmTypes: string[];
    storageCapacity: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    addressAr: string;
  };
}

export const seedCenters: SeedCenter[] = [
  // 1. Jazan — جازان
  {
    id: 'jazan-001',
    name: 'Jazan Agricultural Station',
    nameAr: 'محطة جازان',
    region: 'Jazan',
    city: 'Jazan',
    coordinates: { lat: 17.013889, lng: 42.663889 },
    established: '',
    area: '0.7 ha',
    staff: 1,
    crops: [
      { name: 'Summer Crops', nameAr: 'محاصيل صيفية', area: '', varieties: 19, plantingSeason: 'Summer' },
    ],
    activities: [
      { type: 'research', description: '3 agricultural experiments recorded', descriptionAr: '3 تجارب زراعية مسجلة' },
      { type: 'training', description: '6 field visits and workshops', descriptionAr: '6 زيارات وورش عمل' },
      { type: 'conservation', description: '19 horticultural varieties documented', descriptionAr: '19 صنفاً بستانياً موثقاً' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'جازان' },
  },

  // 2. Najran — نجران
  {
    id: 'najran-001',
    name: 'Najran Agricultural Station',
    nameAr: 'محطة نجران',
    region: 'Najran',
    city: 'Najran',
    coordinates: { lat: 17.550083, lng: 44.381944 },
    established: '',
    area: '5 ha',
    staff: 2,
    crops: [],
    activities: [
      { type: 'research', description: '3 agricultural experiments recorded', descriptionAr: '3 تجارب زراعية مسجلة' },
      { type: 'training', description: '4 field visits and workshops', descriptionAr: '4 زيارات وورش عمل' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'نجران' },
  },

  // 3. Al-Baha — الباحة
  {
    id: 'baha-001',
    name: 'Al-Baha Agricultural Station',
    nameAr: 'محطة الباحة',
    region: 'Al-Baha',
    city: 'Al-Baha',
    coordinates: { lat: 20.255972, lng: 41.651278 },
    established: '',
    area: '7.3 ha',
    staff: 9,
    crops: [
      { name: 'Summer Crops', nameAr: 'محاصيل صيفية', area: '', varieties: 0, plantingSeason: 'Summer' },
      { name: 'Winter Crops', nameAr: 'محاصيل شتوية', area: '', varieties: 0, plantingSeason: 'Winter' },
    ],
    activities: [
      { type: 'research', description: '3 agricultural experiments', descriptionAr: '3 تجارب زراعية' },
      { type: 'training', description: '3 field visits and workshops', descriptionAr: '3 زيارات وورش عمل' },
      { type: 'conservation', description: '75 horticultural varieties documented', descriptionAr: '75 صنفاً بستانياً موثقاً' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'الباحة' },
  },

  // 4. Al-Kharj — الخرج
  {
    id: 'kharj-001',
    name: 'Al-Kharj Agricultural Station',
    nameAr: 'محطة الخرج',
    region: 'Riyadh',
    city: 'Al-Kharj',
    coordinates: { lat: 24.203347, lng: 47.383219 },
    established: '',
    area: '8.9 ha',
    staff: 8,
    crops: [
      { name: 'Summer Crops', nameAr: 'محاصيل صيفية', area: '', varieties: 40, plantingSeason: 'Summer' },
      { name: 'Winter Crops', nameAr: 'محاصيل شتوية', area: '', varieties: 0, plantingSeason: 'Winter' },
    ],
    activities: [
      { type: 'research', description: '3 agricultural experiments', descriptionAr: '3 تجارب زراعية' },
      { type: 'distribution', description: '7,600 cuttings / seedlings produced', descriptionAr: 'إنتاج 7,600 عقلة وشتلة' },
      { type: 'training', description: '1 field visit and workshop', descriptionAr: 'زيارة وورشة عمل واحدة' },
    ],
    seedExchange: { distributed: 7600, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'الخرج' },
  },

  // 5. Madinah — المدينة المنورة
  {
    id: 'madinah-001',
    name: 'Madinah Agricultural Station',
    nameAr: 'محطة المدينة المنورة',
    region: 'Madinah',
    city: 'Madinah',
    coordinates: { lat: 24.5247, lng: 39.5692 }, // approximate city center
    established: '',
    area: '',
    staff: 3,
    crops: [
      { name: 'Summer Crops', nameAr: 'محاصيل صيفية', area: '', varieties: 9, plantingSeason: 'Summer' },
      { name: 'Winter Crops', nameAr: 'محاصيل شتوية', area: '', varieties: 0, plantingSeason: 'Winter' },
    ],
    activities: [
      { type: 'research', description: '4 agricultural experiments', descriptionAr: '4 تجارب زراعية' },
      { type: 'training', description: '4 field visits and workshops', descriptionAr: '4 زيارات وورش عمل' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'المدينة المنورة' },
  },

  // 6. Hail — حائل
  {
    id: 'hail-001',
    name: 'Hail Agricultural Station',
    nameAr: 'محطة حائل',
    region: 'Hail',
    city: 'Hail',
    coordinates: { lat: 27.894967, lng: 41.731258 },
    established: '',
    area: '100 ha',
    staff: 1,
    crops: [],
    activities: [
      { type: 'research', description: '2 agricultural experiments', descriptionAr: 'تجربتان زراعيتان' },
      { type: 'training', description: '1 field visit and workshop', descriptionAr: 'زيارة وورشة عمل واحدة' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'حائل' },
  },

  // 7. Al-Ahsa — الأحساء
  {
    id: 'ahsa-001',
    name: 'Al-Ahsa Agricultural Station',
    nameAr: 'محطة الأحساء',
    region: 'Eastern Province',
    city: 'Al-Ahsa',
    coordinates: { lat: 25.3011517, lng: 49.6223269 },
    established: '',
    area: '10 ha',
    staff: 12,
    crops: [
      { name: 'Summer Crops', nameAr: 'محاصيل صيفية', area: '', varieties: 58, plantingSeason: 'Summer' },
      { name: 'Winter Crops', nameAr: 'محاصيل شتوية', area: '', varieties: 0, plantingSeason: 'Winter' },
    ],
    activities: [
      { type: 'research', description: '4 agricultural experiments', descriptionAr: '4 تجارب زراعية' },
      { type: 'training', description: '8 field visits and workshops', descriptionAr: '8 زيارات وورش عمل' },
      { type: 'conservation', description: '58 horticultural varieties documented', descriptionAr: '58 صنفاً بستانياً موثقاً' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'الأحساء' },
  },

  // 8. Namas — النماص
  {
    id: 'namas-001',
    name: 'Namas Agricultural Station',
    nameAr: 'محطة النماص',
    region: 'Aseer',
    city: 'Namas',
    coordinates: { lat: 19.1167, lng: 42.15 },
    established: '',
    area: '3 ha',
    staff: 1,
    crops: [],
    activities: [
      { type: 'research', description: '2 agricultural experiments', descriptionAr: 'تجربتان زراعيتان' },
      { type: 'training', description: '3 field visits and workshops', descriptionAr: '3 زيارات وورش عمل' },
      { type: 'distribution', description: '32,330 nursery seedlings produced', descriptionAr: 'إنتاج 32,330 شتلة من المشاتل' },
    ],
    seedExchange: { distributed: 32330, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'النماص' },
  },

  // 9. Abha — أبها
  {
    id: 'abha-001',
    name: 'Abha Agricultural Station',
    nameAr: 'محطة أبها',
    region: 'Aseer',
    city: 'Abha',
    coordinates: { lat: 18.2413, lng: 42.591556 },
    established: '',
    area: '18 ha',
    staff: 0,
    crops: [
      { name: 'Winter Crops', nameAr: 'محاصيل شتوية', area: '', varieties: 65, plantingSeason: 'Winter' },
    ],
    activities: [
      { type: 'research', description: '5 agricultural experiments', descriptionAr: '5 تجارب زراعية' },
      { type: 'distribution', description: '52,000 cuttings / seedlings produced', descriptionAr: 'إنتاج 52,000 عقلة وشتلة' },
      { type: 'conservation', description: '65 horticultural varieties documented', descriptionAr: '65 صنفاً بستانياً موثقاً' },
    ],
    seedExchange: { distributed: 52000, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: '', addressAr: 'أبها' },
  },
];

// Helper functions
export function getCentersByRegion(region: string): SeedCenter[] {
  return seedCenters.filter(center => center.region === region);
}

export function getCenterById(id: string): SeedCenter | undefined {
  return seedCenters.find(center => center.id === id);
}

export function getAllRegions(): string[] {
  return Array.from(new Set(seedCenters.map(center => center.region)));
}

export function getCentersByCrop(cropName: string): SeedCenter[] {
  return seedCenters.filter(center =>
    center.crops.some(crop =>
      crop.name.toLowerCase().includes(cropName.toLowerCase())
    )
  );
}
