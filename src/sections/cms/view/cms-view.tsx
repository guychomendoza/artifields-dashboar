import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { LoginImages } from '../login-images';

// ----------------------------------------------------------------------

export function CmsView() {
    return (
        <DashboardContent>
            <Typography variant="h4">CMS</Typography>
            <LoginImages />
        </DashboardContent>
    );
}
