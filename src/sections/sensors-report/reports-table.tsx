import type { ReportResponse } from 'src/api-requests/type';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';

import { Scrollbar } from 'src/components/scrollbar';

import { ReportRow } from './report-row';
import { TableNoData } from '../user/table-no-data';
import { UserTableHead } from '../user/user-table-head';
import { TableEmptyRows } from '../user/table-empty-rows';
import { UserTableToolbar } from '../user/user-table-toolbar';
import { emptyRows, getComparator, applyFilterReport } from '../user/utils';
// import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function ReportsTable({ reports }: { reports: ReportResponse[] }) {
    const table = useTable();

    const [filterName, setFilterName] = useState('');

    const dataFiltered: ReportResponse[] = applyFilterReport({
        inputData: reports,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Card sx={{ mt: 3 }}>
            <UserTableToolbar
                numSelected={table.selected.length}
                filterName={filterName}
                onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFilterName(event.target.value);
                    table.onResetPage();
                }}
            />

            <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <UserTableHead
                            order={table.order}
                            orderBy={table.orderBy}
                            rowCount={_users.length}
                            numSelected={table.selected.length}
                            onSort={table.onSort}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    _users.map((user) => user.id)
                                )
                            }
                            headLabel={[
                                { id: 'name', label: 'Name' },
                                { id: 'pdf', label: 'PDF' },
                                { id: '' },
                            ]}
                        />
                        <TableBody>
                            {dataFiltered
                                .slice(
                                    table.page * table.rowsPerPage,
                                    table.page * table.rowsPerPage + table.rowsPerPage
                                )
                                .map((row) => (
                                    <ReportRow
                                        row={row}
                                        key={row.id}
                                        selected={table.selected.includes(String(row.id))}
                                        onSelectRow={() => table.onSelectRow(String(row.id))}
                                    />
                                ))}

                            <TableEmptyRows
                                height={68}
                                emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                            />

                            {notFound && <TableNoData searchQuery={filterName} />}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>

            <TablePagination
                component="div"
                page={table.page}
                count={_users.length}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
            />
        </Card>
    );
}

// ----------------------------------------------------------------------

export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const onSort = useCallback(
        (id: string) => {
            const isAsc = orderBy === id && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    return {
        page,
        order,
        onSort,
        orderBy,
        selected,
        rowsPerPage,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage,
    };
}
