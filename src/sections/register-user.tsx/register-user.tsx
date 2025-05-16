import { useState, type Dispatch } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { BACKEND_URL } from 'src/api-requests/api-url';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function RegisterUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const showAndHideMessage = (message: string, set: Dispatch<React.SetStateAction<string>>) => {
        set(message);
        setTimeout(() => {
            set('');
        }, 3000);
    };

    const handleNewUser = async () => {
        if (!name || !email || !password) {
            showAndHideMessage(
                'Ingrese un nombre, correo electrónico y una contraseña',
                setErrorMessage
            );
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            showAndHideMessage('Ingrese un correo electrónico válido', setErrorMessage);
            return;
        }

        try {
            setIsPending(true);

            const response = await fetch(`${BACKEND_URL}/api/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: name,
                    correo: email,
                    contraseña: password,
                    tipo_usuario: role,
                }),
            });

            const data = await response.json();

            if (data.message === 'Usuario creado exitosamente') {
                showAndHideMessage(data.message, setSuccessMessage);
                setIsPending(false);
                return;
            }

            if (data?.errors[0] === 'correo must be unique') {
                showAndHideMessage('El usuario ya existe', setErrorMessage);
                setIsPending(false);
            }
        } catch (error) {
            showAndHideMessage('Error al crear el usuario', setErrorMessage);
            setIsPending(false);
        }
    };

    const renderForm = (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            marginX="auto"
            width={{ xs: '90%', sm: '80%', md: '60%', lg: '50%' }}
        >
            <TextField
                fullWidth
                name="name"
                label="Nombre"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <TextField
                fullWidth
                name="email"
                label="Correo"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
                fullWidth
                name="password"
                label="Contraseña"
                InputLabelProps={{ shrink: true }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify
                                    icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 3 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mb: 1.5 }}>
                    {errorMessage}
                </Typography>
            )}

            {successMessage && (
                <Typography variant="body2" color="green" sx={{ mb: 1.5 }}>
                    {successMessage}
                </Typography>
            )}

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="contained"
                onClick={handleNewUser}
                loading={isPending}
            >
                Crear Usuario
            </LoadingButton>
        </Box>
    );

    return (
        <>
            <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mt: 5 }}>
                <Typography variant="h6">Nuevo Usuario</Typography>
            </Box>

            {renderForm}
        </>
    );
}
