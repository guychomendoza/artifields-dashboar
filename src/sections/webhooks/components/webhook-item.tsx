import type { Dispatch, SetStateAction } from 'react';

import { useState } from 'react';

import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from '../../../components/iconify';
import { DeleteWebhookAlert } from './delete-webhook-alert';

import type { WebhookData } from '../../../api-requests/webhookts/schema';

type WebhookItemProps = {
    id: number;
    model: string;
    networkServer: string;
    url: string;
    refetchWebhooks: () => void;
    setSelectedWebhook: Dispatch<SetStateAction<WebhookData | null>>;
    idx: number;
};

export const WebhookItem = ({
    id,
    model,
    networkServer,
    url,
    refetchWebhooks,
    setSelectedWebhook,
    idx,
}: WebhookItemProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setOpenSnackbar(true);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    return (
        <>
            <TableRow
                style={{
                    backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255)' : 'rgba(250,250,250)',
                }}
            >
                <TableCell>{model}</TableCell>
                <TableCell>{networkServer}</TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <DeleteWebhookAlert
                            webhookId={id}
                            webhookModel={model}
                            refetchWebhooks={refetchWebhooks}
                        />
                        <IconButton
                            aria-label="editar webhook"
                            onClick={() =>
                                setSelectedWebhook({
                                    id,
                                    model,
                                    networkServer,
                                    url,
                                })
                            }
                        >
                            <Iconify icon="solar:pen-2-bold-duotone" />
                        </IconButton>
                    </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 1,
                            px: 2,
                            borderRadius: 1,
                        }}
                    >
                        <Box
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                mr: 2,
                            }}
                        >
                            {url}
                        </Box>
                        <IconButton onClick={copyToClipboard} size="small" sx={{ flexShrink: 0 }}>
                            <Iconify icon="solar:copy-bold-duotone" />
                        </IconButton>
                    </Box>
                </TableCell>
            </TableRow>

            {isMobile && (
                <TableRow>
                    <TableCell
                        colSpan={4}
                        sx={{
                            bgcolor: 'grey.50',
                            border: 'none',
                            '&:last-child': { borderBottom: 1, borderColor: 'divider' },
                        }}
                    >
                        <Box
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={copyToClipboard}
                        >
                            {url}
                        </Box>
                    </TableCell>
                </TableRow>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                message="URL copiada al portapapeles"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </>
    );
};
