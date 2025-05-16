import { useState, useEffect, useCallback } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export function useMultiplePolygonMarkerManager() {
    const map = useMap();
    const drawing = useMapsLibrary('drawing');

    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
    const [polygonsCoordinates, setPolygonsCoordinates] = useState<google.maps.LatLngLiteral[][]>([]);
    const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);

    // Single marker tracking
    const [currentMarker, setCurrentMarker] = useState<google.maps.Marker | null>(null);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

    // Update coordinates when a polygon is edited
    const updatePolygonCoordinates = useCallback(() => {
        const newCoordinates = polygons.map(polygon => {
            const path = polygon.getPath();
            const coords: google.maps.LatLngLiteral[] = [];

            path.forEach((latLng: google.maps.LatLng) => {
                coords.push({
                    lat: latLng.lat(),
                    lng: latLng.lng(),
                });
            });

            return coords;
        });

        setPolygonsCoordinates(newCoordinates);
    }, [polygons]);

    // Set marker from external coordinates
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

    // Initialize the drawing manager
    useEffect(() => {
        if (!map || !drawing) return;

        const newDrawingManager = new drawing.DrawingManager({
            map,
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.MARKER,
                    google.maps.drawing.OverlayType.POLYGON
                ],
            },
            polygonOptions: {
                editable: false,
                draggable: false,
            },
            markerOptions: {
                draggable: true
            }
        });

        // Handle when a new overlay is drawn
        google.maps.event.addListener(newDrawingManager, 'overlaycomplete', (event: any) => {
            if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                const polygon = event.overlay as google.maps.Polygon;

                // Add the polygon to our tracking array
                setPolygons(prev => [...prev, polygon]);

                // Setup listeners for this polygon
                ['set_at', 'insert_at', 'remove_at'].forEach(eventName => {
                    google.maps.event.addListener(polygon.getPath(), eventName, updatePolygonCoordinates);
                });

                // Update all coordinates including the new polygon
                updatePolygonCoordinates();
            }
            else if (event.type === google.maps.drawing.OverlayType.MARKER) {
                const marker = event.overlay as google.maps.Marker;
                const position = marker.getPosition();

                // Remove existing marker if any
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

                // Add drag listener to update position
                google.maps.event.addListener(marker, 'dragend', () => {
                    const newPos = marker.getPosition();
                    if (newPos) {
                        setMarkerPosition({
                            lat: newPos.lat(),
                            lng: newPos.lng()
                        });
                    }
                });
            }

            // Switch back to hand tool after drawing
            newDrawingManager.setDrawingMode(null);
        });

        setDrawingManager(newDrawingManager);

        return () => {
            if (newDrawingManager) {
                newDrawingManager.setMap(null);
                google.maps.event.clearListeners(newDrawingManager, 'overlaycomplete');
            }

            // Clean up polygon listeners
            polygons.forEach(polygon => {
                ['set_at', 'insert_at', 'remove_at'].forEach(eventName => {
                    google.maps.event.clearListeners(polygon.getPath(), eventName);
                });
            });

            // Clean up marker
            if (currentMarker) {
                currentMarker.setMap(null);
                google.maps.event.clearInstanceListeners(currentMarker);
            }
        };
    }, [map, drawing, updatePolygonCoordinates, currentMarker, polygons]);

    // Update coordinates whenever polygons array changes
    useEffect(() => {
        if (polygons.length > 0) {
            updatePolygonCoordinates();
        }
    }, [polygons, updatePolygonCoordinates]);

    // Function to add multiple polygons from coordinates (array of arrays)
    const addMultiplePolygonsFromCoordinates = useCallback((allCoordinates: google.maps.LatLngLiteral[][]) => {
        if (!map) return;

        const newPolygons: google.maps.Polygon[] = [];

        allCoordinates.forEach(coordinates => {
            const newPolygon = new google.maps.Polygon({
                paths: coordinates,
                map,
                editable: true,
                draggable: true,
            });

            // Setup listeners for this polygon
            ['set_at', 'insert_at', 'remove_at'].forEach(eventName => {
                google.maps.event.addListener(newPolygon.getPath(), eventName, updatePolygonCoordinates);
            });

            newPolygons.push(newPolygon);
        });

        // Add all polygons to tracked polygons
        setPolygons(prev => [...prev,...newPolygons]);
    }, [map, updatePolygonCoordinates]);

    // Function to remove a polygon by index
    const removePolygon = useCallback((index: number) => {
        if (index < 0 || index >= polygons.length) return;

        // Remove from map
        polygons[index].setMap(null);

        // Clean up listeners
        ['set_at', 'insert_at', 'remove_at'].forEach(eventName => {
            google.maps.event.clearListeners(polygons[index].getPath(), eventName);
        });

        // Update state
        setPolygons(prev => prev.filter((_, i) => i !== index));
    }, [polygons]);

    // Function to clear all polygons
    const clearAllPolygons = useCallback(() => {
        polygons.forEach(polygon => {
            polygon.setMap(null);

            // Clean up listeners
            ['set_at', 'insert_at', 'remove_at'].forEach(eventName => {
                google.maps.event.clearListeners(polygon.getPath(), eventName);
            });
        });

        setPolygons([]);
        setPolygonsCoordinates([]);
    }, [polygons]);

    // Function to clear the marker
    const clearMarker = useCallback(() => {
        if (currentMarker) {
            currentMarker.setMap(null);
            google.maps.event.clearInstanceListeners(currentMarker);
            setCurrentMarker(null);
            setMarkerPosition(null);
        }
    }, [currentMarker]);

    return {
        drawingManager,
        polygons,
        polygonsCoordinates,
        markerPosition,
        currentMarker,
        setMarkerFromCoordinates,
        removePolygon,
        clearAllPolygons,
        clearMarker,
        addMultiplePolygonsFromCoordinates
    };
}