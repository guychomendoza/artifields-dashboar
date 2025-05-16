import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

type ColumnLoadingProps = {
    numberOfColumns?: number;
}

export const ColumnLoading = ({
    numberOfColumns = 5
}: ColumnLoadingProps) => (
    <Stack direction="column" gap={2}>
        {
            [...Array(numberOfColumns)].map((_, i) => (
                <Skeleton
                    key={i}
                    variant="rectangular"
                    width="100%"
                    height={100}
                    sx={{
                        borderRadius: 1
                    }}
                />
            ))
        }
    </Stack>
)