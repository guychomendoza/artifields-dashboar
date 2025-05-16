import { useState, useEffect } from 'react';
import {
    Map,
    MapControl,
    APIProvider,
    AdvancedMarker,
    ControlPosition,
} from '@vis.gl/react-google-maps';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';

import { getSensorInfo, updateCoordinates } from 'src/api-requests/iot';

import { Iconify } from 'src/components/iconify';

import { PlacesAutocomplete } from './places-autocomplete';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export const MapCoordinates = ({
    isOpen,
    handleClose,
    selectedSensorId,
}: {
    isOpen: boolean;
    handleClose: () => void;
    selectedSensorId: string;
}) => {
    const [sucessMessage, setSucessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState<{
        latitude: number | null;
        longitude: number | null;
    }>({
        latitude: null,
        longitude: null,
    });

    useEffect(() => {
        const fetchCurrentData = async () => {
            const data = await getSensorInfo(selectedSensorId);
            if (!data) return;
            setSelectedCoordinates({
                latitude: data.lat ? Number(data.lat) : null,
                longitude: data.long ? Number(data.long) : null,
            });
        };
        fetchCurrentData();
    }, [selectedSensorId]);

    const closeModal = () => {
        setSucessMessage(null);
        setErrorMessage(null);
        setIsLoading(false);
        setSelectedCoordinates({
            latitude: null,
            longitude: null,
        });
        handleClose();
    };

    const handleUpdateCoordinates = async () => {
        if (!selectedCoordinates.latitude || !selectedCoordinates.longitude) return;
        setIsLoading(true);
        const isSuccessful = await updateCoordinates(
            selectedSensorId,
            selectedCoordinates.latitude,
            selectedCoordinates.longitude
        );
        if (isSuccessful) {
            setSucessMessage('Coordinates updated successfully');
            setIsLoading(false);
            setTimeout(() => setSucessMessage(null), 2000);
            return;
        }
        setErrorMessage('Failed to update coordinates');
        setIsLoading(false);
        setTimeout(() => setErrorMessage(null), 2000);
    };

    // Handler for place selection from autocomplete
    const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
        if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setSelectedCoordinates({ latitude: lat, longitude: lng });
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Card sx={{ ...style, width: '90%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Assignar coordenadas al sensor</Typography>
                    <IconButton onClick={handleClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Stack>
                <CardContent>
                    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}>
                        <Box height="70vh" mt={2}>
                            <Map
                                defaultZoom={5}
                                streetViewControl={false}
                                defaultCenter={{ lat: 23.6345, lng: -102.5528 }}
                                mapTypeId="satellite"
                                gestureHandling="greedy"
                                mapId="f1b7b1b3b1b3b1b3"
                                onClick={(e) => {
                                    const lat = e.detail.latLng?.lat;
                                    const lng = e.detail.latLng?.lng;
                                    if (!lat || !lng) return;
                                    setSelectedCoordinates({ latitude: lat, longitude: lng });
                                }}
                            >
                                <MapControl position={ControlPosition.TOP_CENTER}>
                                    <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
                                </MapControl>

                                {selectedCoordinates.latitude && selectedCoordinates.longitude && (
                                    <AdvancedMarker
                                        position={{
                                            lat: selectedCoordinates.latitude,
                                            lng: selectedCoordinates.longitude,
                                        }}
                                    />
                                )}
                            </Map>
                        </Box>
                    </APIProvider>

                    {sucessMessage && (
                        <Typography variant="body1" color="green">
                            {sucessMessage}
                        </Typography>
                    )}
                    {errorMessage && (
                        <Typography variant="body1" color="red">
                            {errorMessage}
                        </Typography>
                    )}

                    <LoadingButton
                        variant="contained"
                        sx={{ mt: 1 }}
                        fullWidth
                        onClick={handleUpdateCoordinates}
                        loading={isLoading}
                    >
                        Update Sensor Coordinates
                    </LoadingButton>
                </CardContent>
            </Card>
        </Modal>
    );
};
