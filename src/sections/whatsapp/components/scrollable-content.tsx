import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';

export const ScrollableContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.background.default,
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.grey[300],
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.grey[400],
    },
}));