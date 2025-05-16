import type { AssignedSensor } from 'src/api-requests/type';

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { formatTimestamp } from '../../iot/utils';
import { ChangeName } from './components/change-name';
import { Iconify } from '../../../components/iconify';
import { AssignArea } from './components/assign-area';
import { ChangeLimits } from './components/change-limits';
import { AssignSensor } from './components/assign-sensor';
import { MapCoordinates } from './components/map-coordinates';
import { ErrorAlert } from '../../../layouts/alert/error-alert';
import { fetchAssignedSensors } from '../../../api-requests/iot';
import { useFilterTable } from '../../../hooks/use-filter-table';
import { SearchTable } from '../../../layouts/table/search-table';
import { TableLoading } from '../../../layouts/loading/table-loading';
import { copyToClipboard, getRelativeColor } from '../../../utils/table';
import { SortableTableCell } from '../../../layouts/table/sortable-table-cell';
import { getAllSensorsLastMeasuring } from '../../../api-requests/sensors/admin-sensors';
import { transformedSensorLastMeasurementSchema } from '../../../api-requests/sensors/schema';

import type { SensorItemLastMeasurement } from '../../../api-requests/sensors/schema';

enum CurrentModal {
    Coordinates,
    Limits,
    Users,
    Name,
    Area,
}

