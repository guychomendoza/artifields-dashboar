import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from '../../../components/iconify';
import { SoilMoistureCard } from './soil-moisture-card';

import type { ClusterSensor } from '../../../api-requests/ranches/schema';

type ClusterCardProps = {
    name: string | null;
    sensors: ClusterSensor[];
};

export const ClusterCard = ({ name, sensors }: ClusterCardProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Card
            sx={{
                p: 1,
                mb: 2,
                borderRadius: 3,
                border: '1px dashed',
                borderColor: 'rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0.5)',
                boxShadow: '0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Iconify icon="uim:object-group" />
                </Avatar>
                <Typography variant="h6">{name || 'Parcela sin nombre'}</Typography>
            </Stack>
            <Grid container spacing={isMobile ? 1 : 2}>
                {
                    sensors.length === 0 || sensors.every((s) => s?.info === null && s?.lastMeasurement === null) && (
                        <Box sx={{ py: 2, px: 3 }}>
                            <Typography variant="caption">Parcela sin sensores</Typography>
                        </Box>
                    )
                }
                {sensors.map((sensor) => {
                    if (!sensor?.info || !sensor?.lastMeasurement) return;

                    return (
                        <Grid item xs={6} key={sensor?.info?.deviceId}>
                            <Link
                                to={`/iot/sensor/${sensor?.info?.deviceId}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <SoilMoistureCard
                                    soilMoisture={sensor?.lastMeasurement?.soilMoisture}
                                    name={sensor?.info?.name || 'Sin nombre'}
                                    lastMeasurement={sensor?.lastMeasurement?.timestamp}
                                    deviceId={sensor?.info?.deviceId}
                                    bottomLimit={sensor?.info?.bottomLimit}
                                    topLimit={sensor?.info?.topLimit}
                                    desiredValue={sensor?.info?.idalCapacity}
                                />
                            </Link>
                        </Grid>
                    );
                })}
            </Grid>
        </Card>
    );
};
