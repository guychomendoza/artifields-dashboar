import TableCell from "@mui/material/TableCell";

import {Iconify} from "../../components/iconify";

import type {SortDirection} from "../../hooks/use-filter-table";

type SortableTableCellProps = {
    sortKey: string;
    children?: React.ReactNode;
    requestSort: (key: string, ) => void
    getSortDirection:  (key: string) => SortDirection
}

export const SortableTableCell = ({
    children,
    sortKey,
    requestSort,
    getSortDirection
}: SortableTableCellProps) => {
    const direction = getSortDirection(sortKey);
    return (
        <TableCell
            onClick={() => requestSort(sortKey)}
            sx={{
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap'
            }}
            aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {children}
                {direction === 'asc' && <Iconify icon="solar:alt-arrow-up-line-duotone" width="16" />}
                {direction === 'desc' && <Iconify icon="solar:alt-arrow-down-line-duotone" width="16" />}
            </div>
        </TableCell>
    );
};