import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"

import { useRouter } from "../../../../routes/hooks"
import { formatTimestampDistance } from "../../../../utils/format-time"

import type { StationWithLatestData } from "../../../../api-requests/type"

type StationCardProps = {
    station: StationWithLatestData;
    idx: number;
    totalStations: number;
}

export const StationCard = ({ station, idx, totalStations }: StationCardProps) => {
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`/weather-stations/${station.devEui}`)
    }

    // All metrics to display
    const allMetrics = [
        { label: "Temp", value: `${station.latestMeasurement.temperature}°C` },
        { label: "Hum", value: `${station.latestMeasurement.humidity}%` },
        { label: "Presión", value: station.latestMeasurement.pressure },
        { label: "Luz", value: station.latestMeasurement.light },
        { label: "UV", value: station.latestMeasurement.uv },
        { label: "Vel viento", value: station.latestMeasurement.windSpeed },
        { label: "Dir viento", value: station.latestMeasurement.windDirection },
        { label: "Lluvia", value: station.latestMeasurement.rainfall },
        { label: "RSSI", value: station.latestMeasurement.rssi },
        { label: "SNR", value: station.latestMeasurement.snr },
        { label: "Últ. Act.", value: formatTimestampDistance(station.latestMeasurement.timestamp) },
    ]

    const isFirst = idx === 0
    const isLast = idx === totalStations - 1

    return (
        <Card
            sx={{
                borderRadius: 0,
                cursor: "pointer",
                backgroundColor: idx % 2 === 0 ? "rgba(255,255,255)" : "rgba(250,250,250)",
                borderTopLeftRadius: isFirst ? "12px" : 0,
                borderTopRightRadius: isFirst ? "12px" : 0,
                borderBottomLeftRadius: isLast ? "12px" : 0,
                borderBottomRightRadius: isLast ? "12px" : 0,
            }}
            onClick={handleCardClick}
        >
            <CardHeader
                title={
                    <Typography variant="subtitle1" noWrap>
                        {station.deviceName}
                    </Typography>
                }
                subheader={
                    <Typography variant="caption" noWrap>
                        {station.grupoName} • {station.devEui}
                    </Typography>
                }
                sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0, pb: 1, px: 3, "&:last-child": { pb: 1 } }}>
                <Grid container spacing={1}>
                    {allMetrics.map((metric) => (
                        <Grid item xs={4} key={metric.label}>
                            <Box
                                sx={{
                                    mb: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                                    {metric.label}
                                </Typography>
                                <Typography variant="body2" fontWeight="medium" noWrap sx={{ fontSize: "0.8rem" }}>
                                    {metric.value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}