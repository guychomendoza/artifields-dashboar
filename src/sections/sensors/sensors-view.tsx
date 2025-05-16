import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from '../../components/iconify';
import { RanchesView } from './ranches/ranches-view';
import { ClusterView } from './clusters/cluster-view';
import { DevicesTableView } from './devices/devices-table-view';
import { a11yProps, CustomTabPanel } from '../../layouts/dashboard/tabs';
import { WeatherStationsView } from './weather-stations/weather-stations-view';

export const SensorsView = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <DashboardContent>
            <Typography variant="h4">Sensores</Typography>
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
                    label="Dispositivos"
                    {...a11yProps(0)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:devices-bold-duotone" />}
                    iconPosition="start"
                />
                <Tab
                    label="Ranchos"
                    {...a11yProps(1)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:home-bold-duotone" />}
                    iconPosition="start"
                />
                <Tab
                    label="Estaciones Meteorológicas"
                    {...a11yProps(2)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:cloud-sun-bold-duotone" />}
                    iconPosition="start"
                />
                <Tab
                    label="Parcelas"
                    {...a11yProps(3)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="uim:layer-group" />}
                    iconPosition="start"
                />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <DevicesTableView />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <RanchesView />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <WeatherStationsView />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <ClusterView />
            </CustomTabPanel>
        </DashboardContent>
    );
};
