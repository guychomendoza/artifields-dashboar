import { useState } from 'react';
import {useQuery, keepPreviousData} from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import { ErrorAlert } from '../../../layouts/alert/error-alert';
import { LogSensorFilters } from './components/log-sensor-filters';
import { LogSensorTable } from './components/log-sensor-table-item';
import { getSensorLogs } from '../../../api-requests/logs/admin-logs';
import { TableLoading } from '../../../layouts/loading/table-loading';
import { LogsSensorPagination } from './components/log-sensors-pagination';

export const LogsSensorsView = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [titleFilter, setTitleFilter] = useState("");
    const [jsonFilter, setJsonFilter] = useState("");

    const { data, isLoading, error, isError, isPlaceholderData } = useQuery({
        queryKey: ['logs-sensor', page, limit, titleFilter, jsonFilter],
        queryFn: () => getSensorLogs({ page, limit, titleFilter, jsonFilter }),
        placeholderData: keepPreviousData
    });

    // Modify filter components to only reset page when truly needed
    const handleTitleFilterChange = (newFilter: string) => {
        setTitleFilter(newFilter);
        // Only reset page if the filter is meaningfully different
        if (newFilter !== titleFilter) {
            setPage(1);
        }
    };

    // Similar modification for JSON filter
    const handleJsonFilterChange = (newFilter: string) => {
        setJsonFilter(newFilter);
        if (newFilter !== jsonFilter) {
            setPage(1);
        }
    };

    if (isLoading) {
        return <TableLoading />;
    }

    if (isError) {
        return <ErrorAlert message={error.message} />;
    }

    if (!data) {
        return <ErrorAlert message="Sin Datos" />;
    }

    return (
        <>
            <Card>
                <Box sx={{ p: 1 }}>
                    <LogSensorFilters
                        setJsonFilter={handleJsonFilterChange}
                        setTitleFilter={handleTitleFilterChange}
                        setPage={setPage}
                    />
                </Box>
                <TableContainer sx={{ mt: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Titulo</TableCell>
                                <TableCell sx={{ width: '400px' }}>Error</TableCell>
                                <TableCell>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.data?.map((log, idx) => (
                                <LogSensorTable key={log.id} logSensor={log} idx={idx} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <LogsSensorPagination
                hasNextPage={data.hasNextPage}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                numberOfPages={data.totalPages}
                currentPage={page}
                isPlaceholderData={isPlaceholderData}
            />
        </>
    );
};
