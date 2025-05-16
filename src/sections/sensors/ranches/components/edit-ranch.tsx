import type { SelectChangeEvent } from '@mui/material';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { DeleteRanch } from './delete-ranch';
import { EditAreaMap } from './edit-area-map';
import { Scrollbar } from '../../../../components/scrollbar';
import { ErrorAlert } from '../../../../layouts/alert/error-alert';
import { ReactMap } from '../../../../layouts/components/react-map';
import { SuccessAlert } from '../../../../layouts/alert/success-alert';
import {
    editRanch,
    getUsersInRanch,
    assignRanchToUser,
    unassignRanchToUser
} from '../../../../api-requests/ranches/admin-ranches';

import type { RanchWithoutSensors } from '../../../../api-requests/ranches/schema';

type NewRanchProps = {
    refetchRanchesWithSensors: () => void;
    isOpen: boolean;
    onCloseDrawer: () => void;
    ranch: RanchWithoutSensors;
};

export const EditRanch = ({
    refetchRanchesWithSensors,
    isOpen,
    onCloseDrawer,
    ranch,
}: NewRanchProps) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [removeFromRanchUsersIds, setRemoveFromRanchUsersIds] = useState<string[]>([]);

    const [name, setName] = useState('');
    const [coordinates, setCoordinates] = useState<google.maps.LatLngLiteral[][] | null>(null);
    const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

    const { data: usersInRanch, refetch: refetchUsersInRanch } = useQuery({
        queryKey: ['get-users-in-ranches', ranch.id],
        queryFn: () => getUsersInRanch (ranch.id),
        enabled: !!ranch.id,
    });

    const mutation = useMutation({
        mutationKey: ['update-ranch', ranch.id],
        mutationFn: ({
            ranchName,
            lat,
            long,
            areaCoordinates,
            ranchId,
        }: {
            ranchName: string;
            lat: number;
            long: number;
            areaCoordinates: google.maps.LatLngLiteral[][];
            ranchId: number;
            userIds: string[];
        }) => editRanch(ranchName, lat, long, areaCoordinates, ranchId),
        onSuccess: () => {
            refetchRanchesWithSensors();
        },
    });

    const assignToUserMutation = useMutation({
        mutationKey: ['assignToUser', ranch.id],
        mutationFn: ({ranchId, ids}: { ranchId: number, ids: number[] }) => assignRanchToUser(ranchId, ids),
        onSuccess: () => {
            setSelectedUsers([])
            setRemoveFromRanchUsersIds([])
            refetchUsersInRanch()
        }
    })

    const unassignToUserMutation = useMutation({
        mutationKey: ['assignToUser', ranch.id],
        mutationFn: ({ranchId, ids}: { ranchId: number, ids: number[] }) => unassignRanchToUser(ranchId, ids),
        onSuccess: () => {
            setSelectedUsers([])
            setRemoveFromRanchUsersIds([])
            refetchUsersInRanch()
        }
    })

    useEffect(() => {
        setName(ranch.name || '');
        setSelectedUsers([]);
        setRemoveFromRanchUsersIds([]);
        if (ranch.lat && ranch.long) {
            setMarker({ lat: ranch.lat, lng: ranch.long });
        }
        if (ranch.area && ranch?.area?.coordinates?.length >= 1) {
            const ranchArea = ranch.area.coordinates;

            if (Array.isArray(ranchArea[0])) {
                // It's an array of arrays
                // @ts-ignore
                setCoordinates(ranchArea); // Directly set it
            } else if (typeof ranchArea[0] === 'object' && ranchArea[0] !== null) {
                // It's an array of objects
                // @ts-ignore
                setCoordinates([ranchArea]); // Wrap it in another array
            } else {
                // Handle other cases or errors (e.g., empty array, unexpected type)
                console.error("Unexpected coordinates format");
                setCoordinates([]); // Or handle as needed
            }
        } else {
            setCoordinates([]); // If coordinates are not present or empty
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ranch]);

    const onEditCurrentRanch = (
        markerPosition: google.maps.LatLngLiteral | null,
        polygon: google.maps.LatLngLiteral[][]
    ) => {
        if (markerPosition && polygon.length > 0 && name) {
            mutation.mutate({
                ranchName: name,
                lat: markerPosition.lat,
                long: markerPosition.lng,
                areaCoordinates: polygon,
                ranchId: ranch.id,
                userIds: selectedUsers,
            });
        }

        if (selectedUsers && selectedUsers.length > 0) {
            const numberIds = selectedUsers.map(Number)
            assignToUserMutation.mutate({
                ranchId: ranch.id,
                ids: numberIds
            })
        }

        if (removeFromRanchUsersIds && removeFromRanchUsersIds.length > 0) {
            const numberIds = removeFromRanchUsersIds.map(Number)
            unassignToUserMutation.mutate({
                ranchId: ranch.id,
                ids: numberIds
            })
        }
    };

    const onClose = () => {
        setSelectedUsers([]);
        onCloseDrawer();
    }

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

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            anchor="right"
            sx={{ height: '100vh' }}
        >
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
                    <Typography variant="subtitle1">Editar un rancho</Typography>

                    <TextField
                        fullWidth
                        size="small"
                        label="Nombre"
                        sx={{ mt: 2 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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
                                        const user = usersInRanch?.data.notAssigned?.find(
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
                            {usersInRanch?.data.notAssigned?.map((user) => (
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
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {removeFromRanchUsersIds.map((value) => {
                                        const user = usersInRanch?.data.assigned?.find(
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
                            {usersInRanch?.data.assigned?.map((user) => (
                                <MenuItem key={user.id} value={user.id.toString()}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="caption" sx={{ mt: 3, mb: 1, display: 'block' }}>
                        Selecciona la ubicación del rancho y el su área
                    </Typography>

                    <ReactMap>
                        <EditAreaMap
                            onSendFunction={onEditCurrentRanch}
                            isLoading={mutation.isPending}
                            marker={marker}
                            polygon={coordinates}
                        />
                    </ReactMap>

                    <DeleteRanch onCloseDrawer={onClose} ranchId={ranch.id} refetch={refetchRanchesWithSensors}/>

                    {mutation.isError && <ErrorAlert message={`${mutation.error}`} />}
                    {assignToUserMutation.isError && <ErrorAlert message={`${assignToUserMutation.error}`} />}
                    {unassignToUserMutation.isError && <ErrorAlert message={`${assignToUserMutation.error}`} />}

                    {mutation.isSuccess && <SuccessAlert message="Rancho actualizado" />}
                    {assignToUserMutation.isSuccess && <SuccessAlert message="Usuarios asignados" />}
                    {unassignToUserMutation.isSuccess && <SuccessAlert message="Usuarios removidos" />}
                </Box>
            </Scrollbar>
        </Drawer>
    );
};
