import { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

import { RanchMap } from './ranch-map';
import {assignSensorRanchArea} from "../../../../api-requests/iot";

import type { DeviceRead } from "../../../../api-requests/type";

type AssignCoordinatesRanchProps = {
    devices: DeviceRead[];
}

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

export const AssignCoordinatesRanch = ({
    devices,
}: AssignCoordinatesRanchProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleClose = () => setIsOpen(false);

    const onAssignCoordinates = async (coordinates: google.maps.LatLngLiteral[]) => {
        if (!devices.length) {
            setErrorMessage('No hay dispositivos para asignar coordenadas');
            setShowError(true);
            return;
        }

        setIsLoading(true);
        try {
            const results = await Promise.all(
                devices.map(device =>
                    assignSensorRanchArea(device.device_id, coordinates)
                )
            );

            // Check if all assignments were successful
            if (results.every(result => result)) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    handleClose();
                }, 3000);
            } else {
                throw new Error('Algunos dispositivos no pudieron ser actualizados');
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Error al asignar coordenadas');
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <IconButton onClick={() => setIsOpen(true)}>
                <Iconify icon="solar:map-linear" />
            </IconButton>

            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Card
                    sx={{
                        ...style,
                        width: {
                            xs: '90%',
                            sm: 400,
                            md: 600,
                            lg: 800,
                        },
                    }}
                >
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignContent="center"
                            alignItems="center"
                        >
                            <Typography variant="h6">Asignar coordenadas al rancho</Typography>

                            <IconButton onClick={handleClose} disabled={isLoading}>
                                <Iconify icon="eva:close-fill" />
                            </IconButton>
                        </Stack>
                        {
                            showSuccess && (
                                <Typography variant="body2" color="green">
                                    Coordenadas asignadas exitosamente
                                </Typography>
                            )
                        }

                        {
                            showError && (
                                <Typography variant="body2" color="red">
                                    {errorMessage}
                                </Typography>
                            )
                        }
                        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}>
                            <RanchMap isPending={isLoading} onSendCoordinates={onAssignCoordinates} />
                        </APIProvider>
                    </CardContent>
                </Card>
            </Modal>
        </>
    );
};