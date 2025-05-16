import type { User } from 'src/api-requests/type';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { deleteUserById } from 'src/api-requests/users';

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

export const DeleteUser = ({
    refetchData,
    open,
    handleClose,
    user,
}: {
    refetchData: () => {};
    open: boolean;
    handleClose: () => void;
    user: User | null;
}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async (userId: number | undefined) => {
        if (!userId) {
            setErrorMessage('Usuario no encontrado');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        setIsLoading(true);

        const isDeleted = await deleteUserById(userId);

        if (!isDeleted) {
            setErrorMessage('Error al eliminar el usuario');
            setIsLoading(false);
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        setSuccessMessage('Usuario eliminado correctamente');
        setTimeout(() => {
            setSuccessMessage('');
            setIsLoading(false);
            handleClose();
        }, 1500);

        refetchData();
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
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <IconButton onClick={handleClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Box>

                <Typography variant="h5" flexGrow={1}>
                    Estas seguro de eliminar el usuario {user?.nombre}, esta acción no se puede
                    deshacer.
                </Typography>

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

                <Stack spacing={2} direction="row" mt={3}>
                    <LoadingButton
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={handleClose}
                        loading={isLoading}
                    >
                        Cancelar
                    </LoadingButton>

                    <LoadingButton
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={() => onDelete(user?.id)}
                        loading={isLoading}
                    >
                        Eliminar usuario
                    </LoadingButton>
                </Stack>
            </Card>
        </Modal>
    );
};
