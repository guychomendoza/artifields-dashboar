import type { User } from 'src/api-requests/type';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { fetchAllUsers } from 'src/api-requests/users';

import {SearchUser} from "./search-user";
import { EditUser } from './edit-user.js';
import { UserItem } from './user-item.js';
import { SelectedModal } from './types.js';
import { DeleteUser } from './delete-user.js';
import { ChangePasswordModal } from './change-password-modal.js';

export const AllUserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userToSearch, setUserToSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedModal, setSelectedModal] = useState<SelectedModal | null>(null);
    const hanldeCloseModal = () => setSelectedModal(null);

    const fetchUsers = useCallback(async () => {
        const data = await fetchAllUsers();
        if (!data.length) return;
        setUsers(data);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const allUsers =
        userToSearch
            ? users.filter((user) => user.nombre.toLowerCase().includes(userToSearch) || user.correo.toLowerCase().includes(userToSearch))
            : users;

    return (
        <>
            <Typography variant="h6" mt={5}>
                Usuarios Registrados
            </Typography>
            <Card sx={{ mt: 1 }}>
                <Box sx={{p: 1}}>
                    <SearchUser onSearch={setUserToSearch}/>
                </Box>
                <CardContent>
                    <List>
                        {allUsers.map((user, idx) => (
                            <UserItem
                                key={user.id}
                                user={user}
                                setSelectedUser={setSelectedUser}
                                refetch={fetchUsers}
                                setSelectedModal={setSelectedModal}
                                idx={idx + 1}
                            />
                        ))}
                    </List>
                </CardContent>
            </Card>

            <ChangePasswordModal
                open={selectedModal === SelectedModal.CHANGE_PASSWORD}
                handleClose={hanldeCloseModal}
                user={selectedUser}
            />

            <DeleteUser
                open={selectedModal === SelectedModal.DELETE_USER}
                handleClose={hanldeCloseModal}
                user={selectedUser}
                refetchData={fetchUsers}
            />

            <EditUser
                open={selectedModal === SelectedModal.EDIT_USER}
                handleClose={hanldeCloseModal}
                user={selectedUser}
                refetchData={fetchUsers}
            />
        </>
    );
};
