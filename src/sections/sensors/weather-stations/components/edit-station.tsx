import type {SelectChangeEvent} from "@mui/material";

import {useState, useEffect} from "react";
import {useQuery, useMutation} from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Chip from "@mui/material/Chip";
import Drawer from '@mui/material/Drawer';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';
import InputLabel from "@mui/material/InputLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

import { Scrollbar } from '../../../../components/scrollbar';
import {ErrorAlert} from "../../../../layouts/alert/error-alert";
import {SuccessAlert} from "../../../../layouts/alert/success-alert";
import {
    getUsersInStations,
    assignStationToUser,
    unassignStationToUser
} from "../../../../api-requests/stations/admin-stations";

type EditStationProps = {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    stationId: string;
}

export const EditStation = ({
    isOpen,
    onClose,
    name,
    stationId,
}: EditStationProps) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [removeFromRanchUsersIds, setRemoveFromRanchUsersIds] = useState<string[]>([]);

    const { data: usersInStations, refetch: refetchUsersInStations } = useQuery({
        queryKey: ['get-users-in-stations', stationId],
        queryFn: () => getUsersInStations(stationId),
        enabled: !!stationId,
    });

    const assignToUserMutation = useMutation({
        mutationKey: ['assignToUser', stationId],
        mutationFn: ({stationEui, ids}: { stationEui: string, ids: number[] }) => assignStationToUser(stationEui, ids),
        onSuccess: () => {
            setSelectedUsers([])
            setRemoveFromRanchUsersIds([])
            refetchUsersInStations()
        }
    })

    const unassignToUserMutation = useMutation({
        mutationKey: ['assignToUser', stationId],
        mutationFn: ({stationEui, ids}: { stationEui: string, ids: number[] }) => unassignStationToUser(stationEui, ids),
        onSuccess: () => {
            setSelectedUsers([])
            setRemoveFromRanchUsersIds([])
            refetchUsersInStations()
        }
    })

    useEffect(() => {
        setSelectedUsers([]);
        setRemoveFromRanchUsersIds([]);
    }, [stationId]);

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setSelectedUsers(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const handleRemoveUsersChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setRemoveFromRanchUsersIds(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const onEditCurrentRanch = () => {
        if (selectedUsers && selectedUsers.length > 0) {
            const numberIds = selectedUsers.map(Number)
            assignToUserMutation.mutate({
                stationEui: stationId,
                ids: numberIds
            })
        }

        if (removeFromRanchUsersIds && removeFromRanchUsersIds.length > 0) {
            const numberIds = removeFromRanchUsersIds.map(Number)
            unassignToUserMutation.mutate({
                stationEui: stationId,
                ids: numberIds
            })
        }
    };

    return (
        <Drawer open={isOpen} onClose={onClose} anchor="right">
                <Scrollbar>
                    <Box
                        sx={{
                            width: {
                                xs: 300,
                                sm: 500,
                                md: 600,
                            },
                            p: {
                                xs: 1.5,
                                sm: 4,
                            },
                            height: '100vh',
                        }}
                    >
                        <Typography variant="subtitle1">{name || "Sin nombre"}</Typography>
                        <Typography variant="caption">Asigna esta estación a usuarios</Typography>

                        <FormControl fullWidth sx={{ mt: 3 }}>
                            <InputLabel id="assign-to-users">Assignar usuarios</InputLabel>
                            <Select
                                labelId="assign-to-users"
                                id="assign-to-users"
                                multiple
                                value={selectedUsers}
                                onChange={handleChange}
                                input={<OutlinedInput label="Assignar a usuarios" />}
                                size="small"
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const user = usersInStations?.data.notAssigned?.find(
                                                (u) => u.id.toString() === value
                                            );
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={user?.name || value}
                                                    size="small"
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {usersInStations?.data.notAssigned?.map((user) => (
                                    <MenuItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mt: 3 }}>
                            <InputLabel id="assign-to-users">Remover usuarios</InputLabel>
                            <Select
                                labelId="assign-to-users"
                                id="assign-to-users"
                                multiple
                                value={removeFromRanchUsersIds}
                                onChange={handleRemoveUsersChange}
                                input={<OutlinedInput label="Assignar a usuarios" />}
                                size="small"
                                renderValue={() => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {removeFromRanchUsersIds.map((value) => {
                                            const user = usersInStations?.data.assigned?.find(
                                                (u) => u.id.toString() === value
                                            );
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={user?.name || value}
                                                    size="small"
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {usersInStations?.data.assigned?.map((user) => (
                                    <MenuItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <LoadingButton
                            variant="contained"
                            fullWidth
                            sx={{ mb: 2, mt: 2 }}
                            onClick={onEditCurrentRanch}
                            loading={unassignToUserMutation.isPending || assignToUserMutation.isPending}
                            disabled={unassignToUserMutation.isPending || assignToUserMutation.isPending}
                        >
                            Actualizar Estación
                        </LoadingButton>


                        {assignToUserMutation.isError && <ErrorAlert message={`${assignToUserMutation.error}`} />}
                        {unassignToUserMutation.isError && <ErrorAlert message={`${assignToUserMutation.error}`} />}

                        {assignToUserMutation.isSuccess && <SuccessAlert message="Usuarios asignados" />}
                        {unassignToUserMutation.isSuccess && <SuccessAlert message="Usuarios removidos" />}
                    </Box>
                </Scrollbar>
            </Drawer>
    );
};
