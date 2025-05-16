import type { UserSensor, SensorWithColor } from 'src/api-requests/type';

import { useQuery } from '@tanstack/react-query';
import {useState, useEffect, useCallback} from 'react';

import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { useAuth } from 'src/context/AuthContext';
import { fetchUserSensors } from 'src/api-requests/iot';

import { UserSensors } from '../user-sensors';
import { getColor } from '../../../utils/sensors';
import {Iconify} from "../../../components/iconify";
import { UserSensorsMap } from '../user-sensors-map';
import {YourSensorsLoading} from "../your-sensors-loading";
import { getUserRanches } from '../../../api-requests/ranches/user-ranches';

export const MapSensorsView = () => {
    const { userData } = useAuth();
    const [userSensors, setUserSensors] = useState<SensorWithColor[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { data: userRanches } = useQuery({
        queryKey: ['user-ranches', userData?.id],
        queryFn: () => getUserRanches(userData?.id),
        enabled: !!userData?.id,
    });

    const assignedRanchesName = userRanches
        ?.map((ranche) => ranche.name)
        .filter((name): name is string => name !== null) || [];

    const fetchData = useCallback(async () => {
        if (!userData) return;
        setIsLoading(true);
        const data: UserSensor[] = await fetchUserSensors(userData?.id);

        const sensorsWithColor = data.map((sensor) => {
            if (!sensor.lat || !sensor.long) {
                return {
                    ...sensor,
                    color: '#ff0000', // Red for missing lat/long
                };
            }

            return {
                ...sensor,
                color: getColor({
                    capacidadIdeal: sensor.capacidadIdeal,
                    limite_inferior: sensor.limite_inferior,
                    limite_superior: sensor.limite_superior,
                    agua_suelo: sensor.last_measurement.agua_suelo,
                }),
            };
        }).sort((a, b) => {
            // If either name is null, put those at the end
            if (!a.nombre) return 1;
            if (!b.nombre) return -1;

            // Sort alphabetically
            return a.nombre.localeCompare(b.nombre, undefined, { numeric: true });
        });

        setUserSensors(sensorsWithColor);
        setIsLoading(false);
    }, [userData]);

    useEffect(() => {
        fetchData();
    }, [fetchData, userData]);

    return (
        <Grid
            container
            spacing={2}
            mt={2}
            sx={{
                height: {
                    xs: 'auto',
                    md: 'calc(100vh - 19rem)',
                },
                position: 'relative',
            }}
        >
            {isLoading ? (
                <YourSensorsLoading />
            ) : (
                <>
                    <IconButton
                        aria-label="actualizar"
                        sx={{
                            position: "absolute",
                            top: -40,
                            right: 0
                        }}
                        onClick={() => fetchData()}
                    >
                        <Iconify icon="solar:restart-circle-line-duotone" width={35} />
                    </IconButton>
                    <UserSensors sensors={userSensors} />
                    <UserSensorsMap sensors={userSensors}  ranches={assignedRanchesName}/>
                </>
            )}
        </Grid>
    );
};
