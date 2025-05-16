import { useMap, InfoWindow } from '@vis.gl/react-google-maps';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SensorCustomMarker } from './ranch-map-marker';
import { getSensorColor } from '../../../utils/sensors';

import type { ClusterSensor, ClustersAndSensors } from '../../../api-requests/ranches/schema';

type RanchesMapContentProps = {
    clustersAndSensors: ClustersAndSensors;
};

export const RanchesMapContent = ({ clustersAndSensors }: RanchesMapContentProps) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const [selectedSensor, setSelectedSensor] = useState<number | null>(null);
    const areaPolygonsRef = useRef<google.maps.Polygon[]>([]); // Use useRef to store polygons

    const allSensors = useMemo(() => {
        if (!clustersAndSensors) return [];

        const sensorsList: ClusterSensor[] = [];

        clustersAndSensors.forEach((item) => {
            if (item.sensor15?.info) {
                sensorsList.push(item.sensor15);
            }

            if (item.sensor30?.info) {
                sensorsList.push(item.sensor30);
            }
        });

        return sensorsList;
    }, [clustersAndSensors]);

    useEffect(() => {
        if (!map || !clustersAndSensors?.length) return;

        const bounds = new google.maps.LatLngBounds();

        // Add cluster boundaries to the bounds
        clustersAndSensors.forEach((item) => {
            // Add cluster center point if available
            if (item.cluster.lat && item.cluster.lng) {
                bounds.extend({
                    lat: item.cluster.lat,
                    lng: item.cluster.lng,
                });
            }

            // Add all points of the cluster area to the bounds
            if (item.cluster.area?.coordinates?.length) {
                item.cluster.area.coordinates.forEach((coord) => {
                    bounds.extend(coord);
                });
            }
        });

        // Add sensor locations to the bounds
        allSensors.forEach((sensor) => {
            if (sensor?.info?.lat && sensor?.info.lng) {
                bounds.extend({
                    lat: sensor.info.lat,
                    lng: sensor.info.lng,
                });
            }
        });

        // Only fit bounds if we've added points (bounds is not empty)
        if (!bounds.isEmpty()) {
            // Fit bounds with padding to ensure markers are visible
            map.fitBounds(bounds, 50);
        }
    }, [map, clustersAndSensors, allSensors]);

    const clusterer = useMemo(() => {
        if (!map) return null;

        return new MarkerClusterer({ map });
    }, [map]);

    useEffect(() => {
        if (!clusterer) return;

        clusterer.clearMarkers();
        clusterer.addMarkers(Object.values(markers));
    }, [clusterer, markers]);

    const renderAreas = useCallback(
        (currMap: google.maps.Map | null, clusterData: ClustersAndSensors) => {
            if (!currMap || !clusterData || !clusterData.length) return [];

            return clusterData
                .map((item) => {
                    if (!item.cluster.area || !item.cluster.area.coordinates) return null;

                    // Determine polygon color based on sensor availability
                    const hasSensor = item.sensor15?.info || item.sensor30?.info;

                    // More visible colors - stronger green and more visible gray
                    const polygonStrokeColor = hasSensor ? '#0D8A2A' : '#535353';
                    const polygonFillColor = hasSensor ? '#4ADE80' : '#B0B0B0';

                    const polygon = new google.maps.Polygon({
                        paths: item.cluster.area.coordinates,
                        strokeColor: polygonStrokeColor,
                        strokeOpacity: 0.9,
                        strokeWeight: 2.5,
                        fillColor: polygonFillColor,
                        fillOpacity: 0.4,
                        map: currMap,
                    });

                    polygon.addListener('click', () => {
                        const bounds = new google.maps.LatLngBounds();
                        item?.cluster?.area?.coordinates.forEach((coord) => {
                            bounds.extend(coord);
                        });
                        currMap?.fitBounds(bounds, 50);
                    });

                    return polygon;
                })
                .filter(Boolean) as google.maps.Polygon[];
        },
        []
    );

    useEffect(() => {
        if (!map || !clustersAndSensors) return;

        // Clear previous polygons
        areaPolygonsRef.current.forEach((polygonArea) => polygonArea.setMap(null));
        areaPolygonsRef.current = [];

        // Render polygons using the clustersAndAreas data
        areaPolygonsRef.current = renderAreas(map, clustersAndSensors);

        return () => {
            areaPolygonsRef.current.forEach((polygonArea) => polygonArea.setMap(null));
        };
    }, [map, clustersAndSensors, renderAreas]);

    // tracks of markers currently on the map
    const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
        setMarkers((prevMarkers) => {
            if ((marker && prevMarkers[key]) || (!marker && !prevMarkers[key])) return prevMarkers;

            if (marker) {
                return { ...prevMarkers, [key]: marker };
            }
            const { [key]: _, ...newMarkers } = prevMarkers;

            return newMarkers;
        });
    }, []);

    const handleInfoWindowClose = useCallback(() => {
        setSelectedSensor(null);
    }, []);

    const handleMarkerClick = useCallback((sensor: ClusterSensor) => {
        if (!sensor?.info?.id) return;
        setSelectedSensor(sensor.info.id);
    }, []);

    return (
        <>
            {allSensors.map((sensor) => {
                if (!sensor?.info?.id || !sensor?.info?.lng || !sensor?.info?.lat) return null;

                const color = getSensorColor({
                    idealCapacity: sensor.info.idalCapacity,
                    bottomLimit: sensor.info.bottomLimit,
                    topLimit: sensor.info.topLimit,
                    soilMoisture: sensor?.lastMeasurement?.soilMoisture || null,
                });

                return (
                    <div key={sensor.info.id}>
                        <SensorCustomMarker
                            sensor={sensor}
                            onClick={handleMarkerClick}
                            setMarkerRef={setMarkerRef}
                            color={color}
                        />

                        {selectedSensor === sensor.info.id && (
                            <InfoWindow
                                position={{ lat: sensor.info.lat, lng: sensor.info.lng }}
                                onCloseClick={handleInfoWindowClose}
                            >
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body1" gutterBottom>
                                        {sensor.info.name || sensor.info.deviceId}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Humedad del suelo:{' '}
                                        {sensor?.lastMeasurement?.soilMoisture !== null
                                            ? `${sensor?.lastMeasurement?.soilMoisture}%`
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                            </InfoWindow>
                        )}
                    </div>
                );
            })}
        </>
    );
};
