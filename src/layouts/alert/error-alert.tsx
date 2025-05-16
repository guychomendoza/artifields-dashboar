import Alert from "@mui/material/Alert";

import {Iconify} from "../../components/iconify";

export const ErrorAlert = ({
    message = "Lo sentimos, ha ocurrido un error"
}: { message?: string }) => (
    <Alert
        severity="error"
        icon={<Iconify icon="solar:shield-warning-bold-duotone" />}
        sx={{ mt: 1 }}
    >
        {message}
    </Alert>
)