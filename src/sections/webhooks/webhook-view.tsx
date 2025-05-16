import Typography from "@mui/material/Typography";

import {DashboardContent} from "../../layouts/dashboard";
import {WebhooksTable} from "./components/webhooks-table";

export function WebhookView() {
    return (
        <DashboardContent>
            <Typography variant="h4">Webhooks</Typography>
            <WebhooksTable />
        </DashboardContent>
    );
}