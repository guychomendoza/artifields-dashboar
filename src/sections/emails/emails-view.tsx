import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { SendEmail } from './components/send-email';


// ----------------------------------------------------------------------

export function EmailsView() {
    return (
        <DashboardContent>
            <Typography variant="h4">Nuevo correo</Typography>
            <SendEmail />
        </DashboardContent>
    );
}
