/* Design Philosophy: Data-Driven Cartography with Agricultural Heritage
   Saudi Map: Interactive map showing seed distribution across ALL Saudi regions
   Uses Leaflet/OpenStreetMap with custom circle markers and detailed region popups
   Supports all 8 crops with passport data (wheat, coffee, barley, faba bean,
   millet, sorghum, sesame, mango)
*/

import { CircleMarker, Popup } from "react-leaflet";
import { MapView } from "@/components/Map";
import {
  RegionCropCounts,
  CropType,
  CROP_META,
  getActiveCropTypes,
} from "@/data/passportData";

interface SaudiMapProps {
  regionData: RegionCropCounts[];
  selectedCrops?: CropType[];
  onRegionClick?: (region: string) => void;
}

// Precise coordinates for each Saudi region used in the passport data
const REGION_COORDINATES: Record<string, [number, number]> = {
  Taif: [21.2703, 40.4158],
  Aseer: [18.2164, 42.5053],
  "Al-Baha": [20.0129, 41.4677],
  Najran: [17.4924, 44.1277],
  Riyadh: [24.7136, 46.6753],
  Qaseem: [26.3264, 43.975],
  Hail: [27.5219, 41.6901],
  Jazan: [16.8892, 42.5511],
  Tabuk: [28.3998, 36.5782],
};

// Calculate the dominant crop for color selection
function getDominantCrop(
  crops: Partial<Record<CropType, number>>,
): CropType | null {
  let maxCount = 0;
  let dominant: CropType | null = null;
  Object.entries(crops).forEach(([crop, count]) => {
    if ((count || 0) > maxCount) {
      maxCount = count || 0;
      dominant = crop as CropType;
    }
  });
  return dominant;
}

// Get a blended color when multiple crops are present
function getMarkerColor(crops: Partial<Record<CropType, number>>): string {
  const dominant = getDominantCrop(crops);
  if (!dominant) return "#4A5D3F";
  return CROP_META[dominant].color;
}

export default function SaudiMap({
  regionData,
  selectedCrops,
  onRegionClick,
}: SaudiMapProps) {
  const activeCrops =
    selectedCrops && selectedCrops.length > 0
      ? selectedCrops
      : getActiveCropTypes();

  return (
    <div className="h-full min-h-[300px] sm:min-h-[500px]">
        <MapView
          initialCenter={[22.5, 43.5]}
          initialZoom={6}
          className="h-full min-h-[300px] sm:min-h-[500px]"
        >
          {regionData.map((stat) => {
            const coords = REGION_COORDINATES[stat.region];
            if (!coords || stat.total === 0) return null;

            // Scale radius: min 10, max 40 based on total
            const radius = Math.max(Math.sqrt(stat.total) * 3, 10);
            const color = getMarkerColor(stat.crops);

            return (
              <CircleMarker
                key={stat.region}
                center={coords}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.75,
                  color: "#2D3F24",
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => onRegionClick?.(stat.region),
                }}
              >
                <Popup minWidth={200}>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      padding: "6px 2px",
                    }}
                  >
                    {/* Region header */}
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#2D3F24",
                        margin: "0 0 10px 0",
                        borderBottom: "2px solid #4A5D3F",
                        paddingBottom: "6px",
                      }}
                    >
                      📍 {stat.region}
                    </h3>

                    {/* Per-crop breakdown */}
                    <div style={{ fontSize: "12px" }}>
                      {activeCrops
                        .filter((crop) => (stat.crops[crop] || 0) > 0)
                        .map((crop) => {
                          const meta = CROP_META[crop];
                          const count = stat.crops[crop] || 0;
                          return (
                            <div
                              key={crop}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "4px 0",
                                gap: "12px",
                              }}
                            >
                              <span style={{ color: "#555" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: meta.color,
                                    marginRight: "5px",
                                    verticalAlign: "middle",
                                  }}
                                />
                                {meta.label}
                              </span>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: meta.color,
                                  minWidth: "24px",
                                  textAlign: "right",
                                }}
                              >
                                {count}
                              </span>
                            </div>
                          );
                        })}

                      {/* Total row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "8px 0 0 0",
                          paddingTop: "6px",
                          borderTop: "1px solid #ddd",
                          fontWeight: 700,
                          color: "#2D3F24",
                        }}
                      >
                        <span>📊 {stat.total}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapView>
    </div>
  );
}
