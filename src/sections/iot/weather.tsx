import type { WeatherData } from 'src/api-requests/type';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useSensor } from 'src/store/sensor';
import { getSensorInfo } from 'src/api-requests/iot';

import { Iconify } from 'src/components/iconify';

export const Weather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const { selectedMeasurement } = useSensor();

    useEffect(() => {
        const fetchCurrentData = async () => {
            if (!selectedMeasurement?.ultimaMedicion.dispositivo_id) return;
            const data = await getSensorInfo(selectedMeasurement?.ultimaMedicion.dispositivo_id);
            if (!data) return;

            const latitude = Number(data.lat);
            const longitude = Number(data.long);

            if (!latitude || !longitude) {
                setWeather(null);
                return;
            }

            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
            if (!apiKey) return;

            const weatherResponse = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`
            );

            if (!weatherResponse.ok) {
                console.error('Failed to fetch weather data');
                return null;
            }

            const weatherData = (await weatherResponse.json()) as WeatherData;
            setWeather(weatherData);
        };
        fetchCurrentData();
    }, [selectedMeasurement]);

    if (!weather)
        return (
            <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    height: {
                        xs: 'auto',
                        lg: '100%',
                    },
                }}
            >
                <Iconify icon="solar:cloud-bold-duotone" fontSize="large" />
                <Typography variant="body1">Sin datos por mostrar</Typography>
            </Stack>
        );

    return (
        <>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    height: {
                        xs: 'auto',
                        lg: '100%',
                    },
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                    }}
                >
                    <CardHeader
                        title="Temperatura"
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                        titleTypographyProps={{
                            variant: 'body1',
                            fontWeight: 'medium',
                        }}
                    />

                    <CardContent
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                    >
                        <Typography variant="h6">
                            {weather?.current?.temp_c}{' '}
                            <Typography variant="body2" color="textSecondary" component="span">
                                °C
                            </Typography>
                        </Typography>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        width: '100%',
                    }}
                >
                    <CardHeader
                        title="Velocidad del Viento"
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                        titleTypographyProps={{
                            variant: 'body1',
                            fontWeight: 'medium',
                        }}
                    />

                    <CardContent
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                    >
                        <Typography variant="h6">
                            {weather?.current?.wind_kph}{' '}
                            <Typography variant="body2" color="textSecondary" component="span">
                                kph
                            </Typography>
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    height: {
                        xs: 'auto',
                        lg: '100%',
                    },
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                    }}
                >
                    <CardHeader
                        title="UV"
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                        titleTypographyProps={{
                            variant: 'body1',
                            fontWeight: 'medium',
                        }}
                    />

                    <CardContent
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                    >
                        <Typography variant="h6">{weather?.current?.uv}</Typography>

                        {/* <Typography variant="body2" color="textSecondary">
                                hola
                            </Typography> */}
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        width: '100%',
                    }}
                >
                    <CardHeader
                        title="Humedad"
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                        titleTypographyProps={{
                            variant: 'body1',
                            fontWeight: 'medium',
                        }}
                    />

                    <CardContent
                        sx={{
                            padding: 1.5,
                            paddingBottom: 0,
                        }}
                    >
                        <Typography variant="h6">{weather?.current?.humidity}</Typography>

                        {/* <Typography variant="body2" color="textSecondary">
                                °C
                            </Typography> */}
                    </CardContent>
                </Card>
            </Stack>
        </>
    );
};
