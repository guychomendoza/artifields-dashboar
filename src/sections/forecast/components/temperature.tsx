import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {getHoursFromEpoch} from "../../../utils/format-number";

const WEATHER_IMAGES = {
    CLOUDS_STORM_RAIN:
        'https://srid7vtf90.ufs.sh/f/B7pTWizqIefFuEh7NndX59NiqZDOKwGaUEbMkIHFPmYLCBsh',
    NIGHT_MOON: 'https://srid7vtf90.ufs.sh/f/B7pTWizqIefFV0W5urUjcl70YCAFJMna8NUu5iSIh3L4s9KO',
    NIGHT_MOON_CLOUDS:
        'https://srid7vtf90.ufs.sh/f/B7pTWizqIefFHH0bBNraBZhU4SsAtFWjHQPvJ7fkwO3ETxND',
    DAY_SUN: 'https://srid7vtf90.ufs.sh/f/B7pTWizqIefFNWb4eKYoDwhs7LirRv6eFbP2yVmQjBulxU8C',
    DAY_CLOUDS: 'https://srid7vtf90.ufs.sh/f/B7pTWizqIefFEQUJB6FxQDtned6qrHNXMlcGRPWTKfC23VSF',
    DAY_CLOUD_SUNLIGHT:
        'https://srid7vtf90.ufs.sh/f/B7pTWizqIefFh5auv0dDs4uS0O5kw7gZicfmeDLWtx9VldBU',
    DAY_SUNSET: 'https://srid7vtf90.ufs.sh/f/B7pTWizqIefF63CMtFv0s5x8Q4aVFIGMnWpY6SvKzygLCrhD',
    LIGHTSTORM: 'https://srid7vtf90.ufs.sh/f/B7pTWizqIefF0yfEX4nmyRzvYd41b08TBwSgZ2tr3DeHOPK7',
    RAIN: 'https://srid7vtf90.ufs.sh/f/B7pTWizqIefFqaU1JRyIUlfSjRCd9EsvohwT78LYagceXi21',
};

const getWeatherImage = (icon: string, code: number) => {
    const isDay = icon.includes("d"); // Check if it's day or night

    // Clear sky
    if (code === 800) {
        return isDay ? WEATHER_IMAGES.DAY_SUN : WEATHER_IMAGES.NIGHT_MOON;
    }

    // Cloudy conditions
    if ([801, 802].includes(code)) {
        return isDay ? WEATHER_IMAGES.DAY_CLOUD_SUNLIGHT : WEATHER_IMAGES.NIGHT_MOON_CLOUDS;
    }

    if ([803, 804].includes(code)) {
        return isDay ? WEATHER_IMAGES.DAY_CLOUDS : WEATHER_IMAGES.NIGHT_MOON_CLOUDS;
    }

    // Thunderstorm (2xx)
    if (code >= 200 && code < 300) {
        return WEATHER_IMAGES.LIGHTSTORM;
    }

    // Drizzle (3xx)
    if (code >= 300 && code < 400) {
        return WEATHER_IMAGES.RAIN;
    }

    // Rain (5xx)
    if (code >= 500 && code < 600) {
        return code >= 520 ? WEATHER_IMAGES.CLOUDS_STORM_RAIN : WEATHER_IMAGES.RAIN;
    }

    // Snow (6xx)
    if (code >= 600 && code < 700) {
        return isDay ? WEATHER_IMAGES.DAY_CLOUDS : WEATHER_IMAGES.NIGHT_MOON_CLOUDS;
    }

    // Atmosphere (Mist, Fog, etc. - 7xx)
    if (code >= 700 && code < 800) {
        return isDay ? WEATHER_IMAGES.DAY_CLOUDS : WEATHER_IMAGES.NIGHT_MOON_CLOUDS;
    }

    // Special case for sunset (around 5PM-6PM)
    const hour = new Date().getHours();
    if (hour >= 17 && hour < 18) {
        return WEATHER_IMAGES.DAY_SUNSET;
    }

    // Default fallback
    return isDay ? WEATHER_IMAGES.DAY_SUN : WEATHER_IMAGES.NIGHT_MOON;
};

type TemperatureProps = {
    currentTemperature: number;
    feelsLike: number;
    iconLink: string;
    code: number;
};

export const Temperature = ({
    currentTemperature,
    feelsLike,
    iconLink,
    code,
}: TemperatureProps) => {
    const backgroundImage = getWeatherImage(iconLink, code);

    return (
        <Card
            sx={{
                width: {
                    xs: '100%',
                    md: '50%',
                },
                height: {
                    xs: '200px',
                    md: 'auto',
                },
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <CardContent sx={{ height: '100%', position: 'relative' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    height="100%"
                >
                    <Stack>
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                            }}
                        >
                            {currentTemperature} °c
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'white',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                            }}
                        >
                            sensación de {feelsLike} °c
                        </Typography>
                    </Stack>
                    <img
                        src={`https://openweathermap.org/img/wn/${iconLink}@2x.png`}
                        alt="icono de clima"
                    />
                </Stack>
            </CardContent>
        </Card>
    );
};
