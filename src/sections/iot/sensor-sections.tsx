import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';

import { Iconify } from 'src/components/iconify';

import { DeviceAnalytics } from './device-analytics';
import { SensorDashboard } from './sensor-dashboard';

export const SensorSections = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="vistas-disponibles"
                sx={{
                    mt: 3,
                }}
            >
                <Tab
                    label="dashboard"
                    {...a11yProps(0)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:code-scan-bold" />}
                    iconPosition="start"
                />
                <Tab
                    label="Historial"
                    {...a11yProps(1)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:graph-bold" />}
                    iconPosition="start"
                />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <SensorDashboard />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <DeviceAnalytics />
            </CustomTabPanel>
        </>
    );
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vista-${index}`}
            aria-labelledby={`vista-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
        </div>
    );
}
