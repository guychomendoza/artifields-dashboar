import type { DeviceRead, DeviceGroup } from 'src/api-requests/type';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

import { fetchUniqueGroups, moveDeviceToGroup } from 'src/api-requests/iot';

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

export const MoveDeviceToGroup = ({
  isOpen,
  handleClose,
  selctedDevice,
  refetch,
}: {
    isOpen: boolean;
    handleClose: () => void;
    selctedDevice: DeviceRead | null;
    refetch: () => void;
}) => {
    const [groups, setGroups] = useState<DeviceGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [newGroupName, setNewGroupName] = useState<string>('');
    const [newGroupId, setNewGroupId] = useState<string | null>(null); // Updated to handle select
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchUniqueGroups();
            setGroups(data);
        };

        fetchData();
    }, []);

    const handleMove = async () => {
        if (!selctedDevice || !selectedGroup) return;
        const groupId = groups.find((group) => group.grupo_name === selectedGroup)?.grupo_id;
        if (!groupId) return;

        setStatus('loading');
        const success = await moveDeviceToGroup(selctedDevice.device_id, groupId, selectedGroup);

        if (success) {
            refetch();
            handleClose();
            setStatus('success');
        }

        setStatus('error');
    };

    const handleCreateAndMove = async () => {
        if (!newGroupName || !newGroupId || !selctedDevice) return;

        setStatus('loading');

        const success = await moveDeviceToGroup(
            selctedDevice.device_id,
            Number(newGroupId),
            newGroupName
        );

        if (success) {
            refetch();
            setStatus('success');
            setNewGroupId(null);
            setNewGroupName('');
            handleClose();
        }

        setStatus('error');
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
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
                        <Typography variant="h6">Mover dispositivo a rancho</Typography>

                        <IconButton onClick={handleClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Stack>
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="rancho" size="small">
                            Rancho
                        </InputLabel>
                        <Select
                            labelId="rancho"
                            id="rancho"
                            label="Rancho"
                            size="small"
                            value={selectedGroup || ''}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            {groups.map((group) => {
                                if (!group.grupo_id || !group.grupo_name) return;
                                return (
                                    <MenuItem key={group.grupo_name} value={group.grupo_name}>
                                        {group.grupo_name}
                                    </MenuItem>
                                );
                            })}
                        </Select>

                        <LoadingButton
                            variant="outlined"
                            sx={{ mt: 1 }}
                            onClick={handleMove}
                            loading={status === 'loading'}
                        >
                            Mover
                        </LoadingButton>
                    </FormControl>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Si prefieres, puedes crear un nuevo grupo y mover el dispositivo a él.
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="new-group-id" size="small">
                            Distancia del sensor
                        </InputLabel>
                        <Select
                            labelId="new-group-id"
                            id="new-group-id"
                            size="small"
                            value={newGroupId || ''}
                            onChange={(e) => setNewGroupId(e.target.value)}
                        >
                            <MenuItem value="15">15 cm</MenuItem>
                            <MenuItem value="30">30 cm</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        name="name"
                        label="Nombre del grupo"
                        sx={{ mt: 2 }}
                        size="small"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />

                    <LoadingButton
                        variant="contained"
                        sx={{ mt: 1 }}
                        fullWidth
                        onClick={handleCreateAndMove}
                        loading={status === 'loading'}
                    >
                        Crear y mover
                    </LoadingButton>
                </CardContent>
            </Card>
        </Modal>
    );
};
