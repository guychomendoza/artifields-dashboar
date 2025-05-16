import type { Marker } from '@googlemaps/markerclusterer';

import { useCallback } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

import Box from "@mui/material/Box";

import type { ClusterSensor } from '../../../api-requests/ranches/schema';

export type TreeMarkerProps = {
    sensor: ClusterSensor;
    onClick: (sensor: ClusterSensor) => void;
    setMarkerRef: (marker: Marker | null, key: string) => void;
    color: string;
};

export const SensorCustomMarker = (props: TreeMarkerProps) => {
    const { sensor, onClick, setMarkerRef, color } = props;

    const handleClick = useCallback(() => onClick(sensor), [onClick, sensor]);
    const ref = useCallback(
        (marker: google.maps.marker.AdvancedMarkerElement) => {
            if (!sensor?.info?.id) return;
                setMarkerRef(marker, String(sensor.info.id))
        },
        [setMarkerRef, sensor?.info?.id]
    );

    return (
        <AdvancedMarker position={{ lat: sensor?.info?.lat || 0, lng: sensor?.info?.lng || 0 }} ref={ref} onClick={handleClick}>
            <Box
                sx={{
                    width: 35,
                    height: 35,
                    borderRadius: '50%',
                    bgcolor: color,
                    opacity: 0.8,
                    border: 2,
                    borderColor: 'common.white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'common.white',
                    fontSize: 12,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textShadow: '0px 0px 3px black', // Added text shadow
                    '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s ease-in-out'
                    }
                }}
            >
                {sensor?.lastMeasurement?.soilMoisture !== null ?
                    sensor?.lastMeasurement?.soilMoisture :
                    'N/A'
                }
            </Box>
        </AdvancedMarker>
    );
};
