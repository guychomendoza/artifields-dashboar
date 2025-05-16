import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { useAuth } from 'src/context/AuthContext';

import { Iconify } from '../../components/iconify';
import { getRelativeColor } from '../../utils/table';
import { SensorCardTable } from './sensor-card-table';
import { ErrorAlert } from '../../layouts/alert/error-alert';
import { useFilterTable } from '../../hooks/use-filter-table';
import { SearchTable } from '../../layouts/table/search-table';
import { formatTimestampDistance } from '../../utils/format-time';
import { MobileSortingControls } from './mobile-sorting-controls';
import { TableLoading } from '../../layouts/loading/table-loading';
import { userSensorSchema } from '../../api-requests/sensors/schema';
import { SortableTableCell } from '../../layouts/table/sortable-table-cell';
import { getAllUsersSensorsById } from '../../api-requests/sensors/user-sensors';

import type { UserSensorItemLastMeasurement } from '../../api-requests/sensors/schema';


export const UserDevicesTable = () => {
    const navigate = useNavigate();
    const { userData } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { data, refetch, isLoading, isError, error } = useQuery({
        queryKey: [`user-sensors-${userData?.id}`],
        queryFn: () => getAllUsersSensorsById(userData?.id),
        enabled: !!userData?.id,
    });

    const { sortedData, requestSort, getSortDirection, validationErrors, setSearchQuery } =
        useFilterTable<UserSensorItemLastMeasurement>(data, userSensorSchema, {
            defaultSort: { key: 'deviceName', direction: 'asc' },
            defaultSearchKeys: ['deviceId', 'deviceName'],
        });

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
        <Box
            sx={{
                position: 'relative',
                paddingTop: 2,
            }}
        >
            <IconButton
                aria-label="actualizar"
                sx={{
                    position: 'absolute',
                    top: -40,
                    right: 0,
                }}
                onClick={() => refetch()}
            >
                <Iconify icon="solar:restart-circle-line-duotone" width={35} />
            </IconButton>

            <Card>
                <Box sx={{ p: 1 }}>
                    <SearchTable onSearch={setSearchQuery} />
                </Box>

                {isMobile ? (
                    <Box>
                        <Box sx={{ p: 2 }}>
                            <MobileSortingControls
                                requestSort={requestSort}
                                getSortDirection={getSortDirection}
                            />
                        </Box>

                        {/* Mobile Card View */}
                        <Stack spacing={0} sx={{ mt: 2 }}>
                            {sortedData.map((sensor, idx) => (
                                <SensorCardTable
                                    key={sensor.deviceId}
                                    sensor={sensor}
                                    idx={idx}
                                    onCardClick={() => navigate(`/iot/sensor/${sensor.deviceId}`)}
                                />
                            ))}
                        </Stack>
                    </Box>
                ) : (
                    // Desktop Table View
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre del Grupo</TableCell>
                                    <SortableTableCell
                                        requestSort={requestSort}
                                        getSortDirection={getSortDirection}
                                        sortKey="deviceName"
                                    >
                                        Nombre del Dispositivo
                                    </SortableTableCell>
                                    <SortableTableCell
                                        requestSort={requestSort}
                                        getSortDirection={getSortDirection}
                                        sortKey="lastMeasurement.soilWater"
                                    >
                                        Humedad del Suelo
                                    </SortableTableCell>
                                    <SortableTableCell
                                        requestSort={requestSort}
                                        getSortDirection={getSortDirection}
                                        sortKey="lastMeasurement.soilConductivity"
                                    >
                                        Conductividad del Suelo
                                    </SortableTableCell>
                                    <SortableTableCell
                                        requestSort={requestSort}
                                        getSortDirection={getSortDirection}
                                        sortKey="lastMeasurement.soilTemperature"
                                    >
                                        Temperatura del Suelo
                                    </SortableTableCell>
                                    <SortableTableCell
                                        requestSort={requestSort}
                                        getSortDirection={getSortDirection}
                                        sortKey="lastMeasurement.battery"
                                    >
                                        Batería
                                    </SortableTableCell>
                                    <SortableTableCell
                                        requestSort={requestSort}
                                        getSortDirection={getSortDirection}
                                        sortKey="lastMeasurement.timestamp"
                                    >
                                        Última Actualización
                                    </SortableTableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.map((sensor, idx) => (
                                    <TableRow
                                        key={sensor.deviceId}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            },
                                            backgroundColor:
                                                idx % 2 === 0
                                                    ? 'rgba(255,255,255)'
                                                    : 'rgba(250,250,250)',
                                        }}
                                        onClick={() => navigate(`/iot/sensor/${sensor.deviceId}`)}
                                    >
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            {sensor.groupName || 'Sin grupo asignado'}
                                        </TableCell>
                                        <TableCell>{sensor.deviceName || 'Sin nombre'}</TableCell>
                                        <TableCell>
                                            {sensor.lastMeasurement.soilWater
                                                ? `${sensor.lastMeasurement.soilWater}%`
                                                : 'sin información'}
                                        </TableCell>
                                        <TableCell>
                                            {sensor.lastMeasurement.soilConductivity
                                                ? `${sensor.lastMeasurement.soilConductivity}µS/cm`
                                                : 'sin información'}
                                        </TableCell>
                                        <TableCell>
                                            {sensor.lastMeasurement.soilTemperature
                                                ? `${sensor.lastMeasurement.soilTemperature}°C`
                                                : 'sin información'}
                                        </TableCell>
                                        <TableCell>
                                            {sensor.lastMeasurement.battery
                                                ? `${sensor.lastMeasurement.battery}V`
                                                : 'sin información'}
                                        </TableCell>
                                        <TableCell>
                                            {formatTimestampDistance(
                                                sensor.lastMeasurement.timestamp
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    backgroundColor: getRelativeColor(
                                                        sensor.lastMeasurement.timestamp
                                                    ),
                                                    margin: '0 auto',
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>
        </Box>
    );
};
