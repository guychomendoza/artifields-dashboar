import { useMap } from "@vis.gl/react-google-maps";
import { useState, useEffect, useCallback } from "react";

interface Coordinates {
    lat: number;
    lng: number;
}

interface RanchArea {
    id: number;
    name: string;
    boundaryPoints: Coordinates[];
}

interface AreaPolygonsProps {
    selectedArea: number | null;
    setSelectedArea: (id: number | null) => void;
    areas: RanchArea[];
}

export const AreaPolygons = ({ selectedArea, setSelectedArea, areas }: AreaPolygonsProps) => {
    const map = useMap();
    const [polygons, setPolygons] = useState<Map<number, google.maps.Polygon>>(new Map());

    const zoomToPolygon = useCallback((polygon: google.maps.Polygon) => {
        if (!map) return;

        const bounds = new google.maps.LatLngBounds();
        polygon.getPath().forEach((point) => {
            bounds.extend(point);
        });

        // Add a small timeout to ensure the map is ready
        setTimeout(() => {
            map.fitBounds(bounds);
        }, 100);
    }, [map]);

    // Create/destroy polygons when areas or map changes
    useEffect(() => {
        if (!map) return;

        const newPolygons = new Map<number, google.maps.Polygon>();

        areas.forEach(area => {
            const polygon = new google.maps.Polygon({
                paths: area.boundaryPoints,
                map,
                fillColor: selectedArea === area.id ? "#4285f4" : "#ff0000",
                fillOpacity: 0.35,
                strokeColor: selectedArea === area.id ? "#4285f4" : "#ff0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });

            polygon.addListener("click", () => {
                setSelectedArea(area.id);
                zoomToPolygon(polygon);
            });

            newPolygons.set(area.id, polygon);
        });

        setPolygons(newPolygons);

        return () => {
            newPolygons.forEach(polygon => {
                google.maps.event.clearInstanceListeners(polygon);
                polygon.setMap(null);
            });
        };
    }, [map, areas, zoomToPolygon, selectedArea, setSelectedArea]);

    // Update polygon colors when selection changes
    useEffect(() => {
        polygons.forEach((polygon, areaId) => {
            const isSelected = selectedArea === areaId;
            polygon.setOptions({
                fillColor: isSelected ? "#4285f4" : "#ff0000",
                strokeColor: isSelected ? "#4285f4" : "#ff0000",
            });
        });
    }, [selectedArea, polygons]);

    // Handle initial zoom to selected area
    useEffect(() => {
        if (selectedArea && polygons.has(selectedArea)) {
            const polygon = polygons.get(selectedArea);
            if (polygon) {
                zoomToPolygon(polygon);
            }
        }
    }, [selectedArea, polygons, zoomToPolygon]);

    return null;
};