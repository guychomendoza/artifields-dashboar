import type {SyntheticEvent} from "react";

import { useState} from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";

import { DashboardContent } from 'src/layouts/dashboard';

import {useRouter} from "../../routes/hooks";
import {Iconify} from "../../components/iconify";
import {ErrorAlert} from "../../layouts/alert/error-alert";
import {formatTimestampDistance} from "../../utils/format-time";
import {TitleLoading} from "../../layouts/loading/title-loading";
import {a11yProps, CustomTabPanel} from "../../layouts/dashboard/tabs";
import {WeatherStationsHistoryView} from "./history/weather-stations-history-view";
import {WeatherStationsDashboardView} from "./dashboard/weather-stations-dashboard-view";
import {getLastMeasurementStationByDeviceId} from "../../api-requests/stations/user-stations";


export function WeatherStationsView() {
    const { stationId } = useParams();
    const router = useRouter();

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["weather-station-dashboard", stationId],
        queryFn: () => getLastMeasurementStationByDeviceId(stationId),
    })

    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const formattedTime = formatTimestampDistance(data?.latestData.timestamp)

    if (isError) {
        return (
            <DashboardContent>
                <ErrorAlert message={error.message}/>
            </DashboardContent>
        )
    }

    if (isLoading) {
        return (
            <DashboardContent>
                <TitleLoading />
            </DashboardContent>
        )
    }

    if (!stationId) {
        return (
            <DashboardContent>
                <ErrorAlert message="Sin estación registrada"/>
            </DashboardContent>
        )
    }

    return (
        <DashboardContent>
            <Stack>
                <IconButton
                    sx={{width: "fit-content", padding: "0"}}
                    onClick={() => {
                        router.back();
                    }}
                >
                    <Iconify icon="solar:arrow-left-line-duotone" width={20}/>
                </IconButton>
                <Typography variant="h4">{data?.station.deviceName || "Sin nombre asignado"}</Typography>
                <Typography variant="body2">actualizado {formattedTime}</Typography>
            </Stack>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="vistas-disponibles"
                sx={{
                    mt: 3,
                }}
            >
                <Tab
                    label="Dashboard"
                    {...a11yProps(0)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:code-scan-bold" />}
                    iconPosition="start"
                />
                <Tab
                    label="Historial"
                    {...a11yProps(0)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:history-2-bold-duotone" />}
                    iconPosition="start"
                />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <WeatherStationsDashboardView stationId={stationId} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <WeatherStationsHistoryView stationId={stationId} />
            </CustomTabPanel>
        </DashboardContent>
    );
}