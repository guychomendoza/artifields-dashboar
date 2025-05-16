import type {Marker} from "@googlemaps/markerclusterer";
import type { SensorWithColor } from 'src/api-requests/type';

import { MarkerClusterer} from "@googlemaps/markerclusterer";
import {useMemo, useState, useEffect, useCallback} from "react";
import { useMap, Map as ReactGooleMaps } from '@vis.gl/react-google-maps';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import {AreaPolygons} from "./areas";
import { MarkerWithInfoWindow } from './marker-with-info';
import {ReactMap} from "../../layouts/components/react-map";

const transformSensorsToRanchAreas = (sensors: SensorWithColor[], userRanches: string[]) => {
    // Create a map to store unique ranches
    const ranchMap = new Map();

    sensors.forEach(sensor => {
        if (sensor.rancho && sensor.rancho.id && sensor.rancho.area && userRanches.includes(sensor.rancho.nombre || "")) {
            // Only process if we haven't seen this ranch before
            if (!ranchMap.has(sensor.rancho.id)) {
                try {
                    // Parse the area string to JSON
                    const areaData = JSON.parse(sensor.rancho.area);

                    // Check if the parsed data has the required structure
                    if (areaData.coordenadas && Array.isArray(areaData.coordenadas)) {
                        let boundaryPoints;

                        if (Array.isArray(areaData.coordenadas[0]) && Array.isArray(areaData.coordenadas[0][0]) && typeof areaData.coordenadas[0][0][0] === 'number') {
                            boundaryPoints = areaData.coordenadas.map((polygon: any) => polygon.map((coord: any) => ({ lat: coord[0], lng: coord[1] })));
                        } else if (Array.isArray(areaData.coordenadas[0]) && typeof areaData.coordenadas[0][0] === 'object') {
                            boundaryPoints = areaData.coordenadas.map((polygon: any) => polygon.map((coord: any) => ({ lat: coord.lat, lng: coord.lng })));
                        } else if (areaData.coordenadas.every((coord: any) => coord.lat && coord.lng)) {
                            boundaryPoints = areaData.coordenadas;
                        }

                        // Check if all elements in each polygon have lat and lng
                        if (Array.isArray(boundaryPoints[0]) ? boundaryPoints.every((polygon: any) => polygon.every((coord: any) => coord.lat && coord.lng)) : boundaryPoints.every((coord: any) => coord.lat && coord.lng)) {
                            // Create the ranch object
                            ranchMap.set(sensor.rancho.id, {
                                id: sensor.rancho.id,
                                name: sensor.rancho.nombre,
                                boundaryPoints,
                            });
                        }
                    }
                } catch (e) {
                    console.log(`Error parsing area for ranch ${sensor.rancho.id}:`, e);
                }
            }
        }
    });

    // Convert the map to an array
    return Array.from(ranchMap.values());
};


const ZoomButton = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();

    const handleZoomIn = () => {
        if (map) {
            map.panTo({ lat, lng });
            map.setZoom((map.getZoom() || 5) + 1);
        }
    };

    return (
        <IconButton
            onClick={handleZoomIn}
            sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 999,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
            }}
            size="large"
        >
            <Iconify icon="solar:magnifer-zoom-in-bold" />
        </IconButton>
    );
};

const MapContent = ({ sensors }: { sensors: SensorWithColor[] }) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});

    useEffect(() => {
        if (!map || !sensors.length) return;

        const bounds = new google.maps.LatLngBounds();

        sensors.forEach((sensor) => {
            if (sensor?.lat && sensor?.long) {
                bounds.extend({
                    lat: Number(sensor.lat),
                    lng: Number(sensor.long),
                });
            }
        });

        // Fit bounds with padding to ensure markers are visible
        map.fitBounds(bounds, 10);
    }, [map, sensors]);

    const clusterer = useMemo(() => {
        if (!map) return null;

        return new MarkerClusterer({map});
    }, [map]);

    useEffect(() => {
        if (!clusterer) return;

        clusterer.clearMarkers();
        clusterer.addMarkers(Object.values(markers));
    }, [clusterer, markers]);

    // tracks of markers currently on the map
    const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
        setMarkers(prevMarkers => {
            if ((marker && prevMarkers[key]) || (!marker && !prevMarkers[key]))
                return prevMarkers;

            if (marker) {
                return {...prevMarkers, [key]: marker};
            }
            const {[key]: _, ...newMarkers} = prevMarkers;

            return newMarkers;

        });
    }, []);

    return (
        <>
            {sensors.map((sensor) => (
                <MarkerWithInfoWindow
                    key={sensor.device_id}
                    setMarkerRef={setMarkerRef}
                    position={{
                        lat: Number(sensor.lat),
                        lng: Number(sensor.long),
                    }}
                    color={sensor.color}
                    name={sensor.nombre || "Sin nombre"}
                    deviceId={sensor.device_id}
                />
            ))}
        </>
    );
};

export const UserSensorsMap = ({ sensors, ranches }: { sensors: SensorWithColor[], ranches: string[] }) => {
    const [selectedArea, setSelectedArea] = useState<number | null>(null);
    if (!sensors.length) return null;

    // Filter sensors with valid latitude and longitude
    const validSensors = sensors.filter(
        (sensor) => sensor?.lat && sensor?.long
    );

    // Calculate the center only if there are valid sensors
    const lat = validSensors.length
        ? validSensors.reduce((acc, sensor) => acc + Number(sensor.lat), 0) /
          validSensors.length
        : 0;

    const long = validSensors.length
        ? validSensors.reduce((acc, sensor) => acc + Number(sensor.long), 0) /
          validSensors.length
        : 0;

    const ranchAreas = transformSensorsToRanchAreas(sensors, ranches);

    return (
        <Grid item xs={12} md={6}>
            <ReactMap>
                <Box
                    sx={{
                        position: 'relative',
                        height: {
                            xs: '600px',
                            md: '100%',
                        },
                    }}
                >
                    <ReactGooleMaps
                        streetViewControl={false}
                        defaultZoom={5}
                        defaultCenter={{
                            lat,
                            lng: long,
                        }}
                        mapTypeId="satellite"
                        gestureHandling="greedy"
                        mapTypeControl={false}
                        mapId="f1b7b1b3b1b3b1b3"
                        zoomControl={false}
                    >
                        <AreaPolygons
                            selectedArea={selectedArea}
                            setSelectedArea={setSelectedArea}
                            areas={ranchAreas}
                        />
                        <MapContent sensors={validSensors}/>
                    </ReactGooleMaps>
                    {/* <ZoomButton lat={lat} lng={long} /> */}
                </Box>
            </ReactMap>
        </Grid>
    );
};
