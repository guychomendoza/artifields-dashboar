import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';

import { type DeviceRead } from 'src/api-requests/type';
import { moveDeviceToGroup } from 'src/api-requests/iot';

import { Iconify } from 'src/components/iconify';

import { AssignCoordinatesRanch } from './assign-coordinates-ranch';

export const Groups = ({
    groups,
    refetch,
}: {
    groups: Record<string, DeviceRead[]>;
    refetch: () => void;
}) => {
    const navigate = useNavigate();

    const handleMove = async (deviceId: string) => {
        const success = await moveDeviceToGroup(deviceId, null, null);

        if (success) {
            refetch();
        }
    };

    return (
        <>
            <Typography variant="h6" mt={3}>
                Dispositivos
            </Typography>
            <Grid container mt={0.5} spacing={2}>
                {Object.keys(groups).map((group) => {
                    if (group === 'Without Group') return null;
                    const devices = groups[group].sort((a, b) => {
                        // If either name is null, put those at the end
                        if (!a.nombre) return 1;
                        if (!b.nombre) return -1;

                        // Sort alphabetically
                        return a.nombre.localeCompare(b.nombre, undefined, { numeric: true });
                    });
                    return (
                        <Grid item xs={12} md={6} xl={4} key={crypto.randomUUID()}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="h6">{group}</Typography>
                                        <AssignCoordinatesRanch devices={devices}/>
                                    </Stack>
                                    <List>
                                        {devices.map((device) => (
                                            <ListItem
                                                key={crypto.randomUUID()}
                                                secondaryAction={
                                                    <Tooltip title="Quitar del rancho">
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                handleMove(device.device_id);
                                                            }}
                                                        >
                                                            <Iconify
                                                                width={24}
                                                                icon="solar:remove-folder-bold"
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            >
                                                <ListItemText
                                                    onClick={() =>
                                                        navigate(`/iot/sensor/${device.device_id}`)
                                                    }
                                                    primary={device.nombre || "Sin nombre"}
                                                    secondary={device.device_id}
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
