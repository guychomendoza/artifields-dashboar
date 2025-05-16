import type { SelectChangeEvent } from '@mui/material';

import { useState} from 'react';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from "@mui/lab/LoadingButton";

import {ErrorAlert} from "../../../../layouts/alert/error-alert";
import {SuccessAlert} from "../../../../layouts/alert/success-alert";
import { moveSensorToRanch } from '../../../../api-requests/ranches/admin-ranches';

type AssignSensorToRanchProps = {
    selectedSensor: { id: number; name: string };
    isAssignSensorDrawerOpen: boolean;
    onCloseDrawer: () => void;
    ranchesWithIdAndName: { ranchId: number; ranchName: string|null }[];
    refetchRanchesWithSensors: () => void;
    refetchSensorsWithoutRanches: () => void;
};

export const AssignSensorToRanch = ({
    selectedSensor,
    isAssignSensorDrawerOpen,
    onCloseDrawer,
    ranchesWithIdAndName,
    refetchRanchesWithSensors,
    refetchSensorsWithoutRanches
}: AssignSensorToRanchProps) => {
    const [ranchId, setRanchId] = useState('');

    const mutation = useMutation({
        mutationKey: ["assign-sensor-to-ranch", selectedSensor.id],
        mutationFn: ({ sensorId, ranchToBeMovedId }: { sensorId: number; ranchToBeMovedId: number }) =>
            moveSensorToRanch(sensorId, ranchToBeMovedId),
        onSuccess: () => {
            setRanchId("");
            refetchRanchesWithSensors();
            refetchSensorsWithoutRanches();
        }
    });

    const handleChange = (event: SelectChangeEvent) => {
        setRanchId(event.target.value);
    };

    return (
        <Drawer
            open={isAssignSensorDrawerOpen}
            onClose={onCloseDrawer}
            anchor="right"
            sx={{ height: '100vh' }}
        >
            <Box
                sx={{
                    width: {
                        xs: 300,
                        sm: 500,
                    },
                    p: {
                        xs: 1.5,
                        sm: 4,
                    },
                    height: '100vh',
                }}
            >
                <Typography variant="subtitle1">Mover el sensor {selectedSensor.name}</Typography>

                <Typography variant="caption" sx={{ mb: 2, mt: 1 }}>
                    Selecionar un rancho al que deseas mover el sensor
                </Typography>
                <Select
                    sx={{ mb: 1, mt: 2 }}
                    fullWidth
                    size="small"
                    value={ranchId}
                    onChange={handleChange}
                >
                    {ranchesWithIdAndName?.map((ranch) => (
                        <MenuItem key={ranch.ranchId} value={ranch.ranchId}>
                            {ranch.ranchName}
                        </MenuItem>
                    ))}
                </Select>

                <LoadingButton
                    variant="contained"
                    fullWidth
                    sx={{mb: 2}}
                    onClick={() => {
                        if (!ranchId) return;
                        mutation.mutate({ sensorId: selectedSensor.id, ranchToBeMovedId: Number(ranchId)});
                    }}
                    disabled={mutation.isPending}
                    loading={mutation.isPending}
                >
                    Mover sensor
                </LoadingButton>
                {
                    mutation.isError && (
                        <ErrorAlert message={`${mutation.error}`} />
                    )
                }

                {
                    mutation.isSuccess && (
                        <SuccessAlert message="Sensor asignado correctamente" />
                    )
                }

            </Box>
        </Drawer>
    );
};
