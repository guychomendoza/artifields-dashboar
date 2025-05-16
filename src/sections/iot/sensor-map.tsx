import type { SensorInfo } from 'src/api-requests/type';

import { useState, useEffect } from 'react';
import { Map, useMap, APIProvider } from '@vis.gl/react-google-maps';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { useSensor } from 'src/store/sensor';
import { getSensorInfo } from 'src/api-requests/iot';

import { Iconify } from 'src/components/iconify';

import { PulsingMarker } from './pulsing-marker';

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

export const SensorMap = () => {
    const { selectedMeasurement } = useSensor();
    const [sensorInfo, setSensorInfo] = useState<SensorInfo | null>(null);

    useEffect(() => {
        if (!selectedMeasurement) return;

        const fetchSensorData = async () => {
            const data = await getSensorInfo(selectedMeasurement?.ultimaMedicion.dispositivo_id);
            if (!data) return;
            setSensorInfo(data);
        };

        if (selectedMeasurement) {
            fetchSensorData();
        }
    }, [selectedMeasurement]);

    if (!sensorInfo) return null;

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}>
            <Box
                sx={{
                    position: 'relative',
                    width: {
                        xs: '100%',
                        lg: '50%',
                    },
                    minHeight: '45rem',
                    height: {
                        xs: '500px',
                        lg: 'calc(100vh - 19rem)',
                    },
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                <Map
                    streetViewControl={false}
                    defaultZoom={sensorInfo?.lat && sensorInfo?.long ? 15 : 5}
                    defaultCenter={{
                        lat: sensorInfo?.lat ? Number(sensorInfo?.lat) : 23.6345,
                        lng: sensorInfo?.long ? Number(sensorInfo?.long) : -102.5528,
                    }}
                    mapTypeId="satellite"
                    gestureHandling="greedy"
                    mapId="f1b7b1b3b1b3b1b3"
                    zoomControl={false}
                >
                    {sensorInfo && sensorInfo.lat && sensorInfo.long && (
                        <PulsingMarker
                            position={{
                                lat: Number(sensorInfo.lat),
                                lng: Number(sensorInfo.long),
                            }}
                        />
                    )}
                </Map>
                {sensorInfo && sensorInfo.lat && sensorInfo.long && (
                    <ZoomButton lat={Number(sensorInfo.lat)} lng={Number(sensorInfo.long)} />
                )}
            </Box>
        </APIProvider>
    );
};
