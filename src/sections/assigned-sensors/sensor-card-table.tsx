import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { getRelativeColor } from '../../utils/table';
import { formatTimestampDistance } from '../../utils/format-time';

import type { UserSensorItemLastMeasurement } from '../../api-requests/sensors/schema';

export const SensorCardTable = ({
    sensor,
    idx,
    onCardClick,
}: {
    sensor: UserSensorItemLastMeasurement;
    idx: number;
    onCardClick: () => void;
}) => {
    // Metrics to display in card
    const metrics = [
        {
            label: 'Humedad',
            value: sensor.lastMeasurement.soilWater
                ? `${sensor.lastMeasurement.soilWater}%`
                : 'sin información',
        },
        {
            label: 'Conductividad',
            value: sensor.lastMeasurement.soilConductivity
                ? `${sensor.lastMeasurement.soilConductivity}µS/cm`
                : 'sin información',
        },
        {
            label: 'Temperatura',
            value: sensor.lastMeasurement.soilTemperature
                ? `${sensor.lastMeasurement.soilTemperature}°C`
                : 'sin información',
        },
        {
            label: 'Batería',
            value: sensor.lastMeasurement.battery
                ? `${sensor.lastMeasurement.battery}V`
                : 'sin información',
        },
        { label: 'Última Act.', value: formatTimestampDistance(sensor.lastMeasurement.timestamp) },
    ];

    return (
        <Card
            sx={{
                borderRadius: 0,
                cursor: 'pointer',
                backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255)' : 'rgba(250,250,250)',
            }}
            onClick={onCardClick}
        >
            <CardHeader
                title={
                    <Typography variant="subtitle1" noWrap>
                        {sensor.deviceName || 'Sin nombre'}
                    </Typography>
                }
                subheader={
                    <Typography variant="caption" noWrap>
                        {sensor.groupName || 'Sin grupo asignado'}
                    </Typography>
                }
                sx={{ pb: 1 }}
                action={
                    <Box
                        sx={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: getRelativeColor(sensor.lastMeasurement.timestamp),
                            mt: 2,
                            mr: 1,
                        }}
                    />
                }
            />
            <CardContent sx={{ pt: 0, pb: 1, px: 3, '&:last-child': { pb: 1 } }}>
                <Grid container spacing={1}>
                    {metrics.map((metric) => (
                        <Grid item xs={6} key={metric.label}>
                            <Box
                                sx={{
                                    mb: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.7rem' }}
                                >
                                    {metric.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    noWrap
                                    sx={{ fontSize: '0.8rem' }}
                                >
                                    {metric.value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};