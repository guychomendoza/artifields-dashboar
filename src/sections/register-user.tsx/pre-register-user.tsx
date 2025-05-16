import type { SensorWithName } from 'src/api-requests/type';

import { useState, useEffect, type Dispatch } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { BACKEND_URL } from 'src/api-requests/api-url';
import { fetchAllUsers } from 'src/api-requests/users';
import { assignSensorToUser } from 'src/api-requests/iot';

export function PreRegisterUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(1);
    const [sensorIds, setSensorIds] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [sensors, setSensors] = useState<SensorWithName[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/sensors/ultima-medicion-unica`);
                const result = await response.json();
                setSensors(result);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const showAndHideMessage = (message: string, set: Dispatch<React.SetStateAction<string>>) => {
        set(message);
        setTimeout(() => {
            set('');
        }, 3000);
    };

    const handleNewUser = async () => {
        if (!name || !email) {
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

            const response = await fetch(`${BACKEND_URL}/api/users/special-create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: name,
                    correo: email,
                    tipo_usuario: role,
                    sensor_ids: sensorIds, // Add sensor IDs to the request
                }),
            });

            const data = await response.json();

            if (
                data.message ===
                'Usuario creado. Se envió un correo con instrucciones para establecer la contraseña.'
            ) {
                showAndHideMessage(data.message, setSuccessMessage);
                setIsPending(false);
            }

            if (data?.message === 'Error al crear el usuario') {
                showAndHideMessage('El usuario ya existe o ha ocurrido un error', setErrorMessage);
                setIsPending(false);
                return;
            }

            if (sensorIds.length >= 1) {
                const users = await fetchAllUsers();
                if (users.length === 0) return;
                const userId = users.find((user) => user.correo === email)?.id;
                if (!userId) return;
                await Promise.all(
                    sensorIds.map(async (sensorId) => {
                        await assignSensorToUser(sensorId, userId);
                    })
                );
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

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="sensor-select-label">Sensores</InputLabel>
                <Select
                    labelId="sensor-select-label"
                    multiple
                    value={sensorIds}
                    onChange={(e) => setSensorIds(e.target.value as string[])}
                    input={<OutlinedInput label="Sensores" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip
                                    key={value}
                                    label={
                                        sensors.find((sensor) => sensor.dispositivo_id === value)
                                            ?.nombre_dispositivo || value
                                    }
                                />
                            ))}
                        </Box>
                    )}
                >
                    {sensors.map((sensor) => (
                        <MenuItem key={sensor.id} value={sensor.dispositivo_id}>
                            {sensor.nombre_dispositivo || sensor.dispositivo_id}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                <Typography variant="h6">Pre-registrar usuario</Typography>
            </Box>

            {renderForm}
        </>
    );
}