export const DevicesTableView = () => {
    const { data, refetch, isLoading, isError, error } = useQuery({
        queryKey: ['admin-sensors'],
        queryFn: getAllSensorsLastMeasuring,
        refetchInterval: 60000,
    });

    const { sortedData, requestSort, getSortDirection, validationErrors, setSearchQuery } =
        useFilterTable<SensorItemLastMeasurement>(data, transformedSensorLastMeasurementSchema, {
            defaultSort: { key: "deviceName", direction: "asc" },
            defaultSearchKeys: ['deviceId', 'deviceName'],
        });

    const [selectedModal, setSelectedModal] = useState<CurrentModal | null>(null);
    const [selectedSensor, setSelectedSensor] = useState<string>('');

    const navigate = useNavigate();

    const [assignedSensors, setAssignedSensors] = useState<AssignedSensor[]>([]);
    const [assignedUsersToSelectedSensor, setAssignedUsersToSelectedSensor] = useState<number[]>(
        []
    );

    const handleCloseModal = () => {
        setSelectedSensor('');
        setSelectedModal(null);
    };

    const getAssignedSensors = useCallback(async () => {
        const response = await fetchAssignedSensors();
        setAssignedSensors(response);
    }, []);

    useEffect(() => {
        getAssignedSensors();
    }, [getAssignedSensors]);

    useEffect(() => {
        if (!selectedSensor) return;
        const userWithSelectedSensor = assignedSensors.filter(
            (sensor) => sensor.sensor_id === selectedSensor
        );

        const user_ids = userWithSelectedSensor.map((sensor) => sensor.user_id);
        setAssignedUsersToSelectedSensor(user_ids);
    }, [selectedSensor, assignedSensors]);

    const onOpenModal = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        deviceId: string,
        modal: CurrentModal
    ) => {
        e.stopPropagation();
        setSelectedSensor(deviceId);
        setSelectedModal(modal);
    };

    if (validationErrors) {
        return <ErrorAlert message="Validation Errors" />;
    }

    if (isLoading) {
        return <TableLoading />;
    }

    if (isError) {
        return <ErrorAlert message={error.message} />;
    }

    return (
        <Card>
            <Box sx={{ p: 1 }}>
                <SearchTable onSearch={setSearchQuery} />
            </Box>

            <TableContainer sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Acciones</TableCell>
                            <TableCell>ID del Dispositivo</TableCell>
                            <SortableTableCell
                                getSortDirection={getSortDirection}
                                requestSort={requestSort}
                                sortKey="deviceName"
                            >
                                Nombre del Dispositivo
                            </SortableTableCell>
                            <SortableTableCell
                                getSortDirection={getSortDirection}
                                requestSort={requestSort}
                                sortKey="soilWater"
                            >
                                Humedad del Suelo
                            </SortableTableCell>
                            <SortableTableCell
                                getSortDirection={getSortDirection}
                                requestSort={requestSort}
                                sortKey="soilConductivity"
                            >
                                Conductividad del Suelo
                            </SortableTableCell>
                            <SortableTableCell
                                getSortDirection={getSortDirection}
                                requestSort={requestSort}
                                sortKey="soilTemperature"
                            >
                                Temperatura del Suelo
                            </SortableTableCell>
                            <SortableTableCell
                                getSortDirection={getSortDirection}
                                requestSort={requestSort}
                                sortKey="battery"
                            >
                                Batería
                            </SortableTableCell>
                            <SortableTableCell
                                getSortDirection={getSortDirection}
                                requestSort={requestSort}
                                sortKey="timestamp"
                            >
                                Última Actualización
                            </SortableTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData?.map((sensor, idx) => (
                            <TableRow
                                key={sensor.id}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    },
                                    backgroundColor: idx % 2 === 0 ? "rgba(255,255,255)" : "rgba(250,250,250)"
                                }}
                                onClick={() => navigate(`/iot/sensor/${sensor.deviceId}`)}
                            >
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                    <div
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: getRelativeColor(sensor.timestamp),
                                            margin: '0 auto',
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Stack spacing={1} alignItems="center">
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Tooltip title="Asignar a usuarios">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="assign users"
                                                    onClick={(e) =>
                                                        onOpenModal(
                                                            e,
                                                            sensor.deviceId,
                                                            CurrentModal.Users
                                                        )
                                                    }
                                                >
                                                    <Iconify
                                                        width={24}
                                                        icon="solar:move-to-folder-bold"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Cambiar nombre">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="change name"
                                                    onClick={(e) =>
                                                        onOpenModal(
                                                            e,
                                                            sensor.deviceId,
                                                            CurrentModal.Name
                                                        )
                                                    }
                                                >
                                                    <Iconify
                                                        width={24}
                                                        icon="solar:password-minimalistic-input-bold"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Tooltip title="Asignar límites">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="assign limits"
                                                    onClick={(e) =>
                                                        onOpenModal(
                                                            e,
                                                            sensor.deviceId,
                                                            CurrentModal.Limits
                                                        )
                                                    }
                                                >
                                                    <Iconify
                                                        width={24}
                                                        icon="solar:align-vertical-center-bold"
                                                    />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Asignar coordenadas">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="assign coordinates"
                                                    onClick={(e) =>
                                                        onOpenModal(
                                                            e,
                                                            sensor.deviceId,
                                                            CurrentModal.Coordinates
                                                        )
                                                    }
                                                >
                                                    <Iconify
                                                        width={24}
                                                        icon="solar:map-point-add-bold"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Tooltip title="Asignar area">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="asignar area"
                                                    onClick={(e) =>
                                                        onOpenModal(
                                                            e,
                                                            sensor.deviceId,
                                                            CurrentModal.Area
                                                        )
                                                    }
                                                >
                                                    <Iconify
                                                        width={24}
                                                        icon="solar:map-arrow-square-bold"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                </TableCell>

                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            gap: 1
                                        }}
                                    >
                                        {sensor.deviceId}{' '}
                                        <IconButton
                                            onClick={(e) => copyToClipboard(e, sensor.deviceId)}
                                            edge="end"
                                            size="small"
                                        >
                                            <Iconify icon="solar:copy-bold-duotone" width={15} />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            gap: 1
                                        }}
                                    >
                                        {sensor?.deviceName ? sensor.deviceName : 'Sin nombre'}
                                        <IconButton
                                            onClick={(e) =>
                                                copyToClipboard(
                                                    e,
                                                    sensor.deviceName || 'Sin nombre'
                                                )
                                            }
                                            size="small"
                                            edge="end"
                                        >
                                            <Iconify icon="solar:copy-bold-duotone" width={15} />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {sensor.soilWater ? `${sensor.soilWater}%` : 'sin información'}
                                </TableCell>
                                <TableCell>
                                    {sensor.soilTemperature
                                        ? `${sensor.soilConductivity}µS/cm`
                                        : 'sin información'}
                                </TableCell>
                                <TableCell>
                                    {sensor.soilTemperature
                                        ? `${sensor.soilTemperature}°C`
                                        : 'sin información'}
                                </TableCell>
                                <TableCell>
                                    {sensor.battery ? `${sensor.battery}V` : 'sin información'}
                                </TableCell>
                                <TableCell>{formatTimestamp(sensor.timestamp)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AssignSensor
                isOpen={selectedModal === CurrentModal.Users}
                handleClose={handleCloseModal}
                refetchAssignedSensors={getAssignedSensors}
                selectedSensorId={selectedSensor}
                alreadyAssignedIds={assignedUsersToSelectedSensor}
            />

            <ChangeName
                isOpen={selectedModal === CurrentModal.Name}
                handleClose={handleCloseModal}
                refetchDevices={refetch}
                selectedSensorId={selectedSensor}
            />

            <MapCoordinates
                isOpen={selectedModal === CurrentModal.Coordinates}
                handleClose={handleCloseModal}
                selectedSensorId={selectedSensor}
            />

            <ChangeLimits
                isOpen={selectedModal === CurrentModal.Limits}
                handleClose={handleCloseModal}
                selectedSensorId={selectedSensor}
            />

            <AssignArea
                isOpen={selectedModal === CurrentModal.Area}
                handleClose={handleCloseModal}
                deviceId={selectedSensor}
            />
        </Card>
    );
};
