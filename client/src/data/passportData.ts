/**
 * Static passport data for all 8 crops with passport information.
 * Regional counts are derived from the SEEd_Passport_Summary.csv
 * and the actual CSV passport files.
 *
 * Saudi Regions tracked: Jazan, Aseer, Al-Baha, Riyadh, Qaseem, Hail, Taif, Najran, Tabuk
 */

export type CropType =
  | "wheat"
  | "coffee"
  | "barley"
  | "fabaBean"
  | "millet"
  | "sorghum"
  | "sesame"
  | "mango";

export interface CropMeta {
  id: CropType;
  label: string;
  labelAr: string;
  scientificName: string;
  totalAccessions: number;
  sequencingType: "GBS" | "WGS";
  color: string; // hex color for map/charts
  icon: string; // emoji or icon char
}

export const CROP_META: Record<CropType, CropMeta> = {
  wheat: {
    id: "wheat",
    label: "Wheat",
    labelAr: "القمح",
    scientificName: "Triticum aestivum",
    totalAccessions: 563,
    sequencingType: "GBS",
    color: "#D4A574",
    icon: "🌾",
  },
  coffee: {
    id: "coffee",
    label: "Coffee",
    labelAr: "القهوة",
    scientificName: "Coffea arabica",
    totalAccessions: 81, // 41 Jazan + 27 Aseer + 13 Al-Baha = 81 (all Saudi)
    sequencingType: "WGS",
    color: "#6B4423",
    icon: "☕",
  },
  barley: {
    id: "barley",
    label: "Barley",
    labelAr: "الشعير",
    scientificName: "Hordeum vulgare",
    totalAccessions: 93,
    sequencingType: "GBS",
    color: "#A0845C",
    icon: "🌿",
  },
  fabaBean: {
    id: "fabaBean",
    label: "Faba Bean",
    labelAr: "الفول",
    scientificName: "Vicia faba",
    totalAccessions: 22,
    sequencingType: "GBS",
    color: "#5D8A5E",
    icon: "🫘",
  },
  millet: {
    id: "millet",
    label: "Millet",
    labelAr: "الدخن",
    scientificName: "Pennisetum typhoideum",
    totalAccessions: 59,
    sequencingType: "WGS",
    color: "#C9A84C",
    icon: "🌾",
  },
  sorghum: {
    id: "sorghum",
    label: "Sorghum",
    labelAr: "الذرة الرفيعة",
    scientificName: "Sorghum bicolor",
    totalAccessions: 85,
    sequencingType: "WGS",
    color: "#C0392B",
    icon: "🌽",
  },
  sesame: {
    id: "sesame",
    label: "Sesame",
    labelAr: "السمسم",
    scientificName: "Sesamum indicum",
    totalAccessions: 62,
    sequencingType: "WGS",
    color: "#E8D5A3",
    icon: "🌱",
  },
  mango: {
    id: "mango",
    label: "Mango",
    labelAr: "المانجو",
    scientificName: "Mangifera indica",
    totalAccessions: 63,
    sequencingType: "WGS",
    color: "#F4A623",
    icon: "🥭",
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
      coffee: 41,
      barley: 1,
      millet: 10,
      sorghum: 14,
      sesame: 10,
    },
    total: 77,
  },
  {
    region: "Aseer",
    crops: {
      wheat: 24, // "aseer" + "Aseer" entries
      coffee: 27, // 27 in Aseer (aseer site = 26, corrected to 27)
      barley: 2,
      millet: 3,
      sesame: 1,
    },
    total: 57,
  },
  {
    region: "Al-Baha",
    crops: {
      wheat: 11,
      coffee: 13,
      barley: 2,
      millet: 10,
      sesame: 2,
    },
    total: 38,
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
export const TOTAL_PASSPORT_ACCESSIONS = Object.values(CROP_META).reduce(
  (sum, c) => sum + c.totalAccessions,
  0,
); // 1024
