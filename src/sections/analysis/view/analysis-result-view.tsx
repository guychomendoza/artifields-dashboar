import { Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { ResultsMap } from '../results-map';

export const AnalysisResultView = () => (
    <DashboardContent>
        <Typography variant="h4" marginBottom={2}>
            Resultado del análisis
        </Typography>
        <ResultsMap />
    </DashboardContent>
);
