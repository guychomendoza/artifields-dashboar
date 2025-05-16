import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useSensor } from 'src/store/sensor';

import { Iconify } from 'src/components/iconify';

import { Weather } from './weather';
import { SensorMap } from './sensor-map';
import { SoilMoisture } from './soil-moisture';
import { AnalyticsCard } from './analytics-card';
import {SoilTemperature} from './soil-temperature';

const minTemp = -20;
const maxTemp = 50;

export const SensorDashboard = () => {
    const { selectedMeasurement } = useSensor();

    const getPercentage = (value: string | undefined) => {
        const numericValue = Number(value);

        // If value is not a valid number, return 0
        if (!numericValue && numericValue !== 0) {
            return 0;
        }

        // Clamp value between min and max
        const clampedValue = Math.max(minTemp, Math.min(numericValue, maxTemp));

        // Scale value to a percentage between 0 and 100
        return ((clampedValue - minTemp) / (maxTemp - minTemp)) * 100;
    };

    return (
        <Stack
            direction={{
                xs: 'column',
                lg: 'row',
            }}
            spacing={2}
            sx={{
                minHeight: '45rem',
                height: {
                    xs: 'auto',
                    lg: 'calc(100vh - 19rem)',
                },
            }}
        >
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    width: {
                        xs: '100%',
                        lg: '50%',
                    },
                    height: '100%',
                }}
            >
                <Stack
                    sx={{
                        width: '100%',
                        height: {
                            xs: 'auto',
                            lg: '60%',
                        },
                    }}
                    direction="column"
                    spacing={1}
                >
                    <Typography variant="h6">Datos del sensor</Typography>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            width: '100%',
                            height: {
                                xs: 'auto',
                                lg: '60%',
                            },
                        }}
                    >
                        <SoilMoisture />

                        <SoilTemperature
                            title="Temperatura del Suelo"
                            colors={['#0b2af1', '#f1ee0b', '#f10b0b']}
                            percent={getPercentage(
                                selectedMeasurement?.ultimaMedicion.temperatura_suelo
                            )}
                            formatTextValue={() =>
                                `${selectedMeasurement?.ultimaMedicion.temperatura_suelo}°C`
                            }
                            temperature={
                                selectedMeasurement?.ultimaMedicion.temperatura_suelo || '0'
                            }
                            icon={<Iconify icon="solar:sun-2-line-duotone" />}
                        />
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            width: '100%',
                            height: {
                                xs: 'auto',
                                lg: '40%',
                            },
                        }}
                    >
                        <AnalyticsCard
                            title="Conductividad del Suelo"
                            value={Number(selectedMeasurement?.ultimaMedicion.conductividad_suelo)}
                            units="uS/cm"
                            icon={<Iconify icon="solar:bolt-bold-duotone" />}
                        />

                        <AnalyticsCard
                            title="Batería"
                            value={Number(selectedMeasurement?.ultimaMedicion.bateria)}
                            icon={<Iconify icon="solar:battery-charge-minimalistic-bold-duotone" />}
                            units="%"
                        />
                    </Stack>
                </Stack>

                <Stack
                    direction="column"
                    spacing={1}
                    padding={1}
                    sx={{
                        width: '100%',
                        height: {
                            xs: 'auto',
                            lg: '40%',
                        },
                        backgroundColor: (theme) => theme.palette.grey[200],
                        borderRadius: 3,
                        border: '1px dashed',
                        borderColor: (theme) => theme.palette.grey[300],
                    }}
                >
                    <Typography variant="h6">Clima</Typography>
                    <Weather />
                </Stack>
            </Stack>

            <SensorMap />
        </Stack>
    );
};
