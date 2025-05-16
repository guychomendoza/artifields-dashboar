import type { User } from 'src/api-requests/type';

import { useState, useEffect, type ChangeEvent} from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';

import { ConfirmationDialog } from './confirmation-dialog';
import {updateUserDetails} from "../../api-requests/users";

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

export const EditUser = ({
     open,
     handleClose,
     user,
     refetchData,
}: {
    open: boolean;
    handleClose: () => void;
    user: User | null;
    refetchData: () => void;
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState(1);
    const [isChatbotActive, setIsChatbotActive] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        setName(user.nombre || '');
        setEmail(user.correo || '');
        setPhone(user.telefono || '');
        setRole(user.tipo_usuario || 1);
        setIsChatbotActive(user.chatbot_whats || false);
    }, [user]);

    const handleChatbotChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!phone.trim()) {
            setErrorMessage('Se requiere un número de teléfono para activar el chatbot');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        if (event.target.checked) {
            setShowConfirmDialog(true);
        } else {
            setIsChatbotActive(false);
        }
    };

    const handleConfirmChatbot = () => {
        setIsChatbotActive(true);
        setShowConfirmDialog(false);
    };

    const handleCancelChatbot = () => {
        setShowConfirmDialog(false);
        setIsChatbotActive(false);
    };

    const onEditUser = async () => {
        if (!user || !user.id) return;

        if (!name || !email || !role) {
            setErrorMessage('El nombre, correo y rol son requeridos');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        // If trying to activate chatbot without phone number
        if (isChatbotActive && !phone.trim()) {
            setErrorMessage('Se requiere un número de teléfono para activar el chatbot');
            setIsChatbotActive(false);
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        if (
            name === user?.nombre &&
            email === user?.correo &&
            role === user?.tipo_usuario &&
            phone === user?.telefono &&
            isChatbotActive === user?.chatbot_whats
        )
            return;

        setIsLoading(true);

        try {
            const isUpdated = await updateUserDetails(user.id, {
                nombre: name,
                correo: email,
                tipo_usuario: role,
                telefono: phone,
                chatbot_whats: isChatbotActive,
            });

            if (!isUpdated) {
                setErrorMessage('Error al actualizar los detalles del usuario');
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
                setIsLoading(false);
                return;
            }

            setSuccessMessage('Detalles del usuario actualizados correctamente');
            refetchData();
            setIsLoading(false);
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setErrorMessage('Error al actualizar los detalles del usuario');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            setIsLoading(false);
        }
    };

    return (
        <>
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
                            Editar usuario
                        </Typography>

                        <IconButton onClick={handleClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Box>

                    <TextField
                        fullWidth
                        label="Nombre"
                        margin="normal"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Correo"
                        margin="normal"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Teléfono"
                        margin="normal"
                        variant="outlined"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            // If phone is cleared and chatbot is active, deactivate chatbot
                            if (!e.target.value.trim() && isChatbotActive) {
                                setIsChatbotActive(false);
                            }
                        }}
                    />

                    <Select
                        fullWidth
                        name="role"
                        sx={{ mb: 3 }}
                        value={role}
                        onChange={(e) => setRole(e.target.value as number)}
                    >
                        <MenuItem value={1}>User</MenuItem>
                        <MenuItem value={2}>Admin</MenuItem>
                        <MenuItem value={3}>Superadmin</MenuItem>
                    </Select>

                    <Tooltip title={!phone.trim() ? 'Se requiere un número de teléfono para activar el chatbot' : ''}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isChatbotActive}
                                    onChange={handleChatbotChange}
                                    color="primary"
                                    disabled={!phone.trim()}
                                />
                            }
                            label="Activar Chatbot de WhatsApp"
                        />
                    </Tooltip>

                    {errorMessage && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    {successMessage && (
                        <Typography color="green" variant="body2" sx={{ mt: 1 }}>
                            {successMessage}
                        </Typography>
                    )}

                    <LoadingButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={onEditUser}
                        loading={isLoading}
                        sx={{ mt: 2 }}
                    >
                        Actualizar usuario
                    </LoadingButton>
                </Card>
            </Modal>

            <ConfirmationDialog
                open={showConfirmDialog}
                onClose={handleCancelChatbot}
                onConfirm={handleConfirmChatbot}
            />
        </>
    );
};