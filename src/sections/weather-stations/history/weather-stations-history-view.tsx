import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import {SelectDate} from "./components/select-date";
import {Iconify} from "../../../components/iconify";
import {HistoryChart} from "./components/history-chart";
import {ErrorAlert} from "../../../layouts/alert/error-alert";
import {SelectChartOptions} from "./components/select-chart-options";
import {HistoryLoading} from "../../../layouts/loading/history-loading";
import {getStationHistory} from "../../../api-requests/stations/admin-stations";

import type {StationLatestData} from "../../../api-requests/type";

type WeatherStationsHistoryViewProps = {
    stationId: string;
}

export const WeatherStationsHistoryView = ({
    stationId,
}: WeatherStationsHistoryViewProps) => {
    const { data, error, isError, isLoading, refetch } = useQuery({
        queryKey: ["weather-station-dashboard-history", stationId],
        queryFn: () => getStationHistory(stationId),
    })

    const [filterMeasurements, setFilterMeasurements] = useState<StationLatestData[]>([])
    const [selectedSensorOption, setSelectedSensorOption] = useState<string[]>([]);

    const handleRangeChange = (dateRange: [Date, Date]) => {
        const [startDate, endDate] = dateRange;
        if (!data?.data) {
            setFilterMeasurements([]);
            return;
        }
        const filteredMeasurements = data?.data.filter((station) => {
            const measurementDate = new Date(station.timestamp);
            return measurementDate >= startDate && measurementDate <= endDate;
        });

        setFilterMeasurements(filteredMeasurements);
    };

    if (isLoading) {
        return (
            <HistoryLoading />
        )
    }

    if (isError) {
        return (
            <ErrorAlert message={error.message}/>
        )
    }

    if (!data?.data) {
        return (
            <ErrorAlert message="Sin datos"/>
        )
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Tooltip title="Recargar">
                <IconButton
                    sx={{
                        position: "absolute",
                        top: -65,
                        right: 0,
                    }}
                    onClick={() => refetch()}
                >
                    <Iconify icon="ion:reload" />
                </IconButton>
            </Tooltip>
            <SelectDate measurements={data?.data} onRangeChange={handleRangeChange} />
            <HistoryChart measurements={filterMeasurements} selectedOptions={selectedSensorOption} />
            <SelectChartOptions
                selectedOptions={selectedSensorOption}
                setSelectedOptions={setSelectedSensorOption}
            />
        </Box>
    )

}