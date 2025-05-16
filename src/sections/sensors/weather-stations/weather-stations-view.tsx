import {useState} from "react";
import { useQuery } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import {EditStation} from "./components/edit-station";
import { ErrorAlert } from '../../../layouts/alert/error-alert';
import { useFilterTable } from '../../../hooks/use-filter-table';
import {StationTableItem} from "./components/station-table-item";
import {StationTableHeader} from "./components/station-table-header";
import { TableLoading } from '../../../layouts/loading/table-loading';
import { StationItemSchema } from '../../../api-requests/stations/schema';
import { getAllStationsLastMeasuring } from '../../../api-requests/stations/admin-stations';

import type { StationItem } from '../../../api-requests/stations/schema';

export const WeatherStationsView = () => {
    const [selectedStation, setSelectedStation] = useState<{name: string, id: string }|null>(null);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-weather-stations'],
        queryFn: getAllStationsLastMeasuring,
    });

    const { sortedData, requestSort, getSortDirection, validationErrors } =
        useFilterTable<StationItem>(data?.data, StationItemSchema, {
            defaultSort: { key: "latestData.deviceName", direction: "asc" }
        });

    if (validationErrors) {
        return <ErrorAlert message={validationErrors.message} />;
    }

    if (isLoading) {
        return <TableLoading />;
    }

    if (isError) {
        return <ErrorAlert message={error.message} />;
    }

    return (
        <>
            <TableContainer component={Card} sx={{ mt: 2 }}>
                <Table>
                    <StationTableHeader requestSort={requestSort} getSortDirection={getSortDirection} />
                    <TableBody>
                        {sortedData.map((station, idx) => (
                            <StationTableItem
                                key={station.station.id}
                                station={station}
                                setSelectedStation={setSelectedStation}
                                idx={idx}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {
                selectedStation !== null ? (
                    <EditStation
                        isOpen
                        onClose={() => setSelectedStation(null)}
                        stationId={selectedStation.id}
                        name={selectedStation.name}
                    />
                ) : null
            }
        </>
    );
};
