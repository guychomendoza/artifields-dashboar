import { useState, useEffect, useCallback } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export function useDrawingManager(initialValue: google.maps.drawing.DrawingManager | null = null) {
    const map = useMap();
    const drawing = useMapsLibrary('drawing');

    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(
        initialValue
    );
    const [currentMarker, setCurrentMarker] = useState<google.maps.Marker | null>(null);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [polygonCoordinates, setPolygonCoordinates] = useState<google.maps.LatLngLiteral[]>([]);
    const [currentPolygon, setCurrentPolygon] = useState<google.maps.Polygon | null>(null);

    const updatePolygonCoordinates = useCallback((polygon: google.maps.Polygon) => {
        const path = polygon.getPath();
        const coordinates: google.maps.LatLngLiteral[] = [];

        path.forEach((latLng: google.maps.LatLng) => {
            coordinates.push({
                lat: latLng.lat(),
                lng: latLng.lng(),
            });
        });

        setPolygonCoordinates(coordinates);
    }, []);

    // Function to set marker from external coordinates
    const setMarkerFromCoordinates = useCallback((position: google.maps.LatLngLiteral) => {
        if (!map) return;

        // Remove existing marker if any
        if (currentMarker) {
            currentMarker.setMap(null);
        }

        // Create new marker
        const newMarker = new google.maps.Marker({
            position,
            map
        });

        setCurrentMarker(newMarker);
        setMarkerPosition(position);
    }, [map, currentMarker]);

    // Function to set polygon from external coordinates
    const setPolygonFromCoordinates = useCallback((coordinates: google.maps.LatLngLiteral[]) => {
        if (!map) return;

        // Remove existing polygon if any
        if (currentPolygon) {
            currentPolygon.setMap(null);
        }

        // Create new polygon
        const newPolygon = new google.maps.Polygon({
            paths: coordinates,
            map,
            editable: true,
            draggable: true,
        });

        // Add listeners for polygon editing
        google.maps.event.addListener(newPolygon.getPath(), 'set_at', () => {
            updatePolygonCoordinates(newPolygon);
        });
        google.maps.event.addListener(newPolygon.getPath(), 'insert_at', () => {
            updatePolygonCoordinates(newPolygon);
        });
        google.maps.event.addListener(newPolygon.getPath(), 'remove_at', () => {
            updatePolygonCoordinates(newPolygon);
        });

        setCurrentPolygon(newPolygon);
        setPolygonCoordinates(coordinates);
    }, [map, currentPolygon, updatePolygonCoordinates]);

    useEffect(() => {
        if (!map || !drawing) return;

        const newDrawingManager = new drawing.DrawingManager({
            map,
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.MARKER,
                    google.maps.drawing.OverlayType.POLYGON
                ],
            },
            polygonOptions: {
                editable: true,
                draggable: true,
            },
        });

        const handleOverlayComplete = (event: google.maps.drawing.OverlayCompleteEvent) => {
            if (event.type === google.maps.drawing.OverlayType.MARKER) {
                const marker = event.overlay as google.maps.Marker;
                const position = marker.getPosition();

                // Remove only the previous marker
                if (currentMarker) {
                    currentMarker.setMap(null);
                }

                if (position) {
                    const newPosition = {
                        lat: position.lat(),
                        lng: position.lng(),
                    };
                    setMarkerPosition(newPosition);
                }

                setCurrentMarker(marker);
            }
            else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                const polygon = event.overlay as google.maps.Polygon;

                // Remove only the previous polygon
                if (currentPolygon) {
                    currentPolygon.setMap(null);
                }

                setCurrentPolygon(polygon);
                updatePolygonCoordinates(polygon);

                // Add listeners for polygon editing
                google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
                    updatePolygonCoordinates(polygon);
                });
                google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
                    updatePolygonCoordinates(polygon);
                });
                google.maps.event.addListener(polygon.getPath(), 'remove_at', () => {
                    updatePolygonCoordinates(polygon);
                });
            }
            // Set drawing mode to null after any shape is complete
            newDrawingManager.setDrawingMode(null);
        };

        google.maps.event.addListener(newDrawingManager, 'overlaycomplete', handleOverlayComplete);
        setDrawingManager(newDrawingManager);

        return () => {
            newDrawingManager.setMap(null);
            google.maps.event.clearListeners(newDrawingManager, 'overlaycomplete');
        };
    }, [map, drawing, currentMarker, currentPolygon, updatePolygonCoordinates]);

    return {
        drawingManager,
        markerPosition,
        polygonCoordinates,
        currentMarker,
        currentPolygon,
        setMarkerFromCoordinates,
        setPolygonFromCoordinates
    };
}