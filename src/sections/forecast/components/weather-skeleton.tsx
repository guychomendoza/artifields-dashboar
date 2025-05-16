import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

export const WeatherSkeleton = () => (
        <>
            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                spacing={2}
                mt={2}
            >
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{
                        borderRadius: 2
                    }}
                />
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{
                        borderRadius: 2
                    }}
                />
            </Stack>

            <Grid container spacing={2} mt={1}>
                {
                    [...Array(12)].map((_, idx) => (
                        <Grid item xs={6} md={4} lg={3} key={idx}>
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={200}
                                sx={{
                                    borderRadius: 2
                                }}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </>
    )