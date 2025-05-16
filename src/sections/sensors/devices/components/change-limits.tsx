import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { BACKEND_URL } from 'src/api-requests/api-url';
import {getSensorInfo, changeSensorCapacity} from 'src/api-requests/iot';

import { Iconify } from 'src/components/iconify';

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

export const ChangeLimits = ({
    isOpen,
    handleClose,
    selectedSensorId,
}: {
    isOpen: boolean;
    handleClose: () => void;
    selectedSensorId: string;
}) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [limits, setLimits] = useState<[number, number]>([0, 100]);
    const [idealCapacity, setIdealCapacity] = useState<string>('');

    useEffect(() => {
        const fetchCurrentData = async () => {
            const data = await getSensorInfo(selectedSensorId);
            if (!data) return;
            setLimits([
                data.limite_inferior ? data.limite_inferior : 0,
                data.limite_superior ? data.limite_superior : 100,
            ]);
            setIdealCapacity(data.capacidadIdeal || "");
        };
        fetchCurrentData();
    }, [selectedSensorId]);

    const handleLimitsChange = (event: Event, newValue: number | number[]) => {
        setLimits(newValue as [number, number]);
    };

    const closeModal = () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        setIsLoading(false);
        setLimits([0, 100]);
        setIdealCapacity('');
        handleClose();
    };

    const handleUpdateSensorData = async () => {
        // Validate inputs
        if (!idealCapacity || limits[0] >= limits[1]) {
            setErrorMessage('Por favor, complete todos los campos correctamente');
            return;
        }

        setIsLoading(true);
        try {
            // Update limits
            const limitsResponse = await fetch(
                `${BACKEND_URL}/api/sensors/sensores/${selectedSensorId}/limites`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        limite_inferior: limits[0],
                        limite_superior: limits[1],
                    }),
                }
            );

            const success = await changeSensorCapacity(selectedSensorId, Number(idealCapacity));

            if (success && limitsResponse.ok) {
                setSuccessMessage('Datos del sensor actualizados exitosamente');
                setTimeout(closeModal, 2000);
            } else {
                throw new Error('Error en la actualización');
            }
        } catch (error) {
            setErrorMessage('Error al actualizar los datos del sensor');
            setTimeout(() => setErrorMessage(null), 2000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onClose={closeModal} aria-labelledby="change-limits-modal">
            <Card sx={{ ...style, width: '90%', maxWidth: '500px' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Establecer Datos del Sensor</Typography>
                    <IconButton onClick={closeModal}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Stack>
                <Box component="form">
                    <Stack spacing={4} sx={{ mt: 2 }}>
                        <Stack spacing={2}>
                            <Typography>Límites Inferior y Superior</Typography>
                            <Slider
                                value={limits}
                                onChange={handleLimitsChange}
                                valueLabelDisplay="on"
                                min={0}
                                max={100}
                            />
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Límite Inferior"
                                    value={limits[0]}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value || value === 0) {
                                            setLimits([value, limits[1]]);
                                        }
                                    }}
                                    type="number"
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Límite Superior"
                                    value={limits[1]}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value || value === 0) {
                                            setLimits([limits[0], value]);
                                        }
                                    }}
                                    type="number"
                                    fullWidth
                                    required
                                />
                            </Stack>
                        </Stack>

                        <TextField
                            fullWidth
                            label="Capacidad Ideal"
                            variant="outlined"
                            value={idealCapacity}
                            onChange={(e) => setIdealCapacity(e.target.value)}
                            type="number"
                            required
                        />

                        {successMessage && (
                            <Typography variant="body1" color="success.main">
                                {successMessage}
                            </Typography>
                        )}
                        {errorMessage && (
                            <Typography variant="body1" color="error.main">
                                {errorMessage}
                            </Typography>
                        )}

                        <LoadingButton
                            variant="contained"
                            fullWidth
                            onClick={handleUpdateSensorData}
                            loading={isLoading}
                        >
                            Guardar Cambios
                        </LoadingButton>
                    </Stack>
                </Box>
            </Card>
        </Modal>
    );
};
