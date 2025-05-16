import { format } from "date-fns";
import { es } from "date-fns/locale";

import Card from "@mui/material/Card";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import { Iconify } from "../../../components/iconify";

type DaysForecastCardProps = {
    date: string;
    maxTemp: number;
    minTemp: number;
};

export const DaysForecastCard = ({ date, maxTemp, minTemp }: DaysForecastCardProps) => {
    const formattedDate = format(new Date(date), "eeee, d MMM", { locale: es });

    return (
        <Card sx={{ width: "100%", textAlign: "center", borderRadius: 2 }}>
            <CardContent>
                <Typography variant="h6" color="text.primary" mb={2} textTransform="capitalize">
                    {formattedDate}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", gap: 1, width: "100%", }}>
                    <Stack direction="row" spacing={2}>
                        <Iconify icon="solar:snowflake-bold-duotone" width={28} color="#00AEEF" />
                        <Stack direction="row" spacing={2}>
                            <Typography variant="body2" color="textSecondary">Temperatura Mín</Typography>
                            <Typography variant="subtitle1">{minTemp}°C</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Iconify icon="solar:sun-2-bold-duotone" width={28} color="#FF9800" />
                        <Stack direction="row" spacing={2}>
                            <Typography variant="body2" color="textSecondary">Temperatura Máx</Typography>
                            <Typography variant="subtitle1">{maxTemp}°C</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};
