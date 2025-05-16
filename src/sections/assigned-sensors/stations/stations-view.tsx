import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import { useMediaQuery } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { StationRow } from './components/station-row';
import { useAuth } from '../../../context/AuthContext';
import { StationCard } from './components/station-card';
import { ErrorAlert } from '../../../layouts/alert/error-alert';
import { useFilterTable } from '../../../hooks/use-filter-table';
import { TableLoading } from '../../../layouts/loading/table-loading';
import { SortableTableCell } from '../../../layouts/table/sortable-table-cell';
import { getUserStationsWithLatestData } from '../../../api-requests/stations/user-stations';
import {
    getUserStationsWithLatestDataItemSchema,
} from '../../../api-requests/stations/schema';

import type {
    getUserStationsWithLatestDataItem} from '../../../api-requests/stations/schema';
import { MobileSortingControlsStations } from './components/mobile-sorting-controls-stations';

export const StationsView = () => {
    const { userData } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['user-stations'],
        queryFn: () => getUserStationsWithLatestData(userData?.id),
    });

    const { sortedData, requestSort, getSortDirection, validationErrors, setSearchQuery } =
        useFilterTable<getUserStationsWithLatestDataItem>(
            data?.data,
            getUserStationsWithLatestDataItemSchema,
            {
                defaultSort: { key: 'deviceName', direction: 'asc' },
                defaultSearchKeys: ['deviceId', 'deviceName'],
            }
        );

    if (isLoading) {
        return <TableLoading />;
    }

    if (isError) {
        return <ErrorAlert message={error?.message} />;
    }

    if (isMobile) {
        return (
            <Box sx={{ mt: 2 }}>
                <MobileSortingControlsStations requestSort={requestSort} getSortDirection={getSortDirection} />
                {sortedData?.map((station, idx) => (
                    <StationCard
                        key={station.id}
                        station={station}
                        idx={idx}
                        totalStations={data?.data?.length || 0}
                    />
                ))}
            </Box>
        );
    }

    return (
        <TableContainer component={Card} sx={{ mt: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id del dispositivo</TableCell>
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
                            sortKey="grupoName"
                        >
                            Rancho
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.temperature"
                        >
                            Temperatura
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.humidity"
                        >
                            Humedad
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.light"
                        >
                            Luz
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.uv"
                        >
                            UV
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.windSpeed"
                        >
                            Velocidad del viento
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.windDirection"
                        >
                            Direacción del viento
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.rainfall"
                        >
                            Lluvia
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.pressure"
                        >
                            Presión
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.rssi"
                        >
                            rssi
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.snr"
                        >
                            snr
                        </SortableTableCell>
                        <SortableTableCell
                            requestSort={requestSort}
                            getSortDirection={getSortDirection}
                            sortKey="latestMeasurement.timestamp"
                        >
                            Última Actualización
                        </SortableTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData?.map((station, idx) => (
                        <StationRow key={station.id} idx={idx} station={station} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
