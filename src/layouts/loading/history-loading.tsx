import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

export const HistoryLoading = () => (
        <Stack direction="column" spacing={2}>
            <Skeleton variant="rectangular" width="30%" height={50} sx={{borderRadius: 1}} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{borderRadius: 1}} />
            <Skeleton variant="rectangular" width="100%" height={150} sx={{borderRadius: 1}} />
        </Stack>
    )