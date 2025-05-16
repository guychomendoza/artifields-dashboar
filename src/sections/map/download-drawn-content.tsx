import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useRef, useEffect, useCallback } from 'react';

export const DownloadDrawnContent = () => {
    const map = useMap();
    const buttonAdded = useRef(false);

    const downloadGeoJSON = useCallback(() => {
        const features: any[] = [];

        map.eachLayer((layer) => {
            // @ts-expect-error custom property to identify drawn lines
            if (layer instanceof L.Polyline && layer.options.type === 'drawn') {
                const coords = layer.getLatLngs();

                features.push({
                    type: 'Feature',
                    properties: {
                        strokeColor: layer.options.color || '#000000',
                        type: 'drawn',
                    },
                    geometry: {
                        type: 'LineString',
                        // @ts-expect-error leaflet typings
                        coordinates: coords.map((coord: L.LatLng) => [coord.lng, coord.lat]),
                    },
                });
            }
        });

        const combinedGeoJSON = {
            type: 'FeatureCollection',
            features,
        };

        // Create and trigger download
        const dataStr = JSON.stringify(combinedGeoJSON, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'user_drawings.geojson';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [map]);

    useEffect(() => {
        if (buttonAdded.current) return;

        const DownloadButton = L.Control.extend({
            options: {
                position: 'topleft',
            },
            onAdd: () => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', '', container);
                button.innerHTML = '✏️';
                button.href = '#';
                button.title = 'Download User Drawings';
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
        buttonAdded.current = true;
    }, [map, downloadGeoJSON]);

    return null;
};
