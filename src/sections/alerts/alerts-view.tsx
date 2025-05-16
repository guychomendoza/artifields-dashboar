import Typography from "@mui/material/Typography";

import {DashboardContent} from "../../layouts/dashboard";
import {NewAlertForm} from "./components/new-alert-form";
import {AlertDisplay} from "../../layouts/alert/alerts-display";

export function AlertsView() {
    return (
        <DashboardContent>
            <AlertDisplay />
            <Typography variant="h4">Alerts</Typography>
            <NewAlertForm />
        </DashboardContent>
    );
}