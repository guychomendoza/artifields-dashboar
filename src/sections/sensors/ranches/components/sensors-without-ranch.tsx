import type {Dispatch, SetStateAction} from "react";

import {useNavigate} from "react-router-dom";

import Card from "@mui/material/Card";
import List from "@mui/material/List";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import ListItemText from "@mui/material/ListItemText";

import {Iconify} from "../../../../components/iconify";

import type {SensorWithNoRanch} from "../../../../api-requests/ranches/schema";

type SensorsWithoutRanchProps = {
    sensors: SensorWithNoRanch[],
    setSensorToAssign: Dispatch<SetStateAction<{id: number, name: string}|null>>,
    setIsAssignSensorDrawerOpen: Dispatch<SetStateAction<boolean>>
}

export const SensorsWithoutRanch = ({
    sensors,
    setSensorToAssign,
    setIsAssignSensorDrawerOpen,
}: SensorsWithoutRanchProps) => {
    const navigate = useNavigate();

    const sortedSensors = sensors.sort((a, b) => {
        // If either name is null, put those at the end
        if (!a.name) return 1;
        if (!b.name) return -1;

        // Sort alphabetically
        return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return (
        <Card>
            <CardHeader title="Sensores sin rancho"/>
            <CardContent>
                <List>
                    {sortedSensors.map((sensor) => (
                        <ListItem
                            key={sensor.id}
                            secondaryAction={
                                <Tooltip title="Mover a un rancho">
                                    <IconButton edge="end" aria-label="delete" onClick={() => {
                                        setSensorToAssign({ id: sensor.id, name: sensor.name || sensor.deviceId });
                                        setIsAssignSensorDrawerOpen(true);
                                    }}>
                                        <Iconify width={24} icon="solar:move-to-folder-bold-duotone"/>
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemText
                                onClick={() => navigate(`/iot/sensor/${sensor.deviceId}`)}
                                primary={sensor.name || 'Sin nombre'}
                                secondary={sensor.deviceId}
                                sx={{cursor: 'pointer'}}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
        )
};