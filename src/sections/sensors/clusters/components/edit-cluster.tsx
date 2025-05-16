import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';

import { EditClusterAreaMap } from './edit-cluster-area-map';
import { Scrollbar } from '../../../../components/scrollbar';
import { ErrorAlert } from '../../../../layouts/alert/error-alert';
import { ReactMap } from '../../../../layouts/components/react-map';
import { SuccessAlert } from '../../../../layouts/alert/success-alert';
import { editCluster } from '../../../../api-requests/ranches/admin-clusters';
import { getAllSensors } from '../../../../api-requests/sensors/admin-sensors';
import { getAllRanchesWithSensors, moveSensorToRanch } from '../../../../api-requests/ranches/admin-ranches';

import type { ClustersAndSensorsByRanchId } from '../../../../api-requests/ranches/schema';
import { updateCoordinates } from '../../../../api-requests/iot';
import { assignAreaToSensor } from '../../../../api-requests/admin/sensors';

type NewRanchProps = {
    refetchClusters: () => void;
    isOpen: boolean;
    onCloseDrawer: () => void;
    cluster: ClustersAndSensorsByRanchId;
    onItemClick: (item: any) => void;
    selectedCluster: ClustersAndSensorsByRanchId | null;
};

export const EditCluster = ({
    refetchClusters,
    isOpen,
    onCloseDrawer,
    cluster,
    onItemClick,
    selectedCluster,
}: NewRanchProps) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [color, setColor] = useState('#4F46E5');
    const [selectedRanchId, setSelectedRanchId] = useState('');
    const [sensor15cm, setSensor15cm] = useState<{
        deviceId: string;
        id: number;
        name: string | null;
    } | null>(null);
    const [sensor30cm, setSensor30cm] = useState<{
        deviceId: string;
        id: number;
        name: string | null;
    } | null>(null);
    const [coordinates, setCoordinates] = useState<google.maps.LatLngLiteral[] | null>(null);
    const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setName(cluster.cluster.name || '');
        setType(cluster?.cluster?.type || '');
        setColor(cluster?.cluster?.color || '#4F46E5');
        setSelectedRanchId(String(cluster?.cluster?.ranchId) || '');
        if (cluster.cluster.lat && cluster.cluster.lng) {
            setMarker({ lat: cluster.cluster.lat, lng: cluster.cluster.lng });
        }
        if (cluster.cluster.area && cluster.cluster.area.coordinates) {
            setCoordinates(cluster.cluster.area.coordinates);
        }

        if (cluster.sensor15?.info) {
            setSensor15cm({
                deviceId: cluster.sensor15.info.deviceId,
                id: cluster.sensor15.info.id,
                name: cluster.sensor15.info.name,
            });
        }

        if (cluster.sensor30?.info) {
            setSensor30cm({
                deviceId: cluster.sensor30.info.deviceId,
                id: cluster.sensor30.info.id,
                name: cluster.sensor30.info.name,
            });
        }
    }, [cluster]);

    const { data: allRanches } = useQuery({
        queryKey: ['all-ranches-with-sensors'],
        queryFn: getAllRanchesWithSensors,
    });

    const { data: allSensors } = useQuery({
        queryKey: ['admin-sensors'],
        queryFn: getAllSensors,
    });

    const mutation = useMutation({
        mutationKey: ['update-cluster', cluster.cluster.id],
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
            clusterId: number;
        }) =>
            editCluster({
                name: data.clusterName,
                lat: data.lat,
                long: data.long,
                coordinatesArea: data.areaCoordinates,
                type: data.clusterType,
                color: data.clusterColor,
                sensor30ID: data.sensor30cmId,
                sensor15ID: data.sensor15cmId,
                ranchoId: data.ranchId,
                clusterId: data.clusterId,
            }),
        onSuccess: async () => {
            refetchClusters();
            onItemClick(null);
        },
    });

    const onEditCurrentCluster = async (
        markerPosition: google.maps.LatLngLiteral | null,
        polygon: google.maps.LatLngLiteral[]
    ) => {
        if (!markerPosition || polygon.length === 0 || !name || !type || !selectedRanchId) return;

        mutation.mutate({
            clusterName: name,
            clusterType: type,
            clusterColor: color,
            lat: markerPosition.lat,
            long: markerPosition.lng,
            areaCoordinates: polygon,
            ranchId: Number(selectedRanchId),
            sensor15cmId: sensor15cm ? Number(sensor15cm.id) : null,
            sensor30cmId: sensor30cm ? Number(sensor30cm.id) : null,
            clusterId: cluster.cluster.id,
        });

        if (sensor15cm?.deviceId) {
            await updateCoordinates(sensor15cm?.deviceId, markerPosition.lat, markerPosition.lng);
            await assignAreaToSensor(sensor15cm.deviceId, polygon);
            await moveSensorToRanch(sensor15cm?.id, Number(selectedRanchId));
        }

        if (sensor30cm?.deviceId) {
            await updateCoordinates(sensor30cm?.deviceId, markerPosition.lat, markerPosition.lng);
            await assignAreaToSensor(sensor30cm.deviceId, polygon);
            await moveSensorToRanch(sensor30cm?.id, Number(selectedRanchId));
        }
    };

    if (!allSensors || !allRanches) {
        return null;
    }

    const sensorsData =
        allSensors?.map((sensor) => ({
            deviceId: sensor.deviceId,
            id: sensor.id,
            name: sensor.name,
        })) || [];

    return (
        <Drawer open={isOpen} onClose={onCloseDrawer} anchor="right" sx={{ height: '100vh' }}>
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
                        height: '100vh',
                    }}
                >
                    <Typography variant="subtitle1">
                        Editar cluster {cluster?.cluster?.name}
                    </Typography>

                    {mutation.isError && (
                        <Box sx={{ my: 2 }}>
                            <ErrorAlert message={`${mutation.error}`} />
                        </Box>
                    )}

                    {mutation.isSuccess && (
                        <Box sx={{ my: 2 }}>
                            <SuccessAlert message="Cluster actualizado" />
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
                        options={[{ id: -1, deviceId: '', name: 'Ninguno' }, ...sensorsData]}
                        sx={{ mt: 2 }}
                        value={sensor15cm}
                        onChange={(_, newValue) =>
                            setSensor15cm(newValue?.id === -1 ? null : newValue)
                        }
                        getOptionLabel={(option) => {
                            if (!option) return 'Ninguno';
                            if (option.id === -1) return 'Ninguno';

                            return option.name || `S/N - ${option.deviceId}`;
                        }}
                        getOptionDisabled={(option) => sensor30cm?.id === option.id}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Sensor a 15 cm" />}
                    />

                    <Autocomplete
                        size="small"
                        options={[{ id: -1, deviceId: '', name: 'Ninguno' }, ...sensorsData]}
                        sx={{ mt: 2 }}
                        value={sensor30cm}
                        onChange={(_, newValue) =>
                            setSensor30cm(newValue?.id === -1 ? null : newValue)
                        }
                        getOptionLabel={(option) => {
                            if (!option) return 'Ninguno';
                            return option.id === -1
                                ? 'Ninguno'
                                : option.name || `S/N - ${option.deviceId}`;
                        }}
                        getOptionDisabled={(option) => sensor15cm?.id === option.id}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Sensor a 30 cm" />}
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
                        Selecciona la ubicación del cluster y el su área
                    </Typography>

                    <ReactMap>
                        <EditClusterAreaMap
                            onSendFunction={onEditCurrentCluster}
                            isLoading={mutation.isPending}
                            marker={marker}
                            polygon={coordinates}
                            isMobile={isMobile}
                        />
                    </ReactMap>
                </Box>
            </Scrollbar>
        </Drawer>
    );
};
