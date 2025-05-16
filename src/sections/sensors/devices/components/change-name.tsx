
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';

import { getSensorInfo, changeSensorNickname } from 'src/api-requests/iot';

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

export const ChangeName = ({
     isOpen,
     handleClose,
     refetchDevices,
     selectedSensorId,
}: {
    isOpen: boolean;
    handleClose: () => void;
    refetchDevices: () => void;
    selectedSensorId: string;
}) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [name, setName] = useState<string>('');
    const [defaultName, setDefaultName] = useState('');
    const [devId, setDevId] = useState('');

    useEffect(() => {
        const fetchCurrentData = async () => {
            const data = await getSensorInfo(selectedSensorId);
            if (!data) return;
            setName(data.nombre || "");
            setDefaultName(data.nombre || "Sin nombre");
            setDevId(data.device_id)
        };

        fetchCurrentData();
    }, [selectedSensorId]);

    const handleChagneName = async () => {
        if (!name || !selectedSensorId) return;
        try {
            setStatus('loading');
            const sucess = await changeSensorNickname(selectedSensorId, name);
            if (!sucess) {
                setStatus('error');
                return;
            }
            setStatus('success');
            refetchDevices();
            setName('');
            handleClose();
        } catch (error) {
            setStatus('error');
        }
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
                        <Box>
                            <Typography variant="h6">{defaultName}</Typography>
                            <Typography variant="body2">{devId}</Typography>
                        </Box>

                        <IconButton onClick={handleClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Stack>

                    <TextField
                        fullWidth
                        size="small"
                        label="nombre"
                        variant="outlined"
                        sx={{ mt: 1 }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <LoadingButton
                        fullWidth
                        variant="outlined"
                        onClick={handleChagneName}
                        sx={{ mt: 1 }}
                        loading={status === 'loading'}
                    >
                        Cambiar nombre
                    </LoadingButton>
                </CardContent>
            </Card>
        </Modal>
    );
};
