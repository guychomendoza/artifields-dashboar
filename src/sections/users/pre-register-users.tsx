import type { TokenUser } from 'src/api-requests/type';

import { useState, useEffect, useCallback } from 'react';

import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { fetchUsersWithExpiredTokens } from 'src/api-requests/users';

import { PreRegisterUserAction } from './pre-register-user-action';

export const PreRegisterUsers = () => {
    const [users, setUsers] = useState<TokenUser[]>([]);

    const fetchUsers = useCallback(async () => {
        const data = await fetchUsersWithExpiredTokens();
        if (!data.length) return;
        setUsers(data);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <>
            {users.length >= 1 ? (
                <>
                    <Typography variant="h6" mt={5}>
                        Usuarios pre-registrados
                    </Typography>
                    <Card sx={{ mt: 1 }}>
                        <CardContent>
                            <List>
                                {users.map((user) => (
                                    <PreRegisterUserAction key={user.id} user={user} />
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </>
            ) : null}
        </>
    );
};
