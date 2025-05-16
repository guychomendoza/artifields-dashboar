import type { TokenUser } from 'src/api-requests/type';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { BACKEND_URL } from 'src/api-requests/api-url';

import { Iconify } from 'src/components/iconify';

export const PreRegisterUserAction = ({ user }: { user: TokenUser }) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onResendToken = async () => {
        if (!user || !user.correo) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/resend-reset-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: user.correo }),
            });
            const data = await res.json();
            if (data.message === 'Nueva URL enviada al correo electrónico.') {
                setSuccessMessage('Correo reenviado correctamente');
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <ListItem
                key={user.id}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                bgcolor: (theme) => theme.palette.primary.main,
                            }}
                        >
                            {user?.nombre[0]?.toUpperCase()}
                            {user?.nombre[1]?.toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.nombre} secondary={user.correo} />
                </Box>
                <Box
                    sx={{
                        mt: { xs: 1, sm: 0 },
                        width: { xs: '100%', sm: 'auto' },
                        display: 'flex',
                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Reenviar código">
                            <IconButton aria-label="Reenviar código" onClick={onResendToken}>
                                <Iconify icon="solar:chat-square-arrow-bold-duotone" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            </ListItem>
            {successMessage && (
                <Snackbar
                    open={!!successMessage}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};
