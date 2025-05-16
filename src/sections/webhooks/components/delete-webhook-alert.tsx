import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { Iconify } from '../../../components/iconify';
import { deleteWebhook } from '../../../api-requests/webhookts/admin-webhooks';

type DeleteWebhookAlertProps = {
    webhookModel: string;
    webhookId: number;
    refetchWebhooks: () => void;
};

export const DeleteWebhookAlert = ({
    webhookModel,
    webhookId,
    refetchWebhooks,
}: DeleteWebhookAlertProps) => {
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationKey: ['delete-webhook', webhookId],
        mutationFn: ({ id }: { id: number }) => deleteWebhook(id),
        onSuccess: () => {
            refetchWebhooks();
        },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box>
                <IconButton aria-label="borrar webhook" color="error" onClick={handleClickOpen}>
                    <Iconify icon="solar:trash-bin-2-bold-duotone" />
                </IconButton>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{webhookModel}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que deseas eliminar este webhook? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        onClick={() => {
                            mutation.mutate({ id: webhookId });
                        }}
                        autoFocus
                        variant="contained"
                        color="error"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
