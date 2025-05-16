import type { SensorWithColor } from 'src/api-requests/type';

import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { SoilMoistureCard } from './soil-moisture-card';

export const UserSensors = ({ sensors }: { sensors: SensorWithColor[] }) => {
    if (!sensors.length)
        return (
            <Typography variant="h6" mt={3}>
                No tienes sensores asignados
            </Typography>
        );

    return (
        <Grid
            item
            xs={12}
            md={6}
            sx={{
                height: '100%',
                overflowY: 'auto',
            }}
        >
            {' '}
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'error.main',
                    color: 'white',
                    borderRadius: '16px',
                    px: 1,
                    py: 0.5,
                    gap: 0.5,
                    mb: 1
                }}
            >
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        animation: 'pulse 1.5s infinite',
                        '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 },
                        },
                    }}
                />
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    En vivo
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {sensors.map((sensor) => (
                    <Grid item key={sensor.device_id} padding={1} xs={6} sm={4} md={6}>
                        <Link
                            to={`/iot/sensor/${sensor.device_id}`}
                            style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                        >
                            <SoilMoistureCard
                                bottomLimit={
                                    sensor?.limite_inferior ? String(sensor?.limite_inferior) : null
                                }
                                topLimit={
                                    sensor?.limite_superior ? String(sensor?.limite_superior) : null
                                }
                                soilMoisture={sensor?.last_measurement?.agua_suelo}
                                lastMeasurement={sensor.last_measurement.timestamp}
                                name={sensor?.nombre}
                                desiredValue={sensor?.capacidadIdeal}
                                deviceId={sensor.device_id}
                            />
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};
