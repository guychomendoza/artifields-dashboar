import type { Dispatch, SetStateAction } from 'react';

import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from '../../../../components/iconify';
import { removeSensorFromRanch } from '../../../../api-requests/ranches/admin-ranches';

import type {
    RanchWithSensors,
    RanchWithoutSensors,
} from '../../../../api-requests/ranches/schema';

type RanchesCardProps = {
    ranch: RanchWithSensors;
    setSelectedRanch: Dispatch<SetStateAction<RanchWithoutSensors|null>>;
    refetchRanchesWithSensors: () => void;
    refetchSensorsWithoutRanches: () => void;
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
};

export const RanchCard = ({
    ranch,
    setSelectedRanch,
    refetchRanchesWithSensors,
    refetchSensorsWithoutRanches,
    setIsDrawerOpen
}: RanchesCardProps) => {
    const { sensors, ...ranchInfo } = ranch;
    const mutate = useMutation({
        mutationFn: ({ sensorId }: { sensorId: number }) => removeSensorFromRanch(sensorId),
        onSuccess: () => {
            refetchRanchesWithSensors();
            refetchSensorsWithoutRanches();
        },
    });

    const navigate = useNavigate();

    const sortedSensors = sensors.sort((a, b) => {
        // If either name is null, put those at the end
        if (!a.name) return 1;
        if (!b.name) return -1;

        // Sort alphabetically
        return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return (
        <Card sx={{ height: "100%" }}>
            <CardHeader
                title={ranch.name || 'Sin nombre'}
                action={
                    <IconButton
                        onClick={() => {
                            setSelectedRanch(ranchInfo);
                            setIsDrawerOpen(true);
                        }}
                    >
                        <Iconify icon="solar:pen-bold-duotone" />
                    </IconButton>
                }
            />
            <CardContent>
                {sortedSensors.length === 0 && (
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                        mt={2}
                    >
                        <Iconify icon="duo-icons:chip" width={25} />
                        <Typography variant="caption">Sin sensores</Typography>
                    </Stack>
                )}
                <List>
                    {sortedSensors.map((sensor) => (
                        <ListItem
                            key={sensor.id}
                            secondaryAction={
                                <Tooltip title="Quitar del rancho">
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => mutate.mutate({ sensorId: sensor.id })}
                                    >
                                        <Iconify
                                            width={24}
                                            icon="solar:remove-folder-bold-duotone"
                                        />
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemText
                                onClick={() => navigate(`/iot/sensor/${sensor.deviceId}`)}
                                primary={sensor.name || 'Sin nombre'}
                                secondary={sensor.deviceId}
                                sx={{ cursor: 'pointer' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};
