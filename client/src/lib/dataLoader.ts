import { SeedPassport, RegionStats, SAUDI_REGIONS } from '@/types/data';

function parseCSVLine(line: string, useTabs: boolean = true): string[] {
  if (useTabs) {
    return line.split('\t').map(field => field.trim());
  }
  // For comma-separated, handle quoted fields
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeRegionName(name: string): string {
  if (!name || name === 'NA' || name === 'Unknow' || name === '0') return '';
  
  // Normalize common variations
  const normalized = name.toLowerCase().trim();
  
  if (normalized.includes('aseer') || normalized.includes('abha') || normalized.includes('عسير')) return 'Aseer';
  if (normalized.includes('baha') || normalized.includes('الباحة')) return 'Al-Baha';
  if (normalized.includes('najran') || normalized.includes('نجران')) return 'Najran';
  if (normalized.includes('riyadh') || normalized.includes('الرياض')) return 'Riyadh';
  if (normalized.includes('qaseem') || normalized.includes('qassim') || normalized.includes('القصيم')) return 'Qaseem';
  if (normalized.includes('hail') || normalized.includes('حائل')) return 'Hail';
  if (normalized.includes('jazan') || normalized.includes('jizan') || normalized.includes('جازان')) return 'Jazan';
  if (normalized.includes('tabuk') || normalized.includes('تبوك')) return 'Tabuk';
  if (normalized.includes('taif') || normalized.includes('الطائف') || normalized.includes('mecca')) return 'Taif';
  
  return '';
}

export async function loadWheatData(): Promise<SeedPassport[]> {
  const response = await fetch('/wheatpassport.csv');
  const text = await response.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.slice(1).map((line, index) => {
    const fields = parseCSVLine(line);
    return {
      id: `wheat-${index}`,
      accessionId: fields[0] || '',
      localName: fields[1] || '',
      genus: fields[2] || '',
      species: fields[3] || '',
      scientificName: fields[4] || '',
      source: fields[5] || '',
      arabicName: fields[6] || '',
      country: fields[7] || '',
      province: fields[8] || '',
      location: normalizeRegionName(fields[9] || ''),
      cropType: 'wheat' as const
    };
  });
}

export async function loadCoffeeData(): Promise<SeedPassport[]> {
  const response = await fetch('/CoffeePassport(1).csv');
  const text = await response.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.slice(1).map((line, index) => {
    const fields = parseCSVLine(line, false); // Coffee CSV is comma-separated
    // Coffee CSV structure: Sr. No., Sent Code, Accession Bank ID, Genus, Species, ScientifiCName, Source, Local Names, Collection Country, Collection Site, Place of collection
    return {
      id: `coffee-${index}`,
      accessionId: fields[1] || '',
      localName: fields[7] || '',
      genus: fields[3] || '',
      species: fields[4] || '',
      scientificName: fields[5] || '',
      source: fields[6] || '',
      arabicName: fields[7] || '',
      country: fields[8] || '',
      province: normalizeRegionName(fields[9] || ''),
      location: normalizeRegionName(fields[10] || ''),
      cropType: 'coffee' as const
    };
  });
}

export async function loadAllData(): Promise<SeedPassport[]> {
  const [wheat, coffee] = await Promise.all([
    loadWheatData(),
    loadCoffeeData()
  ]);
  return [...wheat, ...coffee];
}

export function calculateRegionStats(data: SeedPassport[]): RegionStats[] {
  const stats = new Map<string, RegionStats>();
  
  // Initialize all Saudi regions
  SAUDI_REGIONS.forEach(region => {
    stats.set(region, {
      region,
      wheatCount: 0,
      coffeeCount: 0,
      totalCount: 0
    });
  });
  
  // Count samples by region
  data.forEach(sample => {
    const region = sample.location || sample.province;
    if (!region) return;
    
    const stat = stats.get(region);
    if (stat) {
      if (sample.cropType === 'wheat') {
        stat.wheatCount++;
      } else {
        stat.coffeeCount++;
      }
      stat.totalCount++;
    }
  });
  
  return Array.from(stats.values()).filter(s => s.totalCount > 0);
}

export function filterData(
  data: SeedPassport[],
  filters: { cropType: string[]; regions: string[]; searchTerm: string }
): SeedPassport[] {
  return data.filter(sample => {
    // Filter by crop type
    if (filters.cropType.length > 0 && !filters.cropType.includes(sample.cropType)) {
      return false;
    }
    
    // Filter by region
    if (filters.regions.length > 0) {
      const sampleRegion = sample.location || sample.province;
      if (!sampleRegion || !filters.regions.includes(sampleRegion)) {
        return false;
      }
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      return (
        sample.accessionId.toLowerCase().includes(term) ||
        sample.arabicName.toLowerCase().includes(term) ||
        sample.scientificName.toLowerCase().includes(term) ||
        sample.location.toLowerCase().includes(term) ||
        sample.province.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
}
