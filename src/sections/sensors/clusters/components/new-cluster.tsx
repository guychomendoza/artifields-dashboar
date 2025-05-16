import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AreaMapCluster } from './area-map-cluster';
import { Scrollbar } from '../../../../components/scrollbar';
import { updateCoordinates } from '../../../../api-requests/iot';
import { ErrorAlert } from '../../../../layouts/alert/error-alert';
import { ReactMap } from '../../../../layouts/components/react-map';
import { SuccessAlert } from '../../../../layouts/alert/success-alert';
import { assignAreaToSensor } from '../../../../api-requests/admin/sensors';
import { getAllSensors } from '../../../../api-requests/sensors/admin-sensors';
import { createNewCluster } from '../../../../api-requests/ranches/admin-clusters';
import { moveSensorToRanch, getAllRanchesWithSensors } from '../../../../api-requests/ranches/admin-ranches';

import type { SensorInfo } from '../../../../api-requests/sensors/schema';

type NewClusterProps = {
    refetchClusters: () => void;
};

export const NewCluster = ({ refetchClusters }: NewClusterProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('#4F46E5');
    const [selectedRanchId, setSelectedRanchId] = useState('');
    const [sensor15cm, setSensor15cm] = useState<SensorInfo | null>(null);
    const [sensor30cm, setSensor30cm] = useState<SensorInfo | null>(null);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data: allRanches } = useQuery({
        queryKey: ['all-ranches-with-sensors'],
        queryFn: getAllRanchesWithSensors,
    });

    const { data: allSensors } = useQuery({
        queryKey: ['admin-sensors'],
        queryFn: getAllSensors,
    });

    const mutation = useMutation({
        mutationKey: ['createNewRanch', isOpen],
        mutationFn: (data: {
            clusterName: string;
            clusterType: string;
            clusterColor: string;
            lat: number;
            long: number;
            areaCoordinates: google.maps.LatLngLiteral[];
            sensor15cmId: number | null;
            sensor30cmId: number | null;
            ranchId: number;
        }) =>
            createNewCluster({
                name: data.clusterName,
                lat: data.lat,
                long: data.long,
                coordinatesArea: data.areaCoordinates,
                type: data.clusterType,
                color: data.clusterColor,
                sensor30ID: data.sensor30cmId,
                sensor15ID: data.sensor15cmId,
                ranchoId: data.ranchId,
            }),
        onSuccess: () => {
            refetchClusters();
            setName('');
            setType('');
            setColor('#4F46E5');
            setSelectedRanchId('');
            setSensor15cm(null);
            setSensor30cm(null);
        },
    });

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const validateForm = (markerPosition: google.maps.LatLngLiteral | null, polygon: google.maps.LatLngLiteral[]) => {
        if (!name) {
            setSnackbarMessage('Nombre no ingresado');
            setSnackbarOpen(true);
            return false;
        }

        if (!selectedRanchId) {
            setSnackbarMessage('Rancho no seleccionado');
            setSnackbarOpen(true);
            return false;
        }

        if (!type) {
            setSnackbarMessage('Tipo no ingresado');
            setSnackbarOpen(true);
            return false;
        }

        if (!markerPosition || polygon.length === 0) {
            setSnackbarMessage('Ubicación o area no ingresada');
            setSnackbarOpen(true);
            return false;
        }

        return true;
    };

    const onCreateNewCluster = async (
        markerPosition: google.maps.LatLngLiteral | null,
        polygon: google.maps.LatLngLiteral[]
    ) => {
        if (!validateForm(markerPosition, polygon)) return;

        mutation.mutate({
            clusterName: name,
            clusterType: type,
            clusterColor: color,
            lat: markerPosition!.lat,
            long: markerPosition!.lng,
            areaCoordinates: polygon,
            ranchId: Number(selectedRanchId),
            sensor15cmId: sensor15cm ? Number(sensor15cm.id) : null,
            sensor30cmId: sensor30cm ? Number(sensor30cm.id) : null,
        });

        if (sensor15cm?.deviceId) {
            await updateCoordinates(sensor15cm?.deviceId, markerPosition!.lat, markerPosition!.lng);
            await assignAreaToSensor(sensor15cm.deviceId, polygon);
            await moveSensorToRanch(sensor15cm?.id, Number(selectedRanchId));
        }

        if (sensor30cm?.deviceId) {
            await updateCoordinates(sensor30cm?.deviceId, markerPosition!.lat, markerPosition!.lng);
            await assignAreaToSensor(sensor30cm.deviceId, polygon);
            await moveSensorToRanch(sensor30cm?.id, Number(selectedRanchId));
        }
    };

    if (!allSensors || !allRanches) {
        return null;
    }

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                size="small"
                sx={{ mt: isMobile ? 1 : 0, ml: 'auto' }}
                onClick={() => setIsOpen(true)}
            >
                Crear cluster
            </Button>

            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                anchor="right"
                sx={{ height: '100vh' }}
            >
                <Scrollbar>
                    <Box
                        sx={{
                            width: {
                                xs: 300,
                                sm: 500,
                                md: 600,
                            },
                            p: {
                                xs: 1.5,
                                sm: 4,
                            },
                        }}
                    >
                        <Typography variant="subtitle1">Crear un nuevo cluster</Typography>

                        {mutation.isError && (
                            <Box sx={{ my: 2 }}>
                                <ErrorAlert message={`${mutation.error}`} />
                            </Box>
                        )}

                        {mutation.isSuccess && (
                            <Box sx={{ my: 2 }}>
                                <SuccessAlert message="Cluster creado" />
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            size="small"
                            label="Nombre"
                            sx={{ mt: 2 }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                            <InputLabel>Rancho</InputLabel>
                            <Select
                                value={selectedRanchId}
                                label="Rancho"
                                onChange={(e) => setSelectedRanchId(e.target.value)}
                            >
                                {allRanches?.map((ranch) => (
                                    <MenuItem key={ranch.id} value={ranch.id}>
                                        {ranch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Autocomplete
                            size="small"
                            options={allSensors}
                            sx={{ mt: 2 }}
                            value={sensor15cm}
                            onChange={(_, newValue) => setSensor15cm(newValue)}
                            getOptionLabel={(option) =>
                                option.name ? option.name : `S/N - ${option.deviceId}`
                            }
                            getOptionDisabled={(option) => sensor30cm?.id === option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label="Sensor a 15 cm" />
                            )}
                        />

                        <Autocomplete
                            size="small"
                            options={allSensors}
                            sx={{ mt: 2 }}
                            value={sensor30cm}
                            onChange={(_, newValue) => setSensor30cm(newValue)}
                            getOptionLabel={(option) =>
                                option.name ? option.name : `S/N - ${option.deviceId}`
                            }
                            getOptionDisabled={(option) => sensor15cm?.id === option.id}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label="Sensor a 30 cm" />
                            )}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Tipo"
                            sx={{ mt: 2 }}
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="Ingrese el tipo de cluster"
                        />

                        <TextField
                            type="color"
                            size="small"
                            label="Color"
                            fullWidth
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            sx={{
                                mt: 2,
                                '& input[type="color"]': {
                                    width: '100%',
                                    padding: 1,
                                },
                            }}
                        />

                        <Typography variant="caption" sx={{ mt: 3, mb: 1, display: 'block' }}>
                            Selecciona la ubicación del rancho y el su área
                        </Typography>

                        <ReactMap>
                            <AreaMapCluster
                                isLoading={mutation.isPending}
                                onSendFunction={onCreateNewCluster}
                                isMobile={isMobile}
                            />
                        </ReactMap>
                    </Box>
                </Scrollbar>
            </Drawer>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};