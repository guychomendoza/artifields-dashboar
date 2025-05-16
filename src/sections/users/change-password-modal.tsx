import type { User } from 'src/api-requests/type';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { changeUserPassword } from 'src/api-requests/users';

import { Iconify } from 'src/components/iconify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export const ChangePasswordModal = ({
    open,
    handleClose,
    user,
}: {
    open: boolean;
    handleClose: () => void;
    user: User | null;
}) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onChangePassword = async () => {
        if (!user || !user.id) {
            setErrorMessage('Usuario no encontrado');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        if (!newPassword || !confirmPassword) {
            setErrorMessage('Ambos campos de contraseña deben ser llenados');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        setIsLoading(true);

        try {
            const isChanged = await changeUserPassword(user.id, newPassword);

            if (!isChanged) {
                setErrorMessage('Error al cambiar la contraseña');
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
                setIsLoading(false);
                setNewPassword('');
                setConfirmPassword('');
                return;
            }

            setSuccessMessage('Contraseña cambiada correctamente');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            setIsLoading(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setErrorMessage('Error al cambiar la contraseña');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            setIsLoading(false);
        }
    };

    return (
        <Modal
            open={open}
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
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" flexGrow={1}>
                        Nueva contraseña
                    </Typography>

                    <IconButton onClick={handleClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Box>

                <TextField
                    fullWidth
                    label="Nueva contraseña"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Confirmar contraseña"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {errorMessage && (
                    <Typography color="error" variant="body2">
                        {errorMessage}
                    </Typography>
                )}

                {successMessage && (
                    <Typography color="green" variant="body2">
                        {successMessage}
                    </Typography>
                )}

                <LoadingButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={onChangePassword}
                    loading={isLoading}
                >
                    Cambiar contraseña
                </LoadingButton>
            </Card>
        </Modal>
    );
};
