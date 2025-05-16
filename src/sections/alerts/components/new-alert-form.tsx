import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from "@mui/material/Card";
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';

interface AlertData {
    type: 'info' | 'error' | 'success';
    message: string;
    pages: string[];
    active: boolean;
}

interface AlertType {
    value: AlertData['type'];
    label: string;
}

export const NewAlertForm = () => {
    const [alert, setAlert] = useState<AlertData>({
        type: 'info',
        message: '',
        pages: [],
        active: true
    });

    const alertTypes: AlertType[] = [
        { value: 'info', label: 'Información' },
        { value: 'error', label: 'Error' },
        { value: 'success', label: 'Éxito' }
    ];

    const availablePages: string[] = [
        '/assigned-sensors',
        '/forecast',
        '/home',
        '/projects',
        '/map',
        '/sensors-report',
        '/sensors',
        '/register',
        '/users',
        '/cms',
        '/logs',
        '/whatsapp',
        '/webhooks',
        '/alerts'
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Enviando alerta:', alert);
    };

    const getAlertSeverity = (type: AlertData['type']): AlertData['type'] => {
        switch (type) {
            case 'error':
                return 'error';
            case 'success':
                return 'success';
            default:
                return 'info';
        }
    };

    return (
        <Card sx={{ maxWidth: 800, margin: '0 auto', p: 3, width: "100%", mt: 2 }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Tipo de Alerta</InputLabel>
                        <Select
                            value={alert.type}
                            label="Tipo de Alerta"
                            onChange={(e) => setAlert(prev => ({ ...prev, type: e.target.value as AlertData['type'] }))}
                        >
                            {alertTypes.map(type => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Mensaje"
                        multiline
                        rows={4}
                        value={alert.message}
                        onChange={(e) => setAlert(prev => ({ ...prev, message: e.target.value }))}
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <Autocomplete
                            multiple
                            value={alert.pages}
                            onChange={(_event, newValue: string[]) => {
                                setAlert(prev => ({ ...prev, pages: newValue }));
                            }}
                            options={availablePages}
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={option}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Páginas"
                                    placeholder="Selecciona páginas"
                                />
                            )}
                        />
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={alert.active}
                                onChange={(e) => setAlert(prev => ({ ...prev, active: e.target.checked }))}
                                color="primary"
                            />
                        }
                        label="Activo"
                    />

                    {alert.message && (
                        <Alert severity={getAlertSeverity(alert.type)} sx={{ mt: 2 }}>
                            {alert.message}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Crear Alerta
                    </Button>
                </Box>
            </form>
        </Card>
    );
};