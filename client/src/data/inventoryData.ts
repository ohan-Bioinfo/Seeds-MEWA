/**
 * Inventory data derived from the Saudi Seed Bank cold-storage workbook
 * (غرف التبريد1 سعد+5-2024.xlsx, May 2024), converted via seedbank-dataset/seedbank.json.
 *
 * 3,341 accessions stored in 8 cold rooms.
 * stockLevel = total weight (kg) of weighed accessions in each room.
 * germinationRate = average of latest test per accession (rooms with no tests: estimated).
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
    germinationRate: 93,
    germinationHistory: [
      { year: '2016', pct: 74.7 },
      { year: '2017', pct: 88.0 },
      { year: '2018', pct: 68.2 },
      { year: '2019', pct: 94.7 },
      { year: '2020', pct: 69.0 },
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
    germinationRate: 63,
    germinationHistory: [
      { year: '2016', pct: 47.9 },
      { year: '2017', pct: 75.0 },
      { year: '2018', pct: 73.7 },
      { year: '2019', pct: 66.4 },
      { year: '2020', pct: 46.6 },
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
      { year: '2018', pct: 5.0 },
      { year: '2019', pct: 100.0 },
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
    germinationRate: 23,
    germinationHistory: [{ year: '2020', pct: 22.5 }],
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
    germinationRate: 44,
    germinationHistory: [
      { year: '2016', pct: 60.3 },
      { year: '2017', pct: 74.2 },
      { year: '2018', pct: 18.4 },
      { year: '2019', pct: 89.9 },
      { year: '2020', pct: 24.0 },
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
    stockLevel: 0.08,
    minThreshold: 1,
    maxCapacity: 5,
    germinationRate: 25,
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
    germinationRate: 50,
    germinationHistory: [
      { year: '2016', pct: 100.0 },
      { year: '2020', pct: 0.0 },
    ],
    lastTested: '2024-11-01',
    harvestYear: 2024,
    storageLocation: 'غرفة تبريد 8',
    status: 'low',
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
