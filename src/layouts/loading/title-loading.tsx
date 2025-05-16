import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

export const TitleLoading = () => (
    <Stack direction="column" gap={1}>
        <Skeleton variant="rectangular" width={300} height={50} sx={{borderRadius: 2}} />
        <Skeleton variant="rectangular" width={200} height={30} sx={{borderRadius: 2}} />
    </Stack>
)