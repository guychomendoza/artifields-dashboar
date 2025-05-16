import Card from "@mui/material/Card"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"

import {Iconify} from "../../../components/iconify";

type GeneralStatsProps = {
    minTemp: number;
    windSpeed: number;
    humidity: number;
    maxTemp: number;
    clouds: number;
    visibility: number;
}

export const GeneralStats = ({
    minTemp,
    windSpeed,
    humidity,
    maxTemp,
    clouds,
    visibility,
}: GeneralStatsProps) => (
    <Card
        sx={{
            width: {
                xs: "100%",
                md: "50%",
            }
        }}
    >
        <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2} width={{xs: "100%", md: "50%"}}>
                    <Iconify icon="solar:sun-2-bold-duotone" width={28} color="#1877F2" />
                    <Stack direction="column" spacing={0}>
                        <Typography variant="body2" component="div">Min Temp</Typography>
                        <Typography variant="subtitle1" component="div">{minTemp} °c</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} width={{xs: "100%", md: "50%"}} mt={{ xs: 2, md: 0 }}>
                    <Iconify icon="solar:sun-2-bold-duotone" width={28} color="#1877F2" />
                    <Stack direction="column" spacing={0}>
                        <Typography variant="body2" component="div">Max Temp</Typography>
                        <Typography variant="subtitle1" component="div">{maxTemp} °c</Typography>
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems="center" mt={2}>
                <Stack direction="row" alignItems="center" spacing={2} width={{xs: "100%", md: "50%"}}>
                    <Iconify icon="solar:spedometer-low-bold-duotone" width={28} color="#1877F2" />
                    <Stack direction="column" spacing={0}>
                        <Typography variant="body2" component="div">Humedad</Typography>
                        <Typography variant="subtitle1" component="div">{humidity} %</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} width={{xs: "100%", md: "50%"}} mt={{ xs: 2, md: 0 }}>
                    <Iconify icon="solar:wind-line-duotone" width={28} color="#1877F2" />
                    <Stack direction="column" spacing={0}>
                        <Typography variant="body2" component="div">Viento</Typography>
                        <Typography variant="subtitle1" component="div">{windSpeed} kph</Typography>
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} alignItems="center" mt={2}>
                <Stack direction="row" alignItems="center" spacing={2} width={{xs: "100%", md: "50%"}}>
                    <Iconify icon="solar:cloud-bold-duotone" width={28} color="#1877F2" />
                    <Stack direction="column" spacing={0}>
                        <Typography variant="body2" component="div">Nubes</Typography>
                        <Typography variant="subtitle1" component="div">{clouds} %</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} width={{xs: "100%", md: "50%"}} mt={{ xs: 2, md: 0 }}>
                    <Iconify icon="solar:eye-bold-duotone" width={28} color="#1877F2" />
                    <Stack direction="column" spacing={0}>
                        <Typography variant="body2" component="div">Visibilidad</Typography>
                        <Typography variant="subtitle1" component="div">{visibility} km</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </CardContent>
    </Card>
)