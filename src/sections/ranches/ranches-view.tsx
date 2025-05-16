import {z} from "zod";
import {useParams, useSearchParams} from "react-router-dom";

import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";

import { DashboardContent } from 'src/layouts/dashboard';

import {useRouter} from "../../routes/hooks";
import {Iconify} from "../../components/iconify";
import {RanchesGrid} from "./components/ranches-grid";


export const RanchesView = () => {
    const { ranchName } = useParams();
    const router = useRouter();

    const [searchParams] = useSearchParams();
    const name = searchParams.get("name"); // "hola"

    const numberSchema = z.string().transform((val) => parseFloat(val));
    const ranchIdParse = numberSchema.safeParse(ranchName)

    if (!ranchName || !ranchIdParse.success) {
        return null;
    }

    return (
        <DashboardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton aria-label="regresar" onClick={() => router.back()}>
                    <Iconify icon="solar:alt-arrow-left-line-duotone" width={24} />
                </IconButton>
                <Typography variant="h4">{name ? `Rancho ${name}` : "Rancho"}</Typography>
            </Stack>
            <RanchesGrid ranchId={ranchIdParse.data} />
        </DashboardContent>
    );
}