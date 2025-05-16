import type { Project } from 'src/api-requests/type';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { useAuth } from 'src/context/AuthContext';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetchProjects } from 'src/api-requests/projects';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { NewProjectModal } from '../new-project-modal';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function ProjectView() {
    const { userData } = useAuth();
    const table = useTable();

    const [projects, setProjects] = useState<Project[]>([]);
    const [filterName, setFilterName] = useState('');

    const dataFiltered: Project[] = applyFilter({
        inputData: projects,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    const fetchData = useCallback(async () => {
        if (!userData) return;
        const data = await fetchProjects(userData.id);
        setProjects(data);
    }, [userData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Proyectos
                </Typography>
                <NewProjectModal refetchData={fetchData} />
            </Box>

            <Card>
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
                                    // { id: 'company', label: 'Company' },
                                    // { id: 'role', label: 'Role' },
                                    { id: 'isVerified', label: 'Verified', align: 'center' },
                                    { id: 'status', label: 'Status' },
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
                                        <UserTableRow
                                            key={row.id}
                                            row={row}
                                            selected={table.selected.includes(String(row.id))}
                                            onSelectRow={() => table.onSelectRow(String(row.id))}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(
                                        table.page,
                                        table.rowsPerPage,
                                        _users.length
                                    )}
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
        </DashboardContent>
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
