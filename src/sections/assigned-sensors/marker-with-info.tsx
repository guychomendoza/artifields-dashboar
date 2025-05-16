import type { LastSensorMeasurement } from 'src/api-requests/type';

import {useState, useEffect, useCallback} from 'react';
import { InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fetchLastMeasurementById } from 'src/api-requests/iot';
import type {Marker} from "@googlemaps/markerclusterer";

export const MarkerWithInfoWindow = ({
    position,
    color,
    name,
    deviceId,
    setMarkerRef
}: {
    position: { lat: number; lng: number };
    color: string;
    name: string;
    deviceId: string;
    setMarkerRef: (marker: Marker | null, key: string) => void;
}) => {
    const [infoWindowShown, setInfoWindowShown] = useState(false);
    const [sensorInfo, setSensorInfo] = useState<LastSensorMeasurement | null>(null);

    // Fetch sensor data when the component mounts
    useEffect(() => {
        const fetchSensorData = async () => {
            const data = await fetchLastMeasurementById(deviceId);
            if (data) setSensorInfo(data);
        };
        fetchSensorData();
    }, [deviceId]);

    const handleMarkerClick = () => {
        setInfoWindowShown((isShown) => !isShown);
    };

    const handleClose = () => setInfoWindowShown(false);

    const ref = useCallback(
        (marker: google.maps.marker.AdvancedMarkerElement) => setMarkerRef(marker, deviceId),
        [setMarkerRef, deviceId]
    );

    return (
        <>
            <AdvancedMarker position={position} onClick={handleMarkerClick} ref={ref}>
                {/* Custom Circle Marker */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#FFF',
                        borderRadius: '50%',
                        border: `2px solid ${color}`,
                        color: '#000',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    {sensorInfo?.ultimaMedicion.agua_suelo ?? '-'}
                </div>
            </AdvancedMarker>
            {infoWindowShown && (
                <InfoWindow position={position} onCloseClick={handleClose}>
                    <Box sx={{ p: 0.5 }}>
                        <Typography variant="subtitle1" component="h2">
                            {name}
                        </Typography>
                        <Typography variant="body2">
                            Temperatura del Suelo: {sensorInfo?.ultimaMedicion.temperatura_suelo}°C
                        </Typography>
                        <Typography variant="body2">
                            Humedad del Suelo: {sensorInfo?.ultimaMedicion.agua_suelo}%
                        </Typography>
                        <Typography variant="body2">
                            Conductividad del Suelo: {sensorInfo?.ultimaMedicion.conductividad_suelo}uS/cm
                        </Typography>
                    </Box>
                </InfoWindow>
            )}
        </>
    );
};
