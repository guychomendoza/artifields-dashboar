import type { User } from 'src/api-requests/type';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { Iconify } from 'src/components/iconify';

import { SelectedModal } from './types';

const USER_PERMISSIONS: Record<number, string[]> = {
    1: ['ver'],
    2: ['ver', 'editar', 'asignar'],
    3: ['ver', 'editar', 'asignar', 'usuarios', 'login'],
};

export const UserItem = ({
    user,
    setSelectedUser,
    refetch,
    setSelectedModal,
    idx
}: {
    user: User;
    setSelectedUser: (user: User | null) => void;
    refetch: () => void;
    setSelectedModal: (modal: SelectedModal) => void;
    idx: number;
}) => {

    const userPermissions = USER_PERMISSIONS[user.tipo_usuario] || [];

    return (
        <ListItem
            key={user.id}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                width: '100%',
                px: 2,
                py: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    width: '100%',
                    mb: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        {idx}
                    </Typography>
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                        width: { xs: '100%', sm: 'auto' },
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Cambiar contraseña">
                            <IconButton
                                aria-label="cambiar contraseña"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setSelectedModal(SelectedModal.CHANGE_PASSWORD);
                                }}
                            >
                                <Iconify icon="solar:lock-password-unlocked-bold" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar usuario">
                            <IconButton
                                aria-label="edit user"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setSelectedModal(SelectedModal.EDIT_USER);
                                }}
                            >
                                <Iconify icon="solar:pen-bold" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                            <IconButton
                                color="error"
                                aria-label="delete user"
                                onClick={() => {
                                    setSelectedUser(user);
                                    setSelectedModal(SelectedModal.DELETE_USER);
                                }}
                            >
                                <Iconify icon="solar:trash-bin-2-bold" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            </Box>

            {/* Permissions Badge Row */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    width: '100%',
                    justifyContent: 'flex-start',
                }}
            >
                {userPermissions.map((permission) => (
                    <Chip
                        key={permission}
                        label={permission}
                        size="small"
                        color="default"
                        sx={{
                            backgroundColor: (theme) => theme.palette.grey[300],
                            color: (theme) => theme.palette.text.secondary,
                            fontSize: '0.675rem',
                        }}
                    />
                ))}
            </Box>
        </ListItem>
    );
};
