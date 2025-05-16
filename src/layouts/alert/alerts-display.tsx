import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Portal from '@mui/material/Portal';
import Typography from '@mui/material/Typography';

interface AlertMessage {
    type: 'info' | 'error' | 'success';
    message: string;
    pages: string[];
    active: boolean;
}

const sampleAlerts: AlertMessage[] = [
    {
        type: 'error',
        message: 'Estamos en mantenimiento.',
        pages: ['/alerts', '/webhooks'],
        active: false,
    },
];

export const AlertDisplay = () => {
    const location = useLocation();

    const relevantAlerts = sampleAlerts.filter(
        (alert) => alert.active && alert.pages.includes(location.pathname)
    );

    if (relevantAlerts.length === 0) return null;

    return (
        <Box
            sx={{
                pointerEvents: 'none',
            }}
        >
            {relevantAlerts.map((alert, index) => (
                <Alert
                    key={index}
                    severity={alert.type}
                    variant="standard"
                    sx={{
                        mb: 1,
                        pointerEvents: 'auto',
                        boxShadow: '0 2px 8px 0 rgb(0,0,0,0.05)',
                        border: "1px solid rgb(0,0,0,0.05)",
                        '& .MuiAlert-message': {
                            width: '100%',
                        },
                    }}
                >
                    <Typography>{alert.message}</Typography>
                </Alert>
            ))}
        </Box>
    );
};
