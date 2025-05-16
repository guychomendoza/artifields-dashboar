import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

export const YourSensorsLoading = () => (
    <>
        <Grid
            item
            xs={12}
            md={6}
            sx={{
                height: '100%',
                overflowY: 'auto',
            }}
        >
            <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                    <Grid item key={i} padding={1} xs={6} sm={4} md={6}>
                        <Skeleton variant="rectangular" height="20rem" sx={{ borderRadius: 2 }}/>
                    </Grid>
                ))}
            </Grid>
        </Grid>

        <Grid
            item
            xs={12}
            md={6}
            sx={{
                height: {
                    xs: '600px',
                    md: '100%',
                },
            }}
        >
            <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }}/>
        </Grid>
    </>
);
