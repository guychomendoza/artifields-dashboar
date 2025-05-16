import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export const RanchesLoading = () => (
        <Grid
            container
            sx={{
                height: 'calc(100vh - 180px)',
            }}
            spacing={2}
        >
            <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 1 }} />
            </Grid>
        </Grid>
    )