import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AllUserList } from '../all-user-list';
import { PreRegisterUsers } from '../pre-register-users';

// ----------------------------------------------------------------------

export function UsersView() {
    return (
        <DashboardContent>
            <Typography variant="h4">Usuarios</Typography>
            <AllUserList />
            <PreRegisterUsers />
        </DashboardContent>
    );
}
