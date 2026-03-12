import { useState, useEffect } from "react";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapView } from "@/components/Map";
import { seedCenters, SeedCenter } from "@/data/seedCenters";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin, Phone, Mail, Wheat, Users } from "lucide-react";

interface SeedCenterMapProps {
  selectedRegion?: string;
  selectedCrop?: string;
  onCenterClick?: (center: SeedCenter) => void;
}

// Inner component: controls map view programmatically via useMap
function MapController({
  target,
}: {
  target: { center: [number, number]; zoom: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.setView(target.center, target.zoom);
    }
  }, [target, map]);
  return null;
}

function FitBounds({ centers }: { centers: SeedCenter[] }) {
  const map = useMap();
  useEffect(() => {
    if (centers.length === 0) return;
    const bounds = L.latLngBounds(
      centers.map(c => [c.coordinates.lat, c.coordinates.lng] as [number, number])
    );
    map.fitBounds(bounds, { maxZoom: 12, padding: [40, 40] });
  }, [centers, map]);
  return null;
}

export default function SeedCenterMap({
  selectedRegion,
  selectedCrop,
  onCenterClick,
}: SeedCenterMapProps) {
  const [selectedCenter, setSelectedCenter] = useState<SeedCenter | null>(null);
  const [mapTarget, setMapTarget] = useState<{
    center: [number, number];
    zoom: number;
  } | null>(null);
  const { t, language } = useLanguage();

  const filteredCenters = seedCenters.filter(center => {
    if (selectedRegion && center.region !== selectedRegion) return false;
    if (
      selectedCrop &&
      !center.crops.some(crop =>
        crop.name.toLowerCase().includes(selectedCrop.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const isFiltered = filteredCenters.length < seedCenters.length;

  return (
    <div className="relative">
      <MapView
        initialCenter={[23.8859, 45.0792]}
        initialZoom={6}
        className="w-full h-[500px] md:h-[600px] rounded-lg shadow-lg"
      >
        {isFiltered && !mapTarget && <FitBounds centers={filteredCenters} />}
        <MapController target={mapTarget} />

        {filteredCenters.map(center => (
          <CircleMarker
            key={center.id}
            center={[center.coordinates.lat, center.coordinates.lng]}
            radius={10}
            pathOptions={{
              fillColor: "#166534",
              fillOpacity: 0.9,
              color: "#ffffff",
              weight: 3,
            }}
            eventHandlers={{
              click: () => {
                setSelectedCenter(center);
                setMapTarget({
                  center: [center.coordinates.lat, center.coordinates.lng],
                  zoom: 10,
                });
                if (onCenterClick) onCenterClick(center);
              },
            }}
          >
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif" }}>
                <strong>
                  {language === "ar" ? center.nameAr : center.name}
                </strong>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {center.city}, {center.region}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapView>

      {/* Selected Center Info Card */}
      {selectedCenter && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 shadow-xl bg-white/95 backdrop-blur-sm z-[1000]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg text-primary">
                {language === "ar"
                  ? selectedCenter.nameAr
                  : selectedCenter.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {selectedCenter.city}, {selectedCenter.region}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCenter(null);
                setMapTarget(null);
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Wheat className="h-4 w-4 text-primary" />
              <span className="font-medium">{t("common.crops")}:</span>
              <span className="text-muted-foreground">
                {selectedCenter.crops
                  .map(c => (language === "ar" ? c.nameAr : c.name))
                  .join(", ")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">{t("common.staff")}:</span>
              <span className="text-muted-foreground">
                {selectedCenter.staff} {t("common.employees")}
              </span>
            </div>

            <div className="pt-2 border-t border-border space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Phone className="h-3 w-3" />
                <span>{selectedCenter.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="h-3 w-3" />
                <span>{selectedCenter.contact.email}</span>
              </div>
            </div>

            <Button
              className="w-full mt-2"
              size="sm"
              onClick={() => {
                if (onCenterClick) onCenterClick(selectedCenter);
              }}
            >
              {t("common.viewDetails")}
            </Button>
          </div>
        </Card>
      )}

      {/* Center Count Badge */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-[1000]">
        <span className="text-sm font-semibold text-primary">
          {filteredCenters.length} {t("common.centers")}
        </span>
      </div>
    </div>
  );
}
