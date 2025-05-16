import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import {useRouter} from "../../../../routes/hooks";
import {formatTimestampDistance} from "../../../../utils/format-time";

import type {StationWithLatestData} from "../../../../api-requests/type";

type StationRowProps = {
    station: StationWithLatestData;
    idx: number;
}

export const StationRow = ({station, idx}: StationRowProps) => {
    const router = useRouter();

    return (
        <TableRow
            key={station.id}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                backgroundColor: idx % 2 === 0 ? "rgba(255,255,255)" : "rgba(250,250,250)"
            }}
            onClick={() => router.push(`/weather-stations/${station.devEui}`)}
        >
            <TableCell>{station.devEui}</TableCell>
            <TableCell>{station.deviceName}</TableCell>
            <TableCell>{station.grupoName}</TableCell>
            <TableCell>{station.latestMeasurement.temperature}°C</TableCell>
            <TableCell>{station.latestMeasurement.humidity}%</TableCell>
            <TableCell>{station.latestMeasurement.light}</TableCell>
            <TableCell>{station.latestMeasurement.uv}</TableCell>
            <TableCell>{station.latestMeasurement.windSpeed}</TableCell>
            <TableCell>{station.latestMeasurement.windDirection}</TableCell>
            <TableCell>{station.latestMeasurement.rainfall}</TableCell>
            <TableCell>{station.latestMeasurement.pressure}</TableCell>
            <TableCell>{station.latestMeasurement.rssi}</TableCell>
            <TableCell>{station.latestMeasurement.snr}</TableCell>
            <TableCell>{formatTimestampDistance(station.latestMeasurement.timestamp)}</TableCell>
        </TableRow>
    )

}