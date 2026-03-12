export interface InventoryItem {
  id: string;
  centerId: string;
  centerName: string;
  cropType: string;
  variety: string;
  stockLevel: number; // in kg
  minThreshold: number; // minimum stock level in kg
  maxCapacity: number; // maximum storage capacity in kg
  germinationRate: number; // percentage
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
  quantity: number; // in kg
  status: 'pending' | 'approved' | 'in-transit' | 'delivered' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDelivery?: string;
}

export interface CenterInventorySummary {
  centerId: string;
  centerName: string;
  region: string;
  totalStock: number; // in kg
  totalCapacity: number;
  utilizationRate: number; // percentage
  lowStockItems: number;
  criticalItems: number;
  averageGerminationRate: number;
  pendingDistributions: number;
  lastUpdated: string;
}

// Generate realistic inventory data for all centers
export const inventoryData: InventoryItem[] = [
  // Riyadh - National Seed Bank
  {
    id: 'inv-001',
    centerId: 'riyadh-nsb',
    centerName: 'بنك البذور الوطني بالرياض',
    cropType: 'القمح',
    variety: 'Triticum aestivum cv. Najma',
    stockLevel: 3200,
    minThreshold: 1000,
    maxCapacity: 5000,
    germinationRate: 94,
    lastTested: '2026-02-15',
    harvestYear: 2025,
    storageLocation: 'Vault A-12',
    status: 'optimal',
    distributionRequests: 3,
    pendingOrders: 2
  },
  {
    id: 'inv-002',
    centerId: 'riyadh-nsb',
    centerName: 'بنك البذور الوطني بالرياض',
    cropType: 'الشعير',
    variety: 'Hordeum vulgare cv. Sahara',
    stockLevel: 850,
    minThreshold: 800,
    maxCapacity: 4000,
    germinationRate: 89,
    lastTested: '2026-02-10',
    harvestYear: 2025,
    storageLocation: 'Vault B-05',
    status: 'low',
    distributionRequests: 5,
    pendingOrders: 3
  },
  {
    id: 'inv-003',
    centerId: 'riyadh-nsb',
    centerName: 'بنك البذور الوطني بالرياض',
    cropType: 'الخضروات',
    variety: 'Solanum lycopersicum cv. Desert Red',
    stockLevel: 120,
    minThreshold: 150,
    maxCapacity: 500,
    germinationRate: 92,
    lastTested: '2026-02-18',
    harvestYear: 2025,
    storageLocation: 'Vault C-08',
    status: 'critical',
    distributionRequests: 8,
    pendingOrders: 5
  },
  
  // Taif - Agricultural Research Center
  {
    id: 'inv-004',
    centerId: 'taif-arc',
    centerName: 'مركز أبحاث الطائف الزراعي',
    cropType: 'القمح',
    variety: 'Triticum durum cv. Highland',
    stockLevel: 1850,
    minThreshold: 600,
    maxCapacity: 3000,
    germinationRate: 91,
    lastTested: '2026-02-12',
    harvestYear: 2025,
    storageLocation: 'Storage Unit 3',
    status: 'optimal',
    distributionRequests: 2,
    pendingOrders: 1
  },
  {
    id: 'inv-005',
    centerId: 'taif-arc',
    centerName: 'مركز أبحاث الطائف الزراعي',
    cropType: 'الرمان',
    variety: 'Punica granatum cv. Taifi',
    stockLevel: 280,
    minThreshold: 200,
    maxCapacity: 800,
    germinationRate: 78,
    lastTested: '2026-02-08',
    harvestYear: 2024,
    storageLocation: 'Storage Unit 7',
    status: 'optimal',
    distributionRequests: 4,
    pendingOrders: 2
  },
  
  // Aseer - Abha Highland Agriculture Center
  {
    id: 'inv-006',
    centerId: 'aseer-ahac',
    centerName: 'مركز أبها للزراعة المرتفعة',
    cropType: 'البن',
    variety: 'Coffea arabica cv. Khawlani',
    stockLevel: 420,
    minThreshold: 300,
    maxCapacity: 1200,
    germinationRate: 85,
    lastTested: '2026-02-20',
    harvestYear: 2025,
    storageLocation: 'Coffee Storage A',
    status: 'optimal',
    distributionRequests: 6,
    pendingOrders: 4
  },
  {
    id: 'inv-007',
    centerId: 'aseer-ahac',
    centerName: 'مركز أبها للزراعة المرتفعة',
    cropType: 'القمح',
    variety: 'Triticum aestivum cv. Mountain',
    stockLevel: 1650,
    minThreshold: 700,
    maxCapacity: 2500,
    germinationRate: 93,
    lastTested: '2026-02-14',
    harvestYear: 2025,
    storageLocation: 'Grain Silo 2',
    status: 'optimal',
    distributionRequests: 3,
    pendingOrders: 2
  },
  {
    id: 'inv-008',
    centerId: 'aseer-ahac',
    centerName: 'مركز أبها للزراعة المرتفعة',
    cropType: 'الفواكه',
    variety: 'Malus domestica cv. Aseer Apple',
    stockLevel: 95,
    minThreshold: 100,
    maxCapacity: 400,
    germinationRate: 82,
    lastTested: '2026-02-05',
    harvestYear: 2024,
    storageLocation: 'Cold Storage B',
    status: 'critical',
    distributionRequests: 7,
    pendingOrders: 4
  },
  
  // Jazan - Coffee Research Center
  {
    id: 'inv-009',
    centerId: 'jazan-crc',
    centerName: 'مركز أبحاث البن بجازان',
    cropType: 'البن',
    variety: 'Coffea arabica cv. Jazan Premium',
    stockLevel: 680,
    minThreshold: 400,
    maxCapacity: 1500,
    germinationRate: 88,
    lastTested: '2026-02-22',
    harvestYear: 2025,
    storageLocation: 'Premium Coffee Vault',
    status: 'optimal',
    distributionRequests: 9,
    pendingOrders: 6
  },
  {
    id: 'inv-010',
    centerId: 'jazan-crc',
    centerName: 'مركز أبحاث البن بجازان',
    cropType: 'التوابل',
    variety: 'Zingiber officinale cv. Tropical',
    stockLevel: 145,
    minThreshold: 120,
    maxCapacity: 600,
    germinationRate: 76,
    lastTested: '2026-02-11',
    harvestYear: 2025,
    storageLocation: 'Spice Storage 1',
    status: 'optimal',
    distributionRequests: 2,
    pendingOrders: 1
  },
  
  // Qaseem - Buraidah Agricultural Development
  {
    id: 'inv-011',
    centerId: 'qaseem-bad',
    centerName: 'مركز بريدة للتنمية الزراعية',
    cropType: 'القمح',
    variety: 'Triticum aestivum cv. Qaseem Gold',
    stockLevel: 2100,
    minThreshold: 800,
    maxCapacity: 3500,
    germinationRate: 95,
    lastTested: '2026-02-19',
    harvestYear: 2025,
    storageLocation: 'Main Silo A',
    status: 'optimal',
    distributionRequests: 4,
    pendingOrders: 3
  },
  {
    id: 'inv-012',
    centerId: 'qaseem-bad',
    centerName: 'مركز بريدة للتنمية الزراعية',
    cropType: 'التمور',
    variety: 'Phoenix dactylifera cv. Sukkari',
    stockLevel: 520,
    minThreshold: 300,
    maxCapacity: 1000,
    germinationRate: 81,
    lastTested: '2026-02-07',
    harvestYear: 2024,
    storageLocation: 'Date Palm Unit',
    status: 'optimal',
    distributionRequests: 5,
    pendingOrders: 3
  },
  {
    id: 'inv-013',
    centerId: 'qaseem-bad',
    centerName: 'مركز بريدة للتنمية الزراعية',
    cropType: 'الخضروات',
    variety: 'Cucumis sativus cv. Desert Green',
    stockLevel: 75,
    minThreshold: 100,
    maxCapacity: 350,
    germinationRate: 87,
    lastTested: '2026-02-16',
    harvestYear: 2025,
    storageLocation: 'Vegetable Storage',
    status: 'critical',
    distributionRequests: 6,
    pendingOrders: 4
  },
  
  // Al-Baha - Mountain Agriculture Center
  {
    id: 'inv-014',
    centerId: 'albaha-mac',
    centerName: 'مركز الباحة للزراعة الجبلية',
    cropType: 'البن',
    variety: 'Coffea arabica cv. Baha Mountain',
    stockLevel: 310,
    minThreshold: 250,
    maxCapacity: 900,
    germinationRate: 84,
    lastTested: '2026-02-13',
    harvestYear: 2025,
    storageLocation: 'Mountain Coffee Store',
    status: 'optimal',
    distributionRequests: 3,
    pendingOrders: 2
  },
  {
    id: 'inv-015',
    centerId: 'albaha-mac',
    centerName: 'مركز الباحة للزراعة الجبلية',
    cropType: 'نباتات العسل',
    variety: 'Acacia spp. Honey Flora',
    stockLevel: 180,
    minThreshold: 150,
    maxCapacity: 500,
    germinationRate: 79,
    lastTested: '2026-02-09',
    harvestYear: 2025,
    storageLocation: 'Flora Storage B',
    status: 'optimal',
    distributionRequests: 2,
    pendingOrders: 1
  },
  
  // Hail - Northern Agriculture Center
  {
    id: 'inv-016',
    centerId: 'hail-nac',
    centerName: 'مركز حائل للزراعة الشمالية',
    cropType: 'القمح',
    variety: 'Triticum aestivum cv. Northern Star',
    stockLevel: 1420,
    minThreshold: 600,
    maxCapacity: 2800,
    germinationRate: 92,
    lastTested: '2026-02-17',
    harvestYear: 2025,
    storageLocation: 'North Silo 1',
    status: 'optimal',
    distributionRequests: 3,
    pendingOrders: 2
  },
  {
    id: 'inv-017',
    centerId: 'hail-nac',
    centerName: 'مركز حائل للزراعة الشمالية',
    cropType: 'الزيتون',
    variety: 'Olea europaea cv. Hail Green',
    stockLevel: 240,
    minThreshold: 180,
    maxCapacity: 700,
    germinationRate: 77,
    lastTested: '2026-02-06',
    harvestYear: 2024,
    storageLocation: 'Olive Storage',
    status: 'optimal',
    distributionRequests: 4,
    pendingOrders: 2
  },
  
  // Najran - Desert Agriculture Research
  {
    id: 'inv-018',
    centerId: 'najran-dar',
    centerName: 'محطة نجران لأبحاث الزراعة الصحراوية',
    cropType: 'التمور',
    variety: 'Phoenix dactylifera cv. Najran Premium',
    stockLevel: 450,
    minThreshold: 300,
    maxCapacity: 1100,
    germinationRate: 83,
    lastTested: '2026-02-21',
    harvestYear: 2025,
    storageLocation: 'Desert Date Storage',
    status: 'optimal',
    distributionRequests: 5,
    pendingOrders: 3
  },
  {
    id: 'inv-019',
    centerId: 'najran-dar',
    centerName: 'محطة نجران لأبحاث الزراعة الصحراوية',
    cropType: 'الأعلاف',
    variety: 'Medicago sativa cv. Desert Hardy',
    stockLevel: 580,
    minThreshold: 400,
    maxCapacity: 1500,
    germinationRate: 90,
    lastTested: '2026-02-14',
    harvestYear: 2025,
    storageLocation: 'Fodder Warehouse',
    status: 'optimal',
    distributionRequests: 2,
    pendingOrders: 1
  },
  
  // Tabuk - Northwestern Agriculture Center
  {
    id: 'inv-020',
    centerId: 'tabuk-nwac',
    centerName: 'مركز تبوك للزراعة الشمالية الغربية',
    cropType: 'القمح',
    variety: 'Triticum aestivum cv. Tabuk Elite',
    stockLevel: 1280,
    minThreshold: 700,
    maxCapacity: 2600,
    germinationRate: 94,
    lastTested: '2026-02-18',
    harvestYear: 2025,
    storageLocation: 'Northwest Silo',
    status: 'optimal',
    distributionRequests: 3,
    pendingOrders: 2
  },
  {
    id: 'inv-021',
    centerId: 'tabuk-nwac',
    centerName: 'مركز تبوك للزراعة الشمالية الغربية',
    cropType: 'الفواكه',
    variety: 'Prunus persica cv. Tabuk Peach',
    stockLevel: 165,
    minThreshold: 150,
    maxCapacity: 550,
    germinationRate: 80,
    lastTested: '2026-02-10',
    harvestYear: 2025,
    storageLocation: 'Fruit Cold Storage',
    status: 'low',
    distributionRequests: 4,
    pendingOrders: 3
  }
];

// Distribution requests data
export const distributionRequests: DistributionRequest[] = [
  {
    id: 'dist-001',
    requestDate: '2026-02-20',
    fromCenter: 'بنك البذور الوطني بالرياض',
    toCenter: 'مركز أبها للزراعة المرتفعة',
    cropType: 'القمح',
    variety: 'Triticum aestivum cv. Najma',
    quantity: 250,
    status: 'approved',
    priority: 'high',
    estimatedDelivery: '2026-02-26'
  },
  {
    id: 'dist-002',
    requestDate: '2026-02-22',
    fromCenter: 'مركز أبحاث البن بجازان',
    toCenter: 'مركز الباحة للزراعة الجبلية',
    cropType: 'البن',
    variety: 'Coffea arabica cv. Jazan Premium',
    quantity: 150,
    status: 'in-transit',
    priority: 'medium',
    estimatedDelivery: '2026-02-25'
  },
  {
    id: 'dist-003',
    requestDate: '2026-02-23',
    fromCenter: 'بنك البذور الوطني بالرياض',
    toCenter: 'مركز بريدة للتنمية الزراعية',
    cropType: 'الخضروات',
    variety: 'Solanum lycopersicum cv. Desert Red',
    quantity: 80,
    status: 'pending',
    priority: 'urgent',
    estimatedDelivery: '2026-02-27'
  },
  {
    id: 'dist-004',
    requestDate: '2026-02-21',
    fromCenter: 'مركز بريدة للتنمية الزراعية',
    toCenter: 'مركز حائل للزراعة الشمالية',
    cropType: 'القمح',
    variety: 'Triticum aestivum cv. Qaseem Gold',
    quantity: 300,
    status: 'delivered',
    priority: 'medium',
    estimatedDelivery: '2026-02-24'
  },
  {
    id: 'dist-005',
    requestDate: '2026-02-19',
    fromCenter: 'مركز أبها للزراعة المرتفعة',
    toCenter: 'مركز أبحاث الطائف الزراعي',
    cropType: 'الفواكه',
    variety: 'Malus domestica cv. Aseer Apple',
    quantity: 50,
    status: 'approved',
    priority: 'low',
    estimatedDelivery: '2026-02-28'
  },
  {
    id: 'dist-006',
    requestDate: '2026-02-23',
    fromCenter: 'محطة نجران لأبحاث الزراعة الصحراوية',
    toCenter: 'بنك البذور الوطني بالرياض',
    cropType: 'التمور',
    variety: 'Phoenix dactylifera cv. Najran Premium',
    quantity: 200,
    status: 'pending',
    priority: 'high',
    estimatedDelivery: '2026-02-27'
  }
];

// Calculate center inventory summaries
export function calculateCenterSummaries(): CenterInventorySummary[] {
  const centerMap = new Map<string, {
    items: InventoryItem[];
    centerName: string;
    region: string;
  }>();
  
  // Group inventory items by center
  inventoryData.forEach(item => {
    if (!centerMap.has(item.centerId)) {
      centerMap.set(item.centerId, {
        items: [],
        centerName: item.centerName,
        region: '' // Will be filled from seedCenters data
      });
    }
    centerMap.get(item.centerId)!.items.push(item);
  });
  
  // Calculate summaries
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
      region: data.region || 'Unknown',
      totalStock,
      totalCapacity,
      utilizationRate: (totalStock / totalCapacity) * 100,
      lowStockItems,
      criticalItems,
      averageGerminationRate: Math.round(avgGermination),
      pendingDistributions: pendingDist,
      lastUpdated: new Date().toISOString()
    });
  });
  
  return summaries;
}

// Get inventory items by center
export function getInventoryByCenter(centerId: string): InventoryItem[] {
  return inventoryData.filter(item => item.centerId === centerId);
}

// Get critical stock items across all centers
export function getCriticalStockItems(): InventoryItem[] {
  return inventoryData.filter(item => item.status === 'critical' || item.status === 'low');
}

// Get pending distribution requests
export function getPendingDistributions(): DistributionRequest[] {
  return distributionRequests.filter(req => req.status === 'pending' || req.status === 'approved');
}
