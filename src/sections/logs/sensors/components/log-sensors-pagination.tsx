import type {Dispatch, SetStateAction} from "react";

import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import {Iconify} from "../../../../components/iconify";

type LogsSensorPaginationProps = {
    hasNextPage: boolean;
    setPage: Dispatch<SetStateAction<number>>;
    limit: number;
    setLimit: Dispatch<SetStateAction<number>>;
    numberOfPages: number;
    currentPage: number;
    isPlaceholderData: boolean;
}

export const LogsSensorPagination = ({
    hasNextPage,
    setPage,
    limit,
    setLimit,
    numberOfPages,
    currentPage,
    isPlaceholderData
}: LogsSensorPaginationProps) => {
    const onGoToFirstPage = () => {
        if (currentPage === 1) return;
        setPage(1);
    }

    const onGoToLastPage = () => {
        if (currentPage === numberOfPages) return;
        setPage(numberOfPages);
    }

    const onGoToNextPage = () => {
        if (isPlaceholderData && !hasNextPage) return;
        setPage((prev) => prev + 1)
    }

    const onGoToPrevPage = () => {
        if (currentPage === 1) return;
        setPage((old) => old - 1);
    }

    const onChangeLimit = (value: number) => {
        setLimit(value);
        setPage(1);
    }

    return (
        <Card
            sx={{
                mt: 2,
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                width: "min-content",
                mx: "auto",
            }}
        >
            <IconButton
                aria-label="primera página"
                disabled={currentPage === 1}
                onClick={onGoToFirstPage}
            >
                <Iconify icon="solar:double-alt-arrow-left-line-duotone" />
            </IconButton>

            <IconButton
                aria-label="página anterior"
                disabled={currentPage === 1}
                onClick={onGoToPrevPage}
            >
                <Iconify icon="solar:alt-arrow-left-line-duotone" />
            </IconButton>

            <Select
                size="small"
                value={limit}
                onChange={(e) => onChangeLimit(Number(e.target.value))}
            >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
            </Select>

            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {currentPage} / {numberOfPages}
            </Typography>

            <IconButton
                aria-label="página siguiente"
                disabled={isPlaceholderData || !hasNextPage}
                onClick={onGoToNextPage}
            >
                <Iconify icon="solar:alt-arrow-right-line-duotone" />
            </IconButton>

            <IconButton
                aria-label="última página"
                disabled={isPlaceholderData || !hasNextPage || currentPage === numberOfPages}
                onClick={onGoToLastPage}
            >
                <Iconify icon="solar:double-alt-arrow-right-line-duotone" />
            </IconButton>
        </Card>
    )
}