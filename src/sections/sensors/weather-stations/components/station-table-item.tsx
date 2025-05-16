import type { Dispatch, SetStateAction } from 'react';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useRouter } from '../../../../routes/hooks';
import { Iconify } from '../../../../components/iconify';
import { copyToClipboard } from '../../../../utils/table';
import { formatTimestampDistance } from '../../../../utils/format-time';

import type { StationItem } from '../../../../api-requests/stations/schema';

type StationTableItemProps = {
    station: StationItem;
    setSelectedStation: Dispatch<SetStateAction<{ name: string; id: string } | null>>;
    idx: number;
};

export const StationTableItem = ({ station, setSelectedStation, idx }: StationTableItemProps) => {
    const router = useRouter();

    return (
        <TableRow
            key={station.station.id}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                backgroundColor: idx % 2 === 0 ? "rgba(255,255,255)" : "rgba(250,250,250)"
            }}
            onClick={() => router.push(`/weather-stations/${station.station.devEui}`)}
        >
            <TableCell>
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStation({
                            name: station.station.deviceName,
                            id: station.station.devEui,
                        });
                    }}
                >
                    <Iconify icon="solar:pen-bold-duotone" />
                </IconButton>
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
                    {station.station.devEui}
                    <IconButton
                        onClick={(e) => copyToClipboard(e, station.station.devEui)}
                        size="small"
                        edge="end"
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
                    {station.latestData.deviceName}
                    <IconButton
                        onClick={(e) => copyToClipboard(e, station.latestData.deviceName)}
                        size="small"
                        edge="end"
                    >
                        <Iconify icon="solar:copy-bold-duotone" width={15}/>
                    </IconButton>
                </Box>
            </TableCell>
            <TableCell>{station.station.grupoName}</TableCell>
            <TableCell>{station.latestData.temperature}°C</TableCell>
            <TableCell>{station.latestData.humidity}%</TableCell>
            <TableCell>{station.latestData.light}</TableCell>
            <TableCell>{station.latestData.uv}</TableCell>
            <TableCell>{station.latestData.windSpeed}</TableCell>
            <TableCell>{station.latestData.windDirection}</TableCell>
            <TableCell>{station.latestData.rainfall}</TableCell>
            <TableCell>{station.latestData.pressure}</TableCell>
            <TableCell>{station.latestData.rssi}</TableCell>
            <TableCell>{station.latestData.snr}</TableCell>
            <TableCell>{formatTimestampDistance(station.latestData.timestamp)}</TableCell>
        </TableRow>
    );
};
