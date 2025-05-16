import {useState, useEffect} from 'react';
import {useMutation} from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from "@mui/lab/LoadingButton";

import {Scrollbar} from "../../../components/scrollbar";
import {ErrorAlert} from "../../../layouts/alert/error-alert";
import {SuccessAlert} from "../../../layouts/alert/success-alert";
import {editWebhook} from "../../../api-requests/webhookts/admin-webhooks";

import type {WebhookData} from "../../../api-requests/webhookts/schema";


type EditWebhookProps = {
    refetchWebhooks: () => void;
    onClose: () => void;
    isOpen: boolean;
    webhook: WebhookData;
}

export const EditWebhook = ({
    refetchWebhooks,
    onClose,
    isOpen,
    webhook
}: EditWebhookProps) => {
    const [model, setModel] = useState("");
    const [url, setUrl] = useState("");
    const [networkServer, setNetworkServer] = useState("");

    useEffect(() => {
        setUrl(webhook?.url);
        setNetworkServer(webhook?.networkServer);
        setModel(webhook?.model);
    }, [webhook])

    const mutation = useMutation({
        mutationKey: ["create-new-webhook", isOpen, webhook.id],
        mutationFn: ({ id, newModel, newUrl, newNetworkServer }: {
            id: number,
            newModel: string,
            newUrl: string,
            newNetworkServer: string
        }) => editWebhook(id, newModel, newUrl, newNetworkServer),
        onSuccess: () => {
            refetchWebhooks();
        }
    })

    const onEditWebhook = () => {
        if (!model || !url || !networkServer || !webhook.id) return;

        mutation.mutate({
            id: webhook.id,
            newModel: model,
            newUrl: url,
            newNetworkServer: networkServer
        })
    };

    return (
            <Drawer
                open={isOpen}
                onClose={onClose}
                anchor="right"
                sx={{ height: '100vh' }}
            >
                <Scrollbar>
                    <Box
                        sx={{
                            width: {
                                xs: 300,
                                sm: 500,
                                md: 600,
                            },
                            p: {
                                xs: 1.5,
                                sm: 4,
                            }
                        }}
                    >
                        <Typography variant="subtitle1">Editar {webhook?.model}</Typography>

                        <Stack direction="column" spacing={2} mt={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Modelo"
                                value={model}
                                onChange={e => setModel(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                label="Url"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                size="small"
                                label="Network service"
                                value={networkServer}
                                onChange={e => setNetworkServer(e.target.value)}
                            />
                        </Stack>

                        <LoadingButton
                            variant="contained"
                            fullWidth
                            sx={{ my: 2 }}
                            onClick={onEditWebhook}
                            loading={mutation.isPending}
                            disabled={mutation.isPending}
                        >
                            Actualizar webhook
                        </LoadingButton>

                        {mutation.isError && <ErrorAlert message={`${mutation.error}`} />}

                        {mutation.isSuccess && (
                            <SuccessAlert message="webhook actualizado" />
                        )}
                    </Box>
                </Scrollbar>
            </Drawer>
    );
};
