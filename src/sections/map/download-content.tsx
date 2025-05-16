import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useRef, useEffect, useCallback } from 'react';

export const DownloadContent = () => {
    const map = useMap();
    const buttonAdded = useRef(false); // Track if the button is added

    const downloadGeoJSON = useCallback(() => {
        const features: any[] = [];

        // Get all non-tile layers from the map
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                return; // Skip tile layers
            }

            try {
                if (layer instanceof L.Polyline) {
                    // Convert drawn polylines to GeoJSON feature
                    const coords = layer
                        .getLatLngs()
                        .map((latLng: any) =>
                            Array.isArray(latLng)
                                ? latLng.map((ll) => [ll.lng, ll.lat])
                                : [latLng.lng, latLng.lat]
                        );

                    features.push({
                        type: 'Feature',
                        properties: {
                            strokeColor: layer.options.color || '#000000',
                            type: 'drawn',
                        },
                        geometry: {
                            type: 'LineString',
                            coordinates: Array.isArray(coords[0][0]) ? coords[0] : coords,
                        },
                    });
                } else if ('feature' in layer) {
                    // Handle GeoJSON layers
                    features.push(layer.feature);
                } else if ('toGeoJSON' in layer) {
                    // Handle any other layers that can be converted to GeoJSON
                    // @ts-expect-error unknown method
                    const geojson = layer.toGeoJSON();
                    if (geojson.type === 'FeatureCollection') {
                        features.push(...geojson.features);
                    } else {
                        features.push(geojson);
                    }
                }
            } catch (error) {
                console.error('Error converting layer to GeoJSON:', error);
            }
        });

        const combinedGeoJSON = {
            type: 'FeatureCollection',
            features: features.filter((f) => f !== null && f !== undefined),
        };

        // Create and trigger download
        const dataStr = JSON.stringify(combinedGeoJSON, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'map_with_drawings.geojson';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [map]);

    useEffect(() => {
        if (buttonAdded.current) return; // Prevent adding the button multiple times

        const DownloadButton = L.Control.extend({
            options: {
                position: 'topleft',
            },
            onAdd: () => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', '', container);
                button.innerHTML = '⬇️';
                button.href = '#';
                button.title = 'Download GeoJSON';
                button.style.fontSize = '16px';
                button.style.textAlign = 'center';
                button.style.lineHeight = '30px';

                L.DomEvent.on(button, 'click', (e) => {
                    L.DomEvent.preventDefault(e);
                    downloadGeoJSON();
                });

                return container;
            },
        });

        new DownloadButton().addTo(map);
        buttonAdded.current = true; // Mark button as added
    }, [map, downloadGeoJSON]);

    return null;
};
