/**
 * All 28 sequenced crops from the SEEd Center genomics program.
 * - 8 crops have full passport data (regional breakdown, accession counts)
 * - 20 crops have genomics data only (WGS/GBS samples, no passport)
 *
 * Sources: data-sources/summarydata/SEEd_Data_Summary.json + data-sources/summarydata/SEEd_Passport_Summary.csv
 * Saudi Regions tracked: Jazan, Aseer, Al-Baha, Riyadh, Qaseem, Hail, Taif, Najran, Tabuk
 */

export type CropType =
  // ── 8 passport crops (GBS/WGS + full accession data) ──
  | "wheat" | "coffee" | "barley" | "fabaBean"
  | "millet" | "sorghum" | "sesame" | "mango"
  // ── 20 genomics-only crops (samples only, no passport) ──
  | "oat" | "okra" | "fig" | "pomegranate" | "asparagusBean"
  | "hotPepper" | "papaya" | "pumpkin" | "chickpea" | "peach"
  | "plum" | "grape" | "apricot" | "fenugreek" | "guar"
  | "guava" | "lemon" | "nemaGuard" | "quince" | "apricotArmeniaca";

export interface CropMeta {
  id: CropType;
  label: string;
  labelAr: string;
  scientificName: string;
  totalAccessions: number; // passport accessions (0 if no passport data)
  samples: number;         // genomic samples (fastq/estimated from SEEd_Data_Summary)
  hasPassport: boolean;    // true = regional breakdown available on map
  sequencingType: "GBS" | "WGS";
  color: string;
  icon: string;
}

export const CROP_META: Record<CropType, CropMeta> = {
  // ── Passport crops (8) ────────────────────────────────────────────────────
  wheat: {
    id: "wheat", label: "Wheat", labelAr: "القمح",
    scientificName: "Triticum aestivum",
    totalAccessions: 563, samples: 2912, hasPassport: true,
    sequencingType: "GBS", color: "#D4A574", icon: "🌾",
  },
  coffee: {
    id: "coffee", label: "Coffee", labelAr: "القهوة",
    scientificName: "Coffea arabica",
    totalAccessions: 77, samples: 172, hasPassport: true,
    sequencingType: "WGS", color: "#6B4423", icon: "☕",
  },
  barley: {
    id: "barley", label: "Barley", labelAr: "الشعير",
    scientificName: "Hordeum vulgare",
    totalAccessions: 93, samples: 182, hasPassport: true,
    sequencingType: "GBS", color: "#A0845C", icon: "🌿",
  },
  fabaBean: {
    id: "fabaBean", label: "Faba Bean", labelAr: "الفول",
    scientificName: "Vicia faba",
    totalAccessions: 22, samples: 42, hasPassport: true,
    sequencingType: "GBS", color: "#5D8A5E", icon: "🫘",
  },
  millet: {
    id: "millet", label: "Millet", labelAr: "الدخن",
    scientificName: "Pennisetum typhoideum",
    totalAccessions: 59, samples: 72, hasPassport: true,
    sequencingType: "WGS", color: "#C9A84C", icon: "🌾",
  },
  sorghum: {
    id: "sorghum", label: "Sorghum", labelAr: "الذرة الرفيعة",
    scientificName: "Sorghum bicolor",
    totalAccessions: 85, samples: 174, hasPassport: true,
    sequencingType: "WGS", color: "#C0392B", icon: "🌽",
  },
  sesame: {
    id: "sesame", label: "Sesame", labelAr: "السمسم",
    scientificName: "Sesamum indicum",
    totalAccessions: 62, samples: 62, hasPassport: true,
    sequencingType: "WGS", color: "#C9A020", icon: "🌱",
  },
  mango: {
    id: "mango", label: "Mango", labelAr: "المانجو",
    scientificName: "Mangifera indica",
    totalAccessions: 63, samples: 63, hasPassport: true,
    sequencingType: "WGS", color: "#F4A623", icon: "🥭",
  },

  // ── Genomics-only crops (20) ──────────────────────────────────────────────
  oat: {
    id: "oat", label: "Oat", labelAr: "الشوفان",
    scientificName: "Avena sativa",
    totalAccessions: 0, samples: 4, hasPassport: false,
    sequencingType: "GBS", color: "#9CAF88", icon: "🌾",
  },
  okra: {
    id: "okra", label: "Okra", labelAr: "البامية",
    scientificName: "Abelmoschus esculentus",
    totalAccessions: 0, samples: 38, hasPassport: false,
    sequencingType: "WGS", color: "#22863A", icon: "🫑",
  },
  fig: {
    id: "fig", label: "Fig", labelAr: "التين",
    scientificName: "Ficus carica",
    totalAccessions: 0, samples: 24, hasPassport: false,
    sequencingType: "WGS", color: "#8B4513", icon: "🌿",
  },
  pomegranate: {
    id: "pomegranate", label: "Pomegranate", labelAr: "الرمان",
    scientificName: "Punica granatum",
    totalAccessions: 0, samples: 16, hasPassport: false,
    sequencingType: "WGS", color: "#DC143C", icon: "🔴",
  },
  asparagusBean: {
    id: "asparagusBean", label: "Asparagus Bean", labelAr: "اللوبيا",
    scientificName: "Vigna unguiculata ssp.",
    totalAccessions: 0, samples: 14, hasPassport: false,
    sequencingType: "WGS", color: "#228B22", icon: "🫘",
  },
  hotPepper: {
    id: "hotPepper", label: "Hot Pepper", labelAr: "الفلفل الحار",
    scientificName: "Capsicum annuum",
    totalAccessions: 0, samples: 20, hasPassport: false,
    sequencingType: "WGS", color: "#FF4500", icon: "🌶️",
  },
  papaya: {
    id: "papaya", label: "Papaya", labelAr: "البابايا",
    scientificName: "Carica papaya",
    totalAccessions: 0, samples: 17, hasPassport: false,
    sequencingType: "WGS", color: "#FFA500", icon: "🍈",
  },
  pumpkin: {
    id: "pumpkin", label: "Pumpkin", labelAr: "القرع",
    scientificName: "Cucurbita spp.",
    totalAccessions: 0, samples: 10, hasPassport: false,
    sequencingType: "WGS", color: "#FF7518", icon: "🎃",
  },
  chickpea: {
    id: "chickpea", label: "Chickpea", labelAr: "الحمص",
    scientificName: "Cicer arietinum",
    totalAccessions: 0, samples: 10, hasPassport: false,
    sequencingType: "WGS", color: "#DEB887", icon: "🫘",
  },
  peach: {
    id: "peach", label: "Peach", labelAr: "الخوخ",
    scientificName: "Prunus persica",
    totalAccessions: 0, samples: 10, hasPassport: false,
    sequencingType: "WGS", color: "#FFAD60", icon: "🍑",
  },
  plum: {
    id: "plum", label: "Plum", labelAr: "البرقوق",
    scientificName: "Prunus domestica",
    totalAccessions: 0, samples: 8, hasPassport: false,
    sequencingType: "WGS", color: "#8B008B", icon: "🍇",
  },
  grape: {
    id: "grape", label: "Grape", labelAr: "العنب",
    scientificName: "Vitis vinifera",
    totalAccessions: 0, samples: 8, hasPassport: false,
    sequencingType: "WGS", color: "#722F37", icon: "🍇",
  },
  apricot: {
    id: "apricot", label: "Apricot", labelAr: "المشمش",
    scientificName: "Prunus armeniaca",
    totalAccessions: 0, samples: 8, hasPassport: false,
    sequencingType: "WGS", color: "#E07B39", icon: "🍑",
  },
  fenugreek: {
    id: "fenugreek", label: "Fenugreek", labelAr: "الحلبة",
    scientificName: "Trigonella foenum-graecum",
    totalAccessions: 0, samples: 2, hasPassport: false,
    sequencingType: "WGS", color: "#8B7355", icon: "🌿",
  },
  guar: {
    id: "guar", label: "Guar", labelAr: "الغوار",
    scientificName: "Cyamopsis tetragonoloba",
    totalAccessions: 0, samples: 4, hasPassport: false,
    sequencingType: "WGS", color: "#6B8E23", icon: "🌱",
  },
  guava: {
    id: "guava", label: "Guava", labelAr: "الجوافة",
    scientificName: "Psidium guajava",
    totalAccessions: 0, samples: 2, hasPassport: false,
    sequencingType: "WGS", color: "#9DC209", icon: "🍐",
  },
  lemon: {
    id: "lemon", label: "Lemon", labelAr: "الليمون",
    scientificName: "Citrus limon",
    totalAccessions: 0, samples: 2, hasPassport: false,
    sequencingType: "WGS", color: "#F5C518", icon: "🍋",
  },
  nemaGuard: {
    id: "nemaGuard", label: "NemaGuard", labelAr: "نيماغارد",
    scientificName: "Prunus persica (rootstock)",
    totalAccessions: 0, samples: 2, hasPassport: false,
    sequencingType: "WGS", color: "#708090", icon: "🌱",
  },
  quince: {
    id: "quince", label: "Quince", labelAr: "السفرجل",
    scientificName: "Cydonia oblonga",
    totalAccessions: 0, samples: 2, hasPassport: false,
    sequencingType: "WGS", color: "#D4B483", icon: "🍐",
  },
  apricotArmeniaca: {
    id: "apricotArmeniaca", label: "Apricot (armeniaca)", labelAr: "المشمش الأرميني",
    scientificName: "Prunus armeniaca var.",
    totalAccessions: 0, samples: 1, hasPassport: false,
    sequencingType: "WGS", color: "#CD853F", icon: "🍑",
  },
};

/**
 * Regional breakdown of accessions per crop.
 * Based on passport data from SEEd_Passport_Summary.csv and raw CSV parsing.
 * Only Saudi Arabian accessions are mapped to regions.
 * International accessions are not shown on the Saudi map.
 */
export interface RegionCropCounts {
  region: string;
  crops: Partial<Record<CropType, number>>;
  total: number;
}

// Ground-truth counts derived from actual passport CSV files and summary
export const REGION_CROP_DATA: RegionCropCounts[] = [
  {
    region: "Jazan",
    crops: {
      wheat: 1,
      coffee: 35,
      barley: 1,
      millet: 10,
      sorghum: 14,
      sesame: 10,
    },
    total: 71,
  },
  {
    region: "Aseer",
    crops: {
      wheat: 24, // "aseer" + "Aseer" entries
      coffee: 28,
      barley: 2,
      millet: 3,
      sesame: 1,
    },
    total: 58,
  },
  {
    region: "Al-Baha",
    crops: {
      wheat: 11,
      coffee: 12,
      barley: 2,
      millet: 10,
      sesame: 2,
    },
    total: 37,
  },
  {
    region: "Riyadh",
    crops: {
      wheat: 16, // Riyadh + Riyadh-Tumair + Riyadh-Al-Majm'a
      barley: 2,
      millet: 3,
      sorghum: 71, // Al-Kharj is in Riyadh region
      fabaBean: 4,
    },
    total: 96,
  },
  {
    region: "Taif",
    crops: {
      wheat: 31, // Mecca + Taif + Farm-Taif + taif entries
      barley: 3,
      millet: 4,
    },
    total: 38,
  },
  {
    region: "Qaseem",
    crops: {
      wheat: 10,
      barley: 7, // Buraidah, Unaizah, Al-Bakariah are in Qaseem
      millet: 4,
    },
    total: 21,
  },
  {
    region: "Najran",
    crops: {
      wheat: 13,
      barley: 1,
    },
    total: 14,
  },
  {
    region: "Hail",
    crops: {
      wheat: 1,
      barley: 2,
    },
    total: 3,
  },
  {
    region: "Tabuk",
    crops: {
      wheat: 4,
      barley: 2,
    },
    total: 6,
  },
];

/**
 * Get all crop types (including those without regional data like mango)
 */
export function getActiveCropTypes(): CropType[] {
  return Object.keys(CROP_META) as CropType[];
}

export function getPassportCropTypes(): CropType[] {
  return (Object.keys(CROP_META) as CropType[]).filter(k => CROP_META[k].hasPassport);
}

/**
 * Get regional stats for a specific set of selected crop types.
 * If no crops selected, returns all.
 */
export function getFilteredRegionData(
  selectedCrops: CropType[] = [],
): RegionCropCounts[] {
  if (selectedCrops.length === 0) return REGION_CROP_DATA;

  return REGION_CROP_DATA.map((r) => {
    const filteredCrops: Partial<Record<CropType, number>> = {};
    let total = 0;
    selectedCrops.forEach((crop) => {
      const count = r.crops[crop] || 0;
      if (count > 0) {
        filteredCrops[crop] = count;
        total += count;
      }
    });
    return { ...r, crops: filteredCrops, total };
  }).filter((r) => r.total > 0);
}

/**
 * Get total accessions per crop across all regions (Saudi only)
 */
export function getSaudiTotalsByCrop(): Partial<Record<CropType, number>> {
  const totals: Partial<Record<CropType, number>> = {};
  REGION_CROP_DATA.forEach((r) => {
    Object.entries(r.crops).forEach(([crop, count]) => {
      const c = crop as CropType;
      totals[c] = (totals[c] || 0) + (count || 0);
    });
  });
  return totals;
}

/**
 * Grand total passport accessions (including international)
 */
// Only sums the 8 passport crops (excludes 20 genomics-only crops)
export const TOTAL_PASSPORT_ACCESSIONS = Object.values(CROP_META)
  .filter(c => c.hasPassport)
  .reduce((sum, c) => sum + c.totalAccessions, 0); // 1024

export const TOTAL_GENOMIC_CROPS = Object.keys(CROP_META).length; // 28
