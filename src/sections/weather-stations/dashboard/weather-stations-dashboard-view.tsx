import {useQuery} from "@tanstack/react-query";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from '@mui/material/Tooltip';
import IconButton from "@mui/material/IconButton";

import {SunCard} from "./components/sun-card";
import {ValueCard} from "./components/value-card";
import {Iconify} from "../../../components/iconify";
import {CompassCard} from "./components/compass-card";
import {SliderBarCart} from "./components/slider-bar-cart";
import {DashboardContent} from "../../../layouts/dashboard";
import {TachometerCard} from "./components/tachometer-card";
import {ErrorAlert} from "../../../layouts/alert/error-alert";
import {DashboardLoading} from "../../../layouts/loading/dashboard-loading";
import {getLastMeasurementStationByDeviceId} from "../../../api-requests/stations/user-stations";

type WeatherStationsDashboardViewProps = {
    stationId: string;
}

export const WeatherStationsDashboardView = ({
    stationId,
}: WeatherStationsDashboardViewProps) => {
    const { data, isError, error, isLoading, refetch } = useQuery({
        queryKey: ["weather-station-dashboard-data", stationId],
        queryFn: () => getLastMeasurementStationByDeviceId(stationId)
    })

    if (isError) {
        return (
            <DashboardContent>
                <ErrorAlert message={error?.message} />
            </DashboardContent>
        )
    }

    if (isLoading || !data) {
        return (
            <DashboardContent>
                <DashboardLoading />
            </DashboardContent>
        )
    }

    return (
        <Grid container spacing={2} sx={{ position: "relative" }}>

            <Tooltip title="Recargar">
                <IconButton
                    sx={{
                        position: "absolute",
                        top: -50,
                        right: 0,
                    }}
                    onClick={() => refetch()}
                >
                    <Iconify icon="ion:reload" />
                </IconButton>
            </Tooltip>

            <Grid item xs={12} md={4}>
                <SliderBarCart
                    title="Temperatura del aire"
                    iconName="solar:temperature-line-duotone"
                    value={data?.latestData.temperature || 0}
                    maxValue={50}
                    minValue={0}
                    units="°C"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <SliderBarCart
                    title="Humedad del aire"
                    iconName="solar:waterdrops-line-duotone"
                    value={data?.latestData.humidity || 0}
                    maxValue={50}
                    minValue={10}
                    units="%"
                    colors={["#F8D60D", "#7DD22B", "#1D89F4"]}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <SliderBarCart
                    title="Intensidad de la luz"
                    iconName="solar:lightbulb-bolt-line-duotone"
                    value={data?.latestData.light || 0}
                    maxValue={100000}
                    minValue={0}
                    units=" lux"
                    colors={["#BFBDBA", "#DFC976", "#FDD517"]}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TachometerCard
                    title="Velocidad del viento"
                    iconName="solar:wind-bold-duotone"
                    value={data?.latestData.windSpeed || 0}
                    maxValue={20}
                    minValue={0}
                    gradientColors={["#00E676", "#FFEA00", "#FF1744"]}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <CompassCard
                    title="Dirección del viento"
                    iconName="solar:compass-big-line-duotone"
                    value={data?.latestData.windDirection || 0}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <SunCard
                    title="Indice UV"
                    iconName="solar:sun-line-duotone"
                    value={data?.latestData.uv || 0}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TachometerCard
                    title="Precipitaciones"
                    iconName="solar:cloud-waterdrops-line-duotone"
                    value={data?.latestData.rainfall || 0}
                    maxValue={10}
                    minValue={0}
                    gradientColors={["#F8D60D", "#7FD422", "#1B87F7"]}
                    units="mm/h"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <SliderBarCart
                    title="Presión"
                    iconName="solar:weigher-line-duotone"
                    value={data?.latestData.pressure || 0}
                    maxValue={120000}
                    minValue={70000}
                    units=" Pa"
                    colors={["#84D321", "#FED508", "#FF5038"]}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack direction="column" spacing={1}>
                    <ValueCard
                        icon="solar:home-wifi-angle-line-duotone"
                        title="rssi"
                        value={data?.latestData.rssi ? Number(data?.latestData.rssi) : undefined}
                        units=" dBm"
                    />
                    <ValueCard
                        icon="solar:volume-loud-line-duotone"
                        title="snr"
                        value={data?.latestData.snr ? Number(data?.latestData.snr) : undefined}
                        units=" dB"
                    />
                </Stack>
            </Grid>
        </Grid>
        )
}
