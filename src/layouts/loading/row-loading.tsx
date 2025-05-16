import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export const RowLoading = () => (
    <Stack direction="column" spacing={1}>
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
    </Stack>
)