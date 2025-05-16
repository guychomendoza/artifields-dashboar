import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { RegisterUser } from '../register-user';
import { PreRegisterUser } from '../pre-register-user';

export const UsersView = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <DashboardContent>
            <Typography variant="h4">Usuarios</Typography>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="vistas-disponibles"
                sx={{
                    mt: 3,
                }}
            >
                <Tab
                    label="Nuevo"
                    {...a11yProps(0)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:user-plus-bold-duotone" />}
                    iconPosition="start"
                />
                <Tab
                    label="Invitar"
                    {...a11yProps(1)}
                    sx={{ borderRadius: 1, marginBottom: 0.5 }}
                    icon={<Iconify icon="solar:file-right-broken" />}
                    iconPosition="start"
                />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
                <RegisterUser />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <PreRegisterUser />
            </CustomTabPanel>
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
