import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"

import {getHoursFromEpoch} from "../../../utils/format-number";

type HourlyForecastCardProps = {
    timeEpoch: number,
    iconLink: string,
    temperature: number,
    precipitation: number,
    windSpeed: number,
}

export const HourlyForecastCard = ({
    timeEpoch,
    iconLink,
    temperature,
    precipitation,
    windSpeed,
}: HourlyForecastCardProps) => {

    const formattedDate = getHoursFromEpoch(timeEpoch);

    return (
        <Card>
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="body2" color="textSecondary" mb={2}>{formattedDate}</Typography>
                <img
                    src={iconLink}
                    alt="icono de clima"
                />
                <Typography variant="h4" mt={2}>{temperature}°C</Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>{precipitation} mm/h</Typography>
                <Typography variant="body2" color="textSecondary">{windSpeed} mph</Typography>
            </CardContent>
        </Card>
        )
}