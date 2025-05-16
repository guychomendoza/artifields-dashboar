import { useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Temperature } from './components/temperature';
import { GeneralStats } from './components/general-stats';
import { ErrorAlert } from '../../layouts/alert/error-alert';
import { WeatherSkeleton } from './components/weather-skeleton';
import { getUserLocation } from '../../api-requests/users/weather';
import { DaysForecastCard } from './components/days-forecast-card';
import {
    getUserCurrentWeatherInfo,
    getUserCurrentWeatherInfoForecast,
} from '../../api-requests/weather/user-weather';


interface WeatherGroupedByDate {
    [date: string]: {
        temp_min: number;
        temp_max: number;
    };
}

export function ForecastView() {
    const {
        data: location,
        isLoading: isLoadingLocation,
        isError: isLocationError,
        error: errorLocation,
    } = useQuery({
        queryKey: ['user-lat-long'],
        queryFn: getUserLocation,
    });

    const {
        data: openWeatherData,
        isLoading: isLoadingOpenWeatherData,
        isError: isOpenWeatherError,
        error: openWeatherError,
    } = useQuery({
        queryKey: ['open-weather-info'],
        queryFn: () => getUserCurrentWeatherInfo(location?.latitude || 0, location?.longitude || 0),
        enabled: !!location?.latitude && !!location?.longitude,
    });

    const {
        data: openWeatherForecast,
        isLoading: isLoadingForecast,
        isError: isForecastError,
        error: forecastError,
    } = useQuery({
        queryKey: ['open-weather-forecast'],
        queryFn: () =>
            getUserCurrentWeatherInfoForecast(location?.latitude || 0, location?.longitude || 0),
        enabled: !!location?.latitude && !!location?.longitude,
    });

    if (isLoadingLocation || isLoadingOpenWeatherData || isLoadingForecast) {
        return (
            <DashboardContent>
                <Typography variant="h4">Clima</Typography>
                <WeatherSkeleton />
            </DashboardContent>
        );
    }

    if (isLocationError) {
        return (
            <DashboardContent>
                <Typography variant="h4">Clima</Typography>
                <ErrorAlert message={errorLocation.message} />
            </DashboardContent>
        );
    }

    if (isOpenWeatherError) {
        return (
            <DashboardContent>
                <Typography variant="h4">Clima</Typography>
                <ErrorAlert message={openWeatherError.message} />
            </DashboardContent>
        );
    }

    if (isForecastError) {
        return (
            <DashboardContent>
                <Typography variant="h4">Clima</Typography>
                <ErrorAlert message={forecastError.message} />
            </DashboardContent>
        );
    }

    if (!openWeatherData || !openWeatherForecast) {
        return (
            <DashboardContent>
                <Typography variant="h4">Clima</Typography>
                <ErrorAlert message="Sin datos" />
            </DashboardContent>
        );
    }

    const visibilityOnKM = openWeatherData.visibility / 1000;
    const minTempsByDays = openWeatherForecast?.list.reduce<WeatherGroupedByDate>((acc, item) => {
        const date = item.dt_txt.split(' ')[0]; // Get the date part ("YYYY-MM-DD")
        if (!acc[date]) {
            acc[date] = {
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
            };
        } else {
            acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
            acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
        }
        return acc;
    }, {} as WeatherGroupedByDate);

    return (
        <DashboardContent>
            <Typography variant="h4">Clima</Typography>
            <Typography variant="subtitle2" component="div">
                {openWeatherData?.name}, {openWeatherData?.sys.country}
            </Typography>

            <Stack
                direction={{
                    xs: 'column',
                    md: 'row',
                }}
                spacing={2}
                mt={2}
            >
                <Temperature
                    currentTemperature={openWeatherData?.main.temp}
                    feelsLike={openWeatherData?.main.feels_like}
                    iconLink={openWeatherData?.weather[0]?.icon}
                    code={openWeatherData?.weather[0].id}
                />
                <GeneralStats
                    minTemp={openWeatherData.main.temp_min}
                    windSpeed={openWeatherData?.wind.speed}
                    humidity={openWeatherData?.main.humidity}
                    maxTemp={openWeatherData.main.temp_max}
                    clouds={openWeatherData?.clouds.all}
                    visibility={visibilityOnKM || 0}
                />
            </Stack>

            <Grid container spacing={2} mt={1}>
                {minTempsByDays &&
                    Object.keys(minTempsByDays).map((date) => (
                        <Grid item xs={12} md={4} key={crypto.randomUUID()}>
                            <DaysForecastCard
                                date={date}
                                maxTemp={minTempsByDays[date].temp_max}
                                minTemp={minTempsByDays[date].temp_min}
                            />
                        </Grid>
                    ))}
            </Grid>
        </DashboardContent>
    );
}