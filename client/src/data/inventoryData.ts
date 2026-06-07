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

// Inventory grouped by the collection categories present in the workbook
// (النوع column / the per-category sheets). One entry per category.
// stockLevel = total measured seed weight (kg); counts/germination from sheet 'ALL'.
export const inventoryData: InventoryItem[] = [
  {
    id: 'cat-field',
    centerId: 'cat-field',
    centerName: 'محاصيل حقلية',
    cropType: 'محاصيل حقلية',
    variety: 'Poaceae / Fabaceae / Pedaliaceae — 2,200 accessions',
    accessionCount: 2200,
    stockLevel: 166.89,
    minThreshold: 80,
    maxCapacity: 250,
    germinationRate: 92,
    germinationHistory: [
      { year: '2016', pct: 46.0 },
      { year: '2017', pct: 79.5 },
      { year: '2018', pct: 86.4 },
      { year: '2019', pct: 93.1 },
      { year: '2020', pct: 53.8 },
    ],
    lastTested: '2024-11-19',
    harvestYear: 2024,
    storageLocation: 'بنك البذور الوطني — الرياض',
    status: 'optimal',
    distributionRequests: 4,
    pendingOrders: 2,
  },
  {
    id: 'cat-veg',
    centerId: 'cat-veg',
    centerName: 'خضروات',
    cropType: 'خضروات',
    variety: 'Cucurbitaceae / Apiaceae / Malvaceae — 408 accessions',
    accessionCount: 408,
    stockLevel: 40.93,
    minThreshold: 30,
    maxCapacity: 80,
    germinationRate: 58,
    germinationHistory: [
      { year: '2017', pct: 55.2 },
      { year: '2018', pct: 67.0 },
      { year: '2019', pct: 71.0 },
      { year: '2020', pct: 31.5 },
    ],
    lastTested: '2024-11-15',
    harvestYear: 2024,
    storageLocation: 'بنك البذور الوطني — الرياض',
    status: 'low',
    distributionRequests: 3,
    pendingOrders: 1,
  },
  {
    id: 'cat-hort',
    centerId: 'cat-hort',
    centerName: 'بستانية',
    cropType: 'بستانية',
    variety: 'Rubiaceae / Anacardiaceae / Rosaceae — 350 accessions',
    accessionCount: 350,
    stockLevel: 2.85,
    minThreshold: 8,
    maxCapacity: 30,
    germinationRate: 0,
    germinationHistory: [{ year: '2020', pct: 0.0 }],
    lastTested: '2024-11-01',
    harvestYear: 2024,
    storageLocation: 'بنك البذور الوطني — الرياض',
    status: 'critical',
    distributionRequests: 2,
    pendingOrders: 1,
  },
  {
    id: 'cat-wild',
    centerId: 'cat-wild',
    centerName: 'نباتات برية',
    cropType: 'نباتات برية',
    variety: 'Amaranthaceae / Asteraceae / Fabaceae — 301 accessions',
    accessionCount: 301,
    stockLevel: 4.54,
    minThreshold: 8,
    maxCapacity: 25,
    germinationRate: 39,
    germinationHistory: [
      { year: '2017', pct: 60.0 },
      { year: '2019', pct: 58.2 },
      { year: '2020', pct: 27.0 },
    ],
    lastTested: '2024-09-10',
    harvestYear: 2023,
    storageLocation: 'بنك البذور الوطني — الرياض',
    status: 'critical',
    distributionRequests: 0,
    pendingOrders: 0,
  },
  {
    id: 'cat-medicinal',
    centerId: 'cat-medicinal',
    centerName: 'نباتات طبية وعطرية',
    cropType: 'نباتات طبية وعطرية',
    variety: 'Brassicaceae / Apiaceae / Ranunculaceae — 82 accessions',
    accessionCount: 82,
    stockLevel: 6.35,
    minThreshold: 8,
    maxCapacity: 25,
    germinationRate: 46,
    germinationHistory: [
      { year: '2017', pct: 53.6 },
      { year: '2018', pct: 45.2 },
      { year: '2020', pct: 43.3 },
    ],
    lastTested: '2024-08-20',
    harvestYear: 2024,
    storageLocation: 'بنك البذور الوطني — الرياض',
    status: 'low',
    distributionRequests: 1,
    pendingOrders: 0,
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
