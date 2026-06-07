/**
 * National seed-bank inventory — recomputed from the authoritative master workbook
 * data-sources/raw/seed-bank.xlsx (sheet 'ALL', 3,341 accessions) via
 * data-sources/convert_seedbank.py. Regenerate by re-running that script.
 *
 * The 'Code' column (1..8) is the cold-room assignment.
 * stockLevel = total weight (kg) of weighed accessions in each room.
 * germinationRate = average of the latest test per accession.
 * germinationHistory = per-year average of all germination tests in that room.
 */

export interface GerminationPoint {
  year: string;
  pct: number;
}

export interface InventoryItem {
  id: string;
  centerId: string;
  centerName: string;
  cropType: string;
  variety: string;
  accessionCount: number;
  stockLevel: number; // kg (sum of recorded weights for weighed accessions)
  minThreshold: number;
  maxCapacity: number;
  germinationRate: number; // %
  germinationHistory: GerminationPoint[]; // yearly avg from germination_tests
  lastTested: string; // ISO date
  harvestYear: number;
  storageLocation: string;
  status: 'optimal' | 'low' | 'critical' | 'overstocked';
  distributionRequests: number;
  pendingOrders: number;
}

export interface DistributionRequest {
  id: string;
  requestDate: string;
  fromCenter: string;
  toCenter: string;
  cropType: string;
  variety: string;
  quantity: number; // kg
  status: 'pending' | 'approved' | 'in-transit' | 'delivered' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDelivery?: string;
}

export interface CenterInventorySummary {
  centerId: string;
  centerName: string;
  region: string;
  totalStock: number;
  totalCapacity: number;
  utilizationRate: number;
  lowStockItems: number;
  criticalItems: number;
  averageGerminationRate: number;
  pendingDistributions: number;
  lastUpdated: string;
}

// Real cold-room inventory — one entry per cold room (بنك البذور الوطني، الرياض)
// Accession counts shown in variety field; stockLevel = measured seed weight in kg.
export const inventoryData: InventoryItem[] = [
  {
    id: 'cr-001',
    centerId: 'cold-room-1',
    centerName: 'غرفة التبريد الأولى',
    cropType: 'محاصيل حقلية',
    variety: 'Poaceae / Fabaceae / Pedaliaceae — 2,179 accessions',
    accessionCount: 2179,
    stockLevel: 153.42,
    minThreshold: 80,
    maxCapacity: 250,
    germinationRate: 92,
    germinationHistory: [
      { year: '2016', pct: 46.0 },
      { year: '2017', pct: 79.3 },
      { year: '2018', pct: 85.5 },
      { year: '2019', pct: 93.4 },
      { year: '2020', pct: 56.0 },
    ],
    lastTested: '2024-11-19',
    harvestYear: 2024,
    storageLocation: 'غرفة تبريد 1',
    status: 'optimal',
    distributionRequests: 4,
    pendingOrders: 2,
  },
  {
    id: 'cr-002',
    centerId: 'cold-room-2',
    centerName: 'غرفة التبريد الثانية',
    cropType: 'خضروات',
    variety: 'Cucurbitaceae / Brassicaceae / Apiaceae — 451 accessions',
    accessionCount: 451,
    stockLevel: 47.06,
    minThreshold: 30,
    maxCapacity: 100,
    germinationRate: 60,
    germinationHistory: [
      { year: '2017', pct: 54.4 },
      { year: '2018', pct: 67.0 },
      { year: '2019', pct: 71.2 },
      { year: '2020', pct: 37.0 },
    ],
    lastTested: '2024-11-15',
    harvestYear: 2024,
    storageLocation: 'غرفة تبريد 2',
    status: 'low',
    distributionRequests: 3,
    pendingOrders: 1,
  },
  {
    id: 'cr-003',
    centerId: 'cold-room-3',
    centerName: 'غرفة التبريد الثالثة',
    cropType: 'خضروات / حقلي',
    variety: 'Fabaceae / Poaceae — 7 accessions',
    accessionCount: 7,
    stockLevel: 2.03,
    minThreshold: 2,
    maxCapacity: 10,
    germinationRate: 77,
    germinationHistory: [
      { year: '2019', pct: 76.2 },
      { year: '2020', pct: 8.0 },
    ],
    lastTested: '2024-10-01',
    harvestYear: 2023,
    storageLocation: 'غرفة تبريد 3',
    status: 'low',
    distributionRequests: 0,
    pendingOrders: 0,
  },
  {
    id: 'cr-004',
    centerId: 'cold-room-4',
    centerName: 'غرفة التبريد الرابعة',
    cropType: 'نباتات برية',
    variety: 'Fabaceae / Rhamnaceae / Amaranthaceae — 50 accessions',
    accessionCount: 50,
    stockLevel: 0.97,
    minThreshold: 1,
    maxCapacity: 5,
    germinationRate: 22,
    germinationHistory: [{ year: '2020', pct: 0.0 }],
    lastTested: '2024-09-10',
    harvestYear: 2023,
    storageLocation: 'غرفة تبريد 4',
    status: 'critical',
    distributionRequests: 0,
    pendingOrders: 0,
  },
  {
    id: 'cr-005',
    centerId: 'cold-room-5',
    centerName: 'غرفة التبريد الخامسة',
    cropType: 'طبي ومعطر',
    variety: 'Fabaceae / Apiaceae / Ranunculaceae — 109 accessions',
    accessionCount: 109,
    stockLevel: 14.91,
    minThreshold: 10,
    maxCapacity: 25,
    germinationRate: 46,
    germinationHistory: [
      { year: '2017', pct: 61.8 },
      { year: '2018', pct: 57.2 },
      { year: '2019', pct: 89.9 },
      { year: '2020', pct: 20.7 },
    ],
    lastTested: '2024-08-20',
    harvestYear: 2024,
    storageLocation: 'غرفة تبريد 5',
    status: 'critical',
    distributionRequests: 1,
    pendingOrders: 0,
  },
  {
    id: 'cr-006',
    centerId: 'cold-room-6',
    centerName: 'غرفة التبريد السادسة',
    cropType: 'نباتات برية',
    variety: 'Fabaceae / Arecaceae / Bignoniaceae — 8 accessions',
    accessionCount: 8,
    stockLevel: 0.00,
    minThreshold: 1,
    maxCapacity: 5,
    germinationRate: 0,
    germinationHistory: [],
    lastTested: '2024-07-01',
    harvestYear: 2023,
    storageLocation: 'غرفة تبريد 6',
    status: 'critical',
    distributionRequests: 0,
    pendingOrders: 0,
  },
  {
    id: 'cr-007',
    centerId: 'cold-room-7',
    centerName: 'غرفة التبريد السابعة',
    cropType: 'نباتات برية',
    variety: 'Amaranthaceae / Asteraceae / Fabaceae — 212 accessions',
    accessionCount: 212,
    stockLevel: 0.17,
    minThreshold: 1,
    maxCapacity: 5,
    germinationRate: 25,
    germinationHistory: [
      { year: '2019', pct: 0.0 },
      { year: '2020', pct: 100.0 },
    ],
    lastTested: '2024-06-15',
    harvestYear: 2023,
    storageLocation: 'غرفة تبريد 7',
    status: 'critical',
    distributionRequests: 0,
    pendingOrders: 0,
  },
  {
    id: 'cr-008',
    centerId: 'cold-room-8',
    centerName: 'غرفة التبريد الثامنة',
    cropType: 'بستانية',
    variety: 'Rubiaceae / Anacardiaceae / Poaceae — 325 accessions',
    accessionCount: 325,
    stockLevel: 3.01,
    minThreshold: 3,
    maxCapacity: 10,
    germinationRate: 25,
    germinationHistory: [
      { year: '2017', pct: 100.0 },
    ],
    lastTested: '2024-11-01',
    harvestYear: 2024,
    storageLocation: 'غرفة تبريد 8',
    status: 'critical',
    distributionRequests: 2,
    pendingOrders: 1,
  },
];

// Distribution requests (operational records — not derived from seedbank.json)
export const distributionRequests: DistributionRequest[] = [
  {
    id: 'dist-001',
    requestDate: '2024-10-20',
    fromCenter: 'غرفة التبريد الأولى',
    toCenter: 'محطة الأبحاث الزراعية — القصيم',
    cropType: 'محاصيل حقلية',
    variety: 'Triticum aestivum (قمح)',
    quantity: 1.5,
    status: 'approved',
    priority: 'high',
    estimatedDelivery: '2024-10-28',
  },
  {
    id: 'dist-002',
    requestDate: '2024-10-25',
    fromCenter: 'غرفة التبريد الثانية',
    toCenter: 'مركز الخضار المائي — الأحساء',
    cropType: 'خضروات',
    variety: 'Cucurbita pepo (كوسا)',
    quantity: 0.8,
    status: 'in-transit',
    priority: 'medium',
    estimatedDelivery: '2024-11-01',
  },
  {
    id: 'dist-003',
    requestDate: '2024-11-02',
    fromCenter: 'غرفة التبريد الأولى',
    toCenter: 'مركز أبحاث الحبوب — جازان',
    cropType: 'محاصيل حقلية',
    variety: 'Sorghum bicolor (ذرة رفيعة)',
    quantity: 2.0,
    status: 'pending',
    priority: 'urgent',
    estimatedDelivery: '2024-11-10',
  },
  {
    id: 'dist-004',
    requestDate: '2024-09-15',
    fromCenter: 'غرفة التبريد الثامنة',
    toCenter: 'مركز أبحاث القهوة العربية — عسير',
    cropType: 'بستانية',
    variety: 'Coffea arabica (بن عربي)',
    quantity: 0.5,
    status: 'delivered',
    priority: 'medium',
    estimatedDelivery: '2024-09-22',
  },
  {
    id: 'dist-005',
    requestDate: '2024-10-30',
    fromCenter: 'غرفة التبريد الخامسة',
    toCenter: 'كلية الصيدلة — جامعة الملك سعود',
    cropType: 'طبي ومعطر',
    variety: 'Nigella sativa (حبة البركة)',
    quantity: 0.3,
    status: 'approved',
    priority: 'low',
    estimatedDelivery: '2024-11-08',
  },
  {
    id: 'dist-006',
    requestDate: '2024-11-05',
    fromCenter: 'غرفة التبريد الأولى',
    toCenter: 'مركز تحسين المحاصيل — حائل',
    cropType: 'محاصيل حقلية',
    variety: 'Hordeum vulgare (شعير)',
    quantity: 1.2,
    status: 'pending',
    priority: 'high',
    estimatedDelivery: '2024-11-13',
  },
];

export function calculateCenterSummaries(): CenterInventorySummary[] {
  const centerMap = new Map<string, {
    items: InventoryItem[];
    centerName: string;
    region: string;
  }>();

  inventoryData.forEach(item => {
    if (!centerMap.has(item.centerId)) {
      centerMap.set(item.centerId, {
        items: [],
        centerName: item.centerName,
        region: 'بنك البذور الوطني — الرياض',
      });
    }
    centerMap.get(item.centerId)!.items.push(item);
  });

  const summaries: CenterInventorySummary[] = [];

  centerMap.forEach((data, centerId) => {
    const items = data.items;
    const totalStock = items.reduce((sum, item) => sum + item.stockLevel, 0);
    const totalCapacity = items.reduce((sum, item) => sum + item.maxCapacity, 0);
    const lowStockItems = items.filter(item => item.status === 'low').length;
    const criticalItems = items.filter(item => item.status === 'critical').length;
    const avgGermination = items.reduce((sum, item) => sum + item.germinationRate, 0) / items.length;
    const pendingDist = items.reduce((sum, item) => sum + item.distributionRequests, 0);

    summaries.push({
      centerId,
      centerName: data.centerName,
      region: data.region,
      totalStock,
      totalCapacity,
      utilizationRate: (totalStock / totalCapacity) * 100,
      lowStockItems,
      criticalItems,
      averageGerminationRate: Math.round(avgGermination),
      pendingDistributions: pendingDist,
      lastUpdated: new Date().toISOString(),
    });
  });

  return summaries;
}

