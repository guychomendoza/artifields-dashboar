import {useState, type SyntheticEvent} from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import {Iconify} from "../../components/iconify";
import {LogsSensorsView} from "./sensors/logs-sensors-view";
import {a11yProps, CustomTabPanel} from "../../layouts/dashboard/tabs";

// ----------------------------------------------------------------------

export function LogsView() {
    const [value, setValue] = useState(0);
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <DashboardContent>
            <Typography variant="h4">Logs</Typography>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="vistas-disponibles"
                sx={{
                    mt: 3,
                }}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab
                    label="Sensores"
                    {...a11yProps(0)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="hugeicons:chip" />}
                    iconPosition="start"
                />
                <Tab
                    label="WhatsApp"
                    {...a11yProps(1)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="ic:baseline-whatsapp" />}
                    iconPosition="start"
                />
                <Tab
                    label="Reportes"
                    {...a11yProps(2)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="lsicon:report-outline" />}
                    iconPosition="start"
                />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <LogsSensorsView />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <h1>WhatsApp</h1>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <h1>Reportes</h1>
            </CustomTabPanel>
        </DashboardContent>
    );
}
