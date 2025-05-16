import type { ReportResponse } from 'src/api-requests/type';

import { useState, useCallback } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

import { SensorReportPDF } from './sensor-report-pdf';

// ----------------------------------------------------------------------

// export type UserProps = {
//     id: string;
//     name: string;
//     role: string;
//     status: string;
//     company: string;
//     avatarUrl: string;
//     isVerified: boolean;
// };

type ReportRowProps = {
    row: ReportResponse;
    selected: boolean;
    onSelectRow: () => void;
};

export function ReportRow({ row, selected, onSelectRow }: ReportRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
                </TableCell>

                <TableCell component="th" scope="row">
                    {row.file_name}
                </TableCell>

                <TableCell>
                    <PDFDownloadLink
                        document={
                            <SensorReportPDF
                                plotSrc={row.image_url}
                                title={row.file_name}
                                content={row.suggestions}
                            />
                        }
                        fileName={`${row.file_name}.pdf`}
                    >
                        Descargar PDF
                    </PDFDownloadLink>
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem onClick={handleClosePopover}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>

                    <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
