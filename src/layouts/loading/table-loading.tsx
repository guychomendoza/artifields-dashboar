import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export const TableLoading = () => (
        <Stack direction="column" spacing={1}>
            <Skeleton variant="rectangular" height={70} sx={{borderTopRightRadius: 16, borderTopLeftRadius: 16}} />
            <Skeleton variant="rectangular" height={100}/>
            <Skeleton variant="rectangular" height={100}/>
            <Skeleton variant="rectangular" height={100}/>
            <Skeleton variant="rectangular" height={100} sx={{borderBottomLeftRadius: 16, borderBottomRightRadius: 16}}/>
        </Stack>
    )