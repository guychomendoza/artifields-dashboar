import type {User, SensorInfo} from 'src/api-requests/type';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

import { fetchAllUsers } from 'src/api-requests/users';
import {getSensorInfo, assignSensorToUser, unassignSensorFromUser} from 'src/api-requests/iot';

import { Iconify } from 'src/components/iconify';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export const AssignSensor = ({
    isOpen,
    handleClose,
    refetchAssignedSensors,
    selectedSensorId,
    alreadyAssignedIds,
}: {
    isOpen: boolean;
    handleClose: () => void;
    refetchAssignedSensors: () => void;
    selectedSensorId: string;
    alreadyAssignedIds: number[];
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [assignUserIds, setAssignUserIds] = useState<string[]>([]);
    const [unassignUserIds, setUnassignUserIds] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [feedbackMessage, setFeedbackMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [sensorData, setSensorData] = useState<SensorInfo>();

    useEffect(() => {
        const fetchCurrentData = async () => {
            const data = await getSensorInfo(selectedSensorId);
            if (!data) return;
            setSensorData(data);
        };

        fetchCurrentData();
    }, [selectedSensorId]);

    useEffect(() => {
        setAssignUserIds([]);
        setUnassignUserIds([]);
    }, [selectedSensorId]);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await fetchAllUsers();
            setUsers(data);
        };

        fetchUsers();
    }, []);


    const handleFeedbackMessage = (message: string, type: 'success' | 'error') => {
        setFeedbackMessage({ message, type });
        setTimeout(() => setFeedbackMessage(null), 3000); // Message disappears after 3 seconds
    };

// Use `handleFeedbackMessage` in place of setting feedbackMessage directly in handleAssign and handleUnassign
    const handleAssign = async () => {
        if (!assignUserIds.length || !selectedSensorId) return;

        try {
            setStatus('loading');
            await Promise.all(
                assignUserIds.map(async (user_id) => {
                    await assignSensorToUser(selectedSensorId, Number(user_id));
                })
            );

            setStatus('success');
            refetchAssignedSensors();
            setAssignUserIds([]);
            handleFeedbackMessage('Sensores asignados correctamente.', 'success');
        } catch (error) {
            setStatus('error');
            handleFeedbackMessage('Error al asignar sensores. Por favor, inténtelo de nuevo.', 'error');
        }
    };

    const handleUnassign = async () => {
        if (!unassignUserIds.length || !selectedSensorId) return;

        try {
            setStatus('loading');
            await Promise.all(
                unassignUserIds.map(async (user_id) => {
                    await unassignSensorFromUser(selectedSensorId, Number(user_id));
                })
            );

            setStatus('success');
            refetchAssignedSensors();
            setUnassignUserIds([]);
            handleFeedbackMessage('Sensores removidos correctamente.', 'success');
        } catch (error) {
            setStatus('error');
            handleFeedbackMessage('Error al remover sensores. Por favor, inténtelo de nuevo.', 'error');
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="manage-sensor-modal-title"
            aria-describedby="manage-sensor-modal-description"
        >
            <Card
                sx={{
                    ...style,
                    width: {
                        xs: '90%',
                        sm: 400,
                        md: 500,
                        lg: 600,
                    },
                }}
            >
                <CardContent>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignContent="center"
                        alignItems="center"
                    >
                        <Box>
                            <Typography variant="h6">{sensorData?.nombre || "Sin nombre"}</Typography>
                            <Typography variant="body2">{sensorData?.device_id}</Typography>
                        </Box>

                        <IconButton onClick={handleClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Stack>
                    <Collapse in={!!feedbackMessage}>
                        <Alert
                            severity={feedbackMessage?.type}
                            sx={{ mt: 2 }}
                            onClose={() => setFeedbackMessage(null)} // Allow manual dismissal
                        >
                            {feedbackMessage?.message}
                        </Alert>
                    </Collapse>
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="assign-user" size="small">
                            Asignar a Usuarios
                        </InputLabel>
                        <Select
                            labelId="assign-user"
                            id="assign-user"
                            label="Asignar a Usuarios"
                            size="small"
                            multiple
                            value={assignUserIds}
                            onChange={(e) => setAssignUserIds(e.target.value as string[])}
                        >
                            {users.map((user) => {
                                if (alreadyAssignedIds.includes(user.id)) {
                                    return null;
                                }
                                return (
                                    <MenuItem key={user.id} value={user.id.toString()}>
                                        {user.nombre}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        onClick={handleAssign}
                        sx={{ mt: 1 }}
                        loading={status === 'loading'}
                    >
                        Asignar Sensores
                    </LoadingButton>

                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="unassign-user" size="small">
                            Remover de Usuarios
                        </InputLabel>
                        <Select
                            labelId="unassign-user"
                            id="unassign-user"
                            label="Remover de Usuarios"
                            size="small"
                            multiple
                            value={unassignUserIds}
                            onChange={(e) => setUnassignUserIds(e.target.value as string[])}
                        >
                            {users.map((user) => {
                                if (!alreadyAssignedIds.includes(user.id)) {
                                    return null;
                                }
                                return (
                                    <MenuItem key={user.id} value={user.id.toString()}>
                                        {user.nombre}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={handleUnassign}
                        sx={{ mt: 1 }}
                        loading={status === 'loading'}
                    >
                        Remover Sensores
                    </LoadingButton>
                </CardContent>
            </Card>
        </Modal>
    );
};