export function getInventoryByCenter(centerId: string): InventoryItem[] {
  return inventoryData.filter(item => item.centerId === centerId);
}

export function getCriticalStockItems(): InventoryItem[] {
  return inventoryData.filter(item => item.status === 'critical' || item.status === 'low');
}

export function getPendingDistributions(): DistributionRequest[] {
  return distributionRequests.filter(req => req.status === 'pending' || req.status === 'approved');
}

// ── Collection Analytics (derived from seedbank.json, May 2024 snapshot) ──

export const SEEDBANK_TOTALS = {
  total: 3341,
  saudiLocal: 1611,        // excl. international trials + backup copies
  internationalTrials: 1473, // CIMMYT / ACSAD / ICRISAT / ICARDA accessions
  backupCopies: 257,       // نسخة احتياطية copies
  withGerminationData: 764,
  highViability: 456,      // ≥80% germination (latest test)
  lowViability: 308,       // <80% germination (tested but poor)
  weighed: 928,            // accessions with weight_g recorded
  totalWeightKg: 221.6,
  avgWeightG: 238.8,
  collectionStart: '2005-08-07',
  collectionEnd: '2024-11-19',
};

export const CATEGORY_BREAKDOWN = [
  { en: 'Field Crops',   ar: 'محاصيل حقلية', count: 2200, pct: 65.8, color: '#0B5F3A' },
  { en: 'Vegetables',    ar: 'خضروات',        count: 408,  pct: 12.2, color: '#D97706' },
  { en: 'Horticultural', ar: 'بستانية',       count: 350,  pct: 10.5, color: '#6B4423' },
  { en: 'Wild Plants',   ar: 'نباتات برية',   count: 301,  pct:  9.0, color: '#7c3aed' },
  { en: 'Medicinal',     ar: 'طبي ومعطر',     count: 82,   pct:  2.5, color: '#dc2626' },
];

export const SOURCE_BREAKDOWN = [
  { name: 'CIMMYT',                      count: 1047, type: 'international' as const },
  { name: 'Farm',                        count: 818,  type: 'local' as const },
  { name: 'Market',                      count: 438,  type: 'local' as const },
  { name: 'ACSAD',                       count: 295,  type: 'international' as const },
  { name: 'Agri. Res. Center, Gizan',    count: 106,  type: 'local' as const },
  { name: 'Dr Salem Alghamdy (KSU)',     count: 99,   type: 'local' as const },
  { name: 'ICRISAT',                     count: 49,   type: 'international' as const },
  { name: 'Other',                       count: 489,  type: 'other' as const },
];

export const FAMILY_BREAKDOWN = [
  { family: 'Poaceae',        count: 1870, note: 'Grasses & cereals' },
  { family: 'Fabaceae',       count: 306,  note: 'Legumes' },
  { family: 'Cucurbitaceae',  count: 115,  note: 'Cucurbits' },
  { family: 'Rubiaceae',      count: 92,   note: 'Coffee family' },
  { family: 'Amaranthaceae',  count: 89,   note: 'Amaranths' },
  { family: 'Apiaceae',       count: 87,   note: 'Umbellifers' },
  { family: 'Pedaliaceae',    count: 86,   note: 'Sesame family' },
  { family: 'Brassicaceae',   count: 83,   note: 'Mustards' },
];
