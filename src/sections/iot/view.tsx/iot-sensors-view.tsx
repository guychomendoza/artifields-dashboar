import {useState, useEffect, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useSensor } from 'src/store/sensor';
import { DashboardContent } from 'src/layouts/dashboard';
import { getSensorInfo, fetchSensorsById, fetchLastMeasurementById } from 'src/api-requests/iot';

import { formatTimestamp } from '../utils';
import { SensorSections } from '../sensor-sections';
import { Iconify } from '../../../components/iconify';

export const IotSensorView = () => {
    const navigate = useNavigate();
    const { sensorId } = useParams();
    const { setSelectedMeasurement, setAllMeasurements, selectedMeasurement } = useSensor();
    const [sensorName, setSensorName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const fetchDevice = useCallback(async () => {
        if (!sensorId) return;
        setLoading(true);
        const data = await fetchSensorsById(sensorId);
        const lastMeasurement = await fetchLastMeasurementById(sensorId);
        const sensorInfo = await getSensorInfo(sensorId);
        if (sensorInfo) {
            setSensorName(sensorInfo.nombre || '');
        }
        if (data.length > 0) {
            setAllMeasurements(data);
        }

        if (lastMeasurement) {
            setSelectedMeasurement(lastMeasurement);
        }

        setLoading(false);
    }, [sensorId, setAllMeasurements, setSelectedMeasurement])

    useEffect(() => {
        fetchDevice();
    }, [fetchDevice]);

    return (
        <DashboardContent>
            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        flex: 1,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box
                        sx={{
                            position: "relative"
                        }}
                    >
                        <IconButton
                            onClick={() => navigate(-1)}
                            aria-label="regresar"
                            sx={{
                                padding: 0,
                            }}
                            size="large"
                        >
                            <Iconify
                                icon="solar:round-arrow-left-line-duotone"
                                sx={{
                                    width: 24,
                                    height: 24
                                }}
                            />
                        </IconButton>
                        <Typography variant="h4">{sensorName || 'Sin nombre asignado'}</Typography>
                        <Typography variant="body2">
                            {sensorId} - Actualizado{' '}
                            {formatTimestamp(selectedMeasurement?.ultimaMedicion.timestamp)}
                        </Typography>
                        <IconButton
                            aria-label="actualizar"
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0
                            }}
                            onClick={() => fetchDevice()}
                        >
                            <Iconify icon="solar:restart-circle-line-duotone" width={35} />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            height: {
                                xs: 'auto',
                                lg: 'calc(100vh - 13rem)',
                            },
                        }}
                    >
                        <SensorSections />
                    </Box>
                </>
            )}
        </DashboardContent>
    );
};
