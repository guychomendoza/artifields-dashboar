import type {ReactNode} from "react";

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ColumnProps {
    children?: ReactNode;
}

export const Column = ({
    children
}: ColumnProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                borderRight: !isMobile ? 1 : 0,
                borderLeft: !isMobile ? 1 : 0,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {children}
        </Box>
    );
};
