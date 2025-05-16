import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { GPKGViewer } from '../gpkg-viewer';

// ----------------------------------------------------------------------

export function MapView() {
    return (
        <DashboardContent>
            <Typography variant="h4">Mapa</Typography>
                <GPKGViewer />
        </DashboardContent>
    );
}
