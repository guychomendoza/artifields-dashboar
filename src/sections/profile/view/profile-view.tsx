import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { UserCard } from '../user-card';
import {EditProfile} from "../edit-profile";

// ----------------------------------------------------------------------

export function ProfileView() {
    return (
        <DashboardContent>
            <Typography variant="h4">Profile</Typography>
            <UserCard />
            <EditProfile />
        </DashboardContent>
    );
}
