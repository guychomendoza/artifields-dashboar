import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { MapSensorsView } from './map-sensors-view';
import { UserRanchDrawer } from '../user-ranch-drawer';
import { useAuth } from '../../../context/AuthContext';
import { StationsView } from '../stations/stations-view';
import { UserDevicesTable } from '../user-devices-table';
import { RanchesGrid } from '../../ranches/components/ranches-grid';
import { getUserRanches } from '../../../api-requests/ranches/user-ranches';

export const AssignedSensorsView = () => {
    const { userData } = useAuth();
    const [value, setValue] = useState(0);

    const { data: userRanches } = useQuery({
        queryKey: ['user-ranches', userData?.id],
        queryFn: () => getUserRanches(userData?.id),
        enabled: !!userData?.id,
    });

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <DashboardContent>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h4">Mis dispositivos</Typography>
                <UserRanchDrawer />
            </Stack>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="vistas-disponibles"
                sx={{
                    mt: 3,
                }}
                scrollButtons="auto"
                variant="scrollable"
            >
                <Tab
                    label="Mapa"
                    {...a11yProps(0)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:map-line-duotone" />}
                    iconPosition="start"
                />
                <Tab
                    label="Todos"
                    {...a11yProps(1)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:layers-minimalistic-bold-duotone" />}
                    iconPosition="start"
                />
                <Tab
                    label="Estaciones"
                    {...a11yProps(2)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:station-bold-duotone" />}
                    iconPosition="start"
                />
                {userRanches?.map((ranch, idx) => (
                    <Tab
                        key={ranch.id}
                        label={ranch.name}
                        {...a11yProps(idx + 3)} // Offset by static tabs
                        sx={{
                            borderRadius: 1,
                            marginBottom: 0.5,
                            display: {
                                xs: 'none',
                                sm: 'block',
                            },
                        }}
                        icon={<Iconify icon="solar:home-bold-duotone" />}
                        iconPosition="start"
                    />
                ))}
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <MapSensorsView />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <UserDevicesTable />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <StationsView />
            </CustomTabPanel>
            {userRanches?.map((ranch, idx) => (
                <CustomTabPanel key={ranch.id} value={value} index={idx + 3}>
                    <RanchesGrid ranchId={ranch.id} isContentOnTab />
                </CustomTabPanel>
            ))}
        </DashboardContent>
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
