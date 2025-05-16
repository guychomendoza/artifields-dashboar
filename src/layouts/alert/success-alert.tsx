import Alert from "@mui/material/Alert";

import {Iconify} from "../../components/iconify";

export const SuccessAlert = ({
    message = "Lo sentimos, ha ocurrido un error"
}: { message?: string }) => (
    <Alert
        severity="success"
        icon={<Iconify icon="solar:check-circle-bold-duotone" />}
        sx={{ mt: 1 }}
    >
        {message}
    </Alert>
)