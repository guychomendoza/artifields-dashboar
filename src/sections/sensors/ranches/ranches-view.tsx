import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {NewRanch} from "./components/new-ranch";
import {EditRanch} from "./components/edit-ranch";
import { RanchCard } from './components/ranch-card';
import { ErrorAlert } from '../../../layouts/alert/error-alert';
import { SensorsWithoutRanch } from './components/sensors-without-ranch';
import { AssignSensorToRanch } from './components/assign-sensor-to-ranch';
import {DashboardLoading} from "../../../layouts/loading/dashboard-loading";
import {
    getAllRanchesWithSensors,
    getAllSensorsWithoutRanch,
} from '../../../api-requests/ranches/admin-ranches';

import type {RanchWithoutSensors} from "../../../api-requests/ranches/schema";

export const RanchesView = () => {
    const [isAssignSensorDrawerOpen, setIsAssignSensorDrawerOpen] = useState(false);
    const [sensorToAssign, setSensorToAssign] = useState<{id: number, name: string}|null>(null);

    const onCloseAssignSensorDrawer = () => {
        setIsAssignSensorDrawerOpen(false);
        setSensorToAssign(null);
    }

    const [isEditRanchDrawerOpen, setIsEditRanchDrawerOpen] = useState(false);
    const [ranchToEdit, setRanchToEdit] = useState<RanchWithoutSensors|null>(null);

    const onCloseEditRanchDrawer = () => {
        setIsEditRanchDrawerOpen(false);
        setSensorToAssign(null);
    }

    const {
        data: ranchesWithSensors,
        isLoading: isRanchesLoading,
        isError: isRanchesError,
        error: ranchesError,
        refetch: refetchRanchesWithSensors
    } = useQuery({
        queryKey: ['all-ranches-with-sensors'],
        queryFn: getAllRanchesWithSensors,
    });

    const {
        data: sensorsWithoutRanches,
        isLoading: isSensorsWithoutRanchesLoading,
        isError: isSensorsWithoutRanchesError,
        error: sensorsWithoutRanchesError,
        refetch: refetchSensorsWithoutRanches
    } = useQuery({
        queryKey: ['all-sensors-without-ranches'],
        queryFn: getAllSensorsWithoutRanch,
    });

    if (isRanchesLoading || isSensorsWithoutRanchesLoading) {
        return <DashboardLoading />;
    }

    if (isRanchesError || isSensorsWithoutRanchesError) {
        return (
            <ErrorAlert
                message={`${ranchesError?.message}. ${sensorsWithoutRanchesError?.message}`}
            />
        );
    }

    if (!ranchesWithSensors || !sensorsWithoutRanches) {
        return null;
    }

    const ranchesWithNameAndId = ranchesWithSensors.map((ranch) => ({
        ranchId: ranch.id,
        ranchName: ranch.name,
    }))

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" mt={3}>
                    Ranchos
                </Typography>

                <NewRanch refetchRanchesWithSensors={refetchRanchesWithSensors} />
            </Stack>

            <Grid container spacing={2} mt={1}>
                {ranchesWithSensors?.map((ranch) => (
                    <Grid key={ranch.id} item xs={12} sm={6} lg={4}>
                        <RanchCard
                            ranch={ranch}
                            setSelectedRanch={setRanchToEdit}
                            setIsDrawerOpen={setIsEditRanchDrawerOpen}
                            refetchRanchesWithSensors={refetchRanchesWithSensors}
                            refetchSensorsWithoutRanches={refetchSensorsWithoutRanches}
                        />
                    </Grid>
                ))}
            </Grid>

            <Typography variant="subtitle1" mt={7} mb={3}>
                Sensors sin ranchos asignados
            </Typography>

            <SensorsWithoutRanch
                sensors={sensorsWithoutRanches}
                setIsAssignSensorDrawerOpen={setIsAssignSensorDrawerOpen}
                setSensorToAssign={setSensorToAssign}
            />

            {sensorToAssign?.id || sensorToAssign?.name ? (
                <AssignSensorToRanch
                    selectedSensor={sensorToAssign}
                    isAssignSensorDrawerOpen={isAssignSensorDrawerOpen}
                    onCloseDrawer={onCloseAssignSensorDrawer}
                    ranchesWithIdAndName={ranchesWithNameAndId}
                    refetchRanchesWithSensors={refetchRanchesWithSensors}
                    refetchSensorsWithoutRanches={refetchSensorsWithoutRanches}
                />
            ) : null}

            {
                ranchToEdit ? (
                    <EditRanch
                        ranch={ranchToEdit}
                        refetchRanchesWithSensors={refetchRanchesWithSensors}
                        isOpen={isEditRanchDrawerOpen}
                        onCloseDrawer={onCloseEditRanchDrawer}
                    />
                ) : null
            }


        </>
    );
};
