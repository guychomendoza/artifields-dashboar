import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';

import { type DeviceRead } from 'src/api-requests/type';

import { Iconify } from 'src/components/iconify';

import { MoveDeviceToGroup } from './move-device-to-group';

export const DevicesWithoutGroup = ({
    groups,
    refetch,
}: {
    groups: Record<string, DeviceRead[]>;
    refetch: () => void;
}) => {
    const navigate = useNavigate();
    const [selectedDevice, setSelectedDevice] = useState<DeviceRead | null>(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    if (!groups['Without Group'] || groups['Without Group'].length === 0) return null;

    return (
        <>
            <Typography variant="h6" mt={3}>
                Dispositivos sin grupo
            </Typography>
            <Card
                sx={{
                    mt: 0.5,
                }}
            >
                <CardContent>
                    <List>
                        {Object.keys(groups).map((group) => {
                            if (group !== 'Without Group') return null;
                            const devices = groups[group].sort((a, b) => {
                                // If either name is null, put those at the end
                                if (!a.nombre) return 1;
                                if (!b.nombre) return -1;

                                // Sort alphabetically
                                return a.nombre.localeCompare(b.nombre, undefined, { numeric: true });
                            });
                            return devices.map((device) => (
                                <ListItem
                                    key={device.device_id}
                                    secondaryAction={
                                        <Tooltip title="Asignar a un rancho">
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => {
                                                    setSelectedDevice(device);
                                                    handleOpen();
                                                }}
                                            >
                                                <Iconify
                                                    width={24}
                                                    icon="solar:move-to-folder-bold"
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    <ListItemText
                                        primary={device.nombre || "Sin nombre"}
                                        secondary={device.device_id}
                                        onClick={() => navigate(`/iot/sensor/${device.device_id}`)}
                                        sx={{
                                            cursor: 'pointer',
                                        }}
                                    />
                                </ListItem>
                            ));
                        })}
                    </List>
                </CardContent>
            </Card>

            <MoveDeviceToGroup
                isOpen={open}
                handleClose={handleClose}
                selctedDevice={selectedDevice}
                refetch={refetch}
            />
        </>
    );
};
