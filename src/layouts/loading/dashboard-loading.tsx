import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export const DashboardLoading = () => (
    <Grid container spacing={2}>
        {
            [...Array(9)].map((_, i) => (
                <Grid key={i} item xs={12} md={4}>
                    <Skeleton variant="rectangular" height={i < 6 ? 300 : 100} sx={{borderRadius: 2}}/>
                </Grid>
            ))
        }
    </Grid>
)