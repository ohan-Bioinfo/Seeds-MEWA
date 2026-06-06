import { SeedPassport, RegionStats, SAUDI_REGIONS } from '@/types/data';
import type { CropType } from '@/data/passportData';

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

  const n = name.toLowerCase().trim();

  if (['aseer', 'asir', 'abha', 'عسير', 'tanoum', 'beni malak', 'belasmar', 'belahmar', 'elmaween'].some(k => n.includes(k))) return 'Aseer';
  if (n.includes('baha') || n.includes('الباحة')) return 'Al-Baha';
  if (n.includes('najran') || n.includes('نجران')) return 'Najran';
  if (['riyadh', 'الرياض', 'dilam', 'tumair', 'tumayr', 'kharj', 'dawadmi', 'majm'].some(k => n.includes(k))) return 'Riyadh';
  if (['qaseem', 'qassim', 'القصيم', 'buraidah', 'unaiz', 'onaiz', 'unayz', 'bakariah', 'bidayei', 'qawara'].some(k => n.includes(k))) return 'Qaseem';
  if (n.includes('hail') || n.includes('حائل')) return 'Hail';
  if (['jazan', 'jizan', 'gizan', 'جازان', 'damad', 'sabya', 'sabia', 'baish'].some(k => n.includes(k))) return 'Jazan';
  if (n.includes('tabuk') || n.includes('تبوك')) return 'Tabuk';
  if (['hasa', 'ahsa', 'hofuf', 'dammam', 'qatif', 'eastern', 'الشرقية', 'الأحساء'].some(k => n.includes(k))) return 'Eastern';
  if (n.includes('taif') || n.includes('الطائف') || n.includes('mecca') || n.includes('makkah') || n.includes('saad')) return 'Taif';

  return '';
}

// All passport CSVs now share one canonical schema (see data-sources/convert_passports.py):
// accessionId, localName, genus, species, scientificName, source, arabicName, country, province, location
interface CropSource {
  cropType: CropType;
  csvPath: string;
  delimiter: 'comma' | 'tab';
}

const CROP_SOURCES: CropSource[] = [
  { cropType: 'breadWheat', csvPath: '/breadwheat_passport.csv', delimiter: 'comma' },
  { cropType: 'durumWheat', csvPath: '/durumwheat_passport.csv', delimiter: 'comma' },
  { cropType: 'coffee', csvPath: '/coffee_passport.csv', delimiter: 'comma' },
  { cropType: 'barley', csvPath: '/barley_passport.csv', delimiter: 'comma' },
  { cropType: 'fabaBean', csvPath: '/fababean_passport.csv', delimiter: 'comma' },
  { cropType: 'millet', csvPath: '/millet_passport.csv', delimiter: 'comma' },
  { cropType: 'papaya', csvPath: '/papaya_passport.csv', delimiter: 'comma' },
];

async function loadCropData(source: CropSource): Promise<SeedPassport[]> {
  const response = await fetch(source.csvPath);
  const text = await response.text();
  const lines = text.split('\n').filter(line => line.trim());

  return lines.slice(1).map((line, index) => {
    const f = parseCSVLine(line, source.delimiter === 'tab');
    return {
      id: `${source.cropType}-${index}`,
      accessionId: f[0] || '',
      localName: f[1] || '',
      genus: f[2] || '',
      species: f[3] || '',
      scientificName: f[4] || '',
      source: f[5] || '',
      arabicName: f[6] || '',
      country: f[7] || '',
      province: f[8] || '',
      location: normalizeRegionName(f[9] || ''),
      cropType: source.cropType,
    };
  });
}

export async function loadAllData(): Promise<SeedPassport[]> {
  const all = await Promise.all(CROP_SOURCES.map(loadCropData));
  return all.flat();
}

export function calculateRegionStats(data: SeedPassport[]): RegionStats[] {
  const stats = new Map<string, RegionStats>();

  SAUDI_REGIONS.forEach(region => {
    stats.set(region, { region, crops: {}, totalCount: 0 });
  });

  data.forEach(sample => {
    const region = sample.location || sample.province;
    if (!region) return;

    const stat = stats.get(region);
    if (stat) {
      stat.crops[sample.cropType] = (stat.crops[sample.cropType] || 0) + 1;
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
