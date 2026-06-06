/**
 * Seed stations — administrative data from data-sources/Stations_Report.xlsx
 * (تقرير المحطات), merged with agronomic data from فهرس_المحطات.json.
 *
 * 10 stations. Manager, phone, total/utilized area, staff, equipment, needs,
 * and visits come from the stations report (authoritative). Crops, activities,
 * and seed-exchange figures retained from the agronomic source.
 * Garbled coordinates in the report (Najran, Al-Kharj) are replaced with the
 * known-valid ones. Fields with no data in the source are left blank / zero.
 */

export interface StationStats {
  experiments: number;
  equipment: number; // المعدات
  achievements: number;
  horticulturalVarieties: number;
  winterPlantings: number;
  summerPlantings: number;
  nurserySeedlings: number;
  cuttings: number;
  visits: number; // الزيارات
  needs: number; // الاحتياجات — outstanding equipment / resource requests
}

export interface SeedCenter {
  id: string;
  name: string;
  nameAr: string;
  region: string;
  city: string;
  manager: string; // مدير المحطة (transliterated)
  managerAr: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  established: string;
  area: string; // total area (المساحة الإجمالية)
  utilizedArea: string; // المساحة المستغلة
  staff: number; // الكادر
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
  stats: StationStats;
}

export const seedCenters: SeedCenter[] = [
  // 1. Jazan — جازان (أبو عريش)
  {
    id: 'jazan-001',
    name: 'Jazan Agricultural Station',
    nameAr: 'محطة جازان',
    region: 'Jazan',
    city: 'Abu Arish',
    manager: 'Tariq Mohammed Ta’noon',
    managerAr: 'طارق محمد طعنون',
    coordinates: { lat: 17.013889, lng: 42.663889 },
    established: '',
    area: '1.0 ha',
    utilizedArea: '0.5 ha',
    staff: 0,
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
    contact: { phone: '0546368087', email: '', address: 'Jazan – Abu Arish', addressAr: 'جازان - أبو عريش' },
    stats: { experiments: 3, equipment: 0, achievements: 6, horticulturalVarieties: 19, winterPlantings: 0, summerPlantings: 277, nurserySeedlings: 0, cuttings: 0, visits: 0, needs: 0 },
  },

  // 2. Najran — نجران
  {
    id: 'najran-001',
    name: 'Najran Agricultural Station',
    nameAr: 'محطة نجران',
    region: 'Najran',
    city: 'Najran',
    manager: '',
    managerAr: '',
    coordinates: { lat: 17.550083, lng: 44.381944 }, // report value (150°N,250°E) invalid — kept valid coords
    established: '',
    area: '5.0 ha',
    utilizedArea: '3.0 ha',
    staff: 7,
    crops: [],
    activities: [
      { type: 'research', description: '3 agricultural experiments recorded', descriptionAr: '3 تجارب زراعية مسجلة' },
      { type: 'training', description: '6 field visits and workshops', descriptionAr: '6 زيارات وورش عمل' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: 'Najran', addressAr: 'نجران' },
    stats: { experiments: 3, equipment: 7, achievements: 9, horticulturalVarieties: 0, winterPlantings: 0, summerPlantings: 0, nurserySeedlings: 0, cuttings: 0, visits: 6, needs: 2 },
  },

  // 3. Al-Baha — الباحة
  {
    id: 'baha-001',
    name: 'Al-Baha Agricultural Station',
    nameAr: 'محطة الباحة',
    region: 'Al-Baha',
    city: 'Al-Baha',
    manager: 'Mohammed Abdullah Al-Ghamdi',
    managerAr: 'محمد عبدالله الغامدي',
    coordinates: { lat: 20.255972, lng: 41.651278 },
    established: '',
    area: '73.0 ha',
    utilizedArea: '',
    staff: 10,
    crops: [
      { name: 'Summer Crops', nameAr: 'محاصيل صيفية', area: '', varieties: 0, plantingSeason: 'Summer' },
      { name: 'Winter Crops', nameAr: 'محاصيل شتوية', area: '', varieties: 0, plantingSeason: 'Winter' },
    ],
    activities: [
      { type: 'research', description: '3 agricultural experiments', descriptionAr: '3 تجارب زراعية' },
      { type: 'training', description: '4 field visits and workshops', descriptionAr: '4 زيارات وورش عمل' },
      { type: 'conservation', description: '75 horticultural varieties documented', descriptionAr: '75 صنفاً بستانياً موثقاً' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '0591777362', email: '', address: 'Al-Baha', addressAr: 'الباحة' },
    stats: { experiments: 3, equipment: 8, achievements: 9, horticulturalVarieties: 75, winterPlantings: 47, summerPlantings: 185, nurserySeedlings: 0, cuttings: 0, visits: 4, needs: 17 },
  },

  // 4. Al-Kharj — الخرج (Riyadh region)
  {
    id: 'kharj-001',
    name: 'Al-Kharj Agricultural Station',
    nameAr: 'محطة الخرج',
    region: 'Riyadh',
    city: 'Al-Kharj',
    manager: 'Khalid Omar Al-Mutawwa',
    managerAr: 'خالد عمر المطوع',
    coordinates: { lat: 24.203347, lng: 47.383219 }, // report DMS 24°12'16"N 47°23'00"E → decimal
    established: '',
    area: '8.0 ha',
    utilizedArea: '2.0 ha',
    staff: 13,
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
    contact: { phone: '0555109943', email: '', address: 'Al-Kharj', addressAr: 'الخرج' },
    stats: { experiments: 3, equipment: 7, achievements: 10, horticulturalVarieties: 40, winterPlantings: 120, summerPlantings: 224, nurserySeedlings: 0, cuttings: 7600, visits: 1, needs: 19 },
  },

  // 5. Madinah — المدينة المنورة
  {
    id: 'madinah-001',
    name: 'Madinah Agricultural Station',
    nameAr: 'محطة المدينة المنورة',
    region: 'Madinah',
    city: 'Madinah',
    manager: 'Khalid Al-Qahtani',
    managerAr: 'خالد القحطاني',
    coordinates: { lat: 24.5247, lng: 39.5692 }, // approximate city center
    established: '',
    area: '4.3 ha',
    utilizedArea: '3.2 ha',
    staff: 9,
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
    contact: { phone: '0564574855', email: '', address: 'Madinah', addressAr: 'المدينة المنورة' },
    stats: { experiments: 4, equipment: 9, achievements: 0, horticulturalVarieties: 9, winterPlantings: 32, summerPlantings: 134, nurserySeedlings: 0, cuttings: 0, visits: 4, needs: 8 },
  },

  // 6. Hail — حائل (منطقة القاعد)
  {
    id: 'hail-001',
    name: 'Hail Agricultural Station',
    nameAr: 'محطة حائل',
    region: 'Hail',
    city: 'Hail',
    manager: 'Mangal Awad Al-Shammari',
    managerAr: 'منقل عواد الشمري',
    coordinates: { lat: 27.894967, lng: 41.731258 },
    established: '',
    area: '100 ha',
    utilizedArea: '47.3 ha',
    staff: 13,
    crops: [],
    activities: [
      { type: 'research', description: '2 agricultural experiments', descriptionAr: 'تجربتان زراعيتان' },
      { type: 'training', description: '1 field visit and workshop', descriptionAr: 'زيارة وورشة عمل واحدة' },
    ],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '0508286364', email: '', address: 'Hail – Al-Qa’id', addressAr: 'حائل - منطقة القاعد' },
    stats: { experiments: 2, equipment: 7, achievements: 0, horticulturalVarieties: 0, winterPlantings: 0, summerPlantings: 0, nurserySeedlings: 0, cuttings: 0, visits: 2, needs: 10 },
  },

  // 7. Al-Ahsa — الأحساء
  {
    id: 'ahsa-001',
    name: 'Al-Ahsa Agricultural Station',
    nameAr: 'محطة الأحساء',
    region: 'Eastern Province',
    city: 'Al-Ahsa',
    manager: '',
    managerAr: '',
    coordinates: { lat: 25.3011517, lng: 49.6223269 },
    established: '',
    area: '10 ha',
    utilizedArea: '0.5 ha',
    staff: 11,
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
    contact: { phone: '', email: '', address: 'Al-Ahsa', addressAr: 'الأحساء' },
    stats: { experiments: 4, equipment: 5, achievements: 11, horticulturalVarieties: 58, winterPlantings: 36, summerPlantings: 146, nurserySeedlings: 0, cuttings: 0, visits: 10, needs: 19 },
  },

  // 8. Namas — النماص
  {
    id: 'namas-001',
    name: 'Namas Agricultural Station',
    nameAr: 'محطة النماص',
    region: 'Aseer',
    city: 'Namas',
    manager: '',
    managerAr: '',
    coordinates: { lat: 19.1167, lng: 42.15 },
    established: '',
    area: '32 ha',
    utilizedArea: '20.5 ha',
    staff: 11,
    crops: [],
    activities: [
      { type: 'research', description: '2 agricultural experiments', descriptionAr: 'تجربتان زراعيتان' },
      { type: 'training', description: '3 field visits and workshops', descriptionAr: '3 زيارات وورش عمل' },
      { type: 'distribution', description: '32,330 nursery seedlings produced', descriptionAr: 'إنتاج 32,330 شتلة من المشاتل' },
    ],
    seedExchange: { distributed: 32330, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: 'Namas', addressAr: 'النماص' },
    stats: { experiments: 2, equipment: 7, achievements: 10, horticulturalVarieties: 0, winterPlantings: 0, summerPlantings: 0, nurserySeedlings: 32330, cuttings: 0, visits: 2, needs: 5 },
  },

  // 9. Abha — أبها
  {
    id: 'abha-001',
    name: 'Abha Agricultural Station',
    nameAr: 'محطة أبها',
    region: 'Aseer',
    city: 'Abha',
    manager: 'Manahi Mohammed Al-Shahrani',
    managerAr: 'مناحي محمد الشهراني',
    coordinates: { lat: 18.2413, lng: 42.591556 },
    established: '',
    area: '18 ha',
    utilizedArea: '1.4 ha',
    staff: 12,
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
    contact: { phone: '0502040308', email: '', address: 'Abha', addressAr: 'أبها' },
    stats: { experiments: 5, equipment: 7, achievements: 10, horticulturalVarieties: 65, winterPlantings: 35, summerPlantings: 0, nurserySeedlings: 0, cuttings: 52000, visits: 1, needs: 1 },
  },

  // 10. Riyadh — الرياض (reported, no operational data yet)
  {
    id: 'riyadh-001',
    name: 'Riyadh Agricultural Station',
    nameAr: 'محطة الرياض',
    region: 'Riyadh',
    city: 'Riyadh',
    manager: '',
    managerAr: '',
    coordinates: { lat: 24.71, lng: 46.67 },
    established: '',
    area: '',
    utilizedArea: '',
    staff: 0,
    crops: [],
    activities: [],
    seedExchange: { distributed: 0, received: 0, partners: [] },
    tracking: { accessionsStored: 0, germplasmTypes: [], storageCapacity: '' },
    contact: { phone: '', email: '', address: 'Riyadh', addressAr: 'الرياض' },
    stats: { experiments: 0, equipment: 0, achievements: 0, horticulturalVarieties: 0, winterPlantings: 0, summerPlantings: 0, nurserySeedlings: 0, cuttings: 0, visits: 0, needs: 0 },
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
