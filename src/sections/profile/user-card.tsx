import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAuth } from 'src/context/AuthContext';

export const UserCard = () => {
    const { userData } = useAuth();

    return (
        <Card>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ width: 56, height: 56 }}>
                        {userData?.nombre ? userData.nombre[0] : ''}
                    </Avatar>
                    <Stack direction="column">
                        <Typography variant="subtitle1">{userData?.nombre}</Typography>
                        <Typography variant="body2">{userData?.correo}</Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};
