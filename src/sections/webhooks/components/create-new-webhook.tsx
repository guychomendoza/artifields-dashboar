import { useState } from 'react';
import {useMutation} from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from "@mui/lab/LoadingButton";

import {Scrollbar} from "../../../components/scrollbar";
import {ErrorAlert} from "../../../layouts/alert/error-alert";
import {SuccessAlert} from "../../../layouts/alert/success-alert";
import {createWebhook} from "../../../api-requests/webhookts/admin-webhooks";


type CreateNewWebhookProps = {
    refetchWebhooks: () => void;
}

export const CreateNewWebhook = ({
    refetchWebhooks
}: CreateNewWebhookProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [model, setModel] = useState("");
    const [url, setUrl] = useState("");
    const [networkServer, setNetworkServer] = useState("");

    const mutation = useMutation({
        mutationKey: ["create-new-webhook", isOpen],
        mutationFn: ({ newModel, newUrl, newNetworkServer }: {
            newModel: string,
            newUrl: string,
            newNetworkServer: string
        }) => createWebhook(newModel, newUrl, newNetworkServer),
        onSuccess: () => {
            setModel("");
            setUrl("");
            setNetworkServer("");
            refetchWebhooks();
        }
    })

    const onCreateNewWebhook = () => {
        if (!model || !url || !networkServer) return;

        mutation.mutate({
            newModel: model,
            newUrl: url,
            newNetworkServer: networkServer
        })
    };

    return (
        <>
            <Stack direction="row" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={() => setIsOpen(true)}
                >
                    Crear Webhook
                </Button>
            </Stack>

            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
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
                        <Typography variant="subtitle1">Crear un nuevo webhook</Typography>

                        <TextField
                            fullWidth
                            size="small"
                            label="Modelo"
                            sx={{ mt: 2 }}
                            value={model}
                            onChange={e => setModel(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Url"
                            sx={{ mt: 1 }}
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Network service"
                            sx={{ mt: 1 }}
                            value={networkServer}
                            onChange={e => setNetworkServer(e.target.value)}
                        />

                        <LoadingButton
                            variant="contained"
                            fullWidth
                            sx={{ my: 2 }}
                            onClick={onCreateNewWebhook}
                            loading={mutation.isPending}
                            disabled={mutation.isPending}
                        >
                            Crear webhook
                        </LoadingButton>

                        {mutation.isError && <ErrorAlert message={`${mutation.error}`} />}

                        {mutation.isSuccess && (
                            <SuccessAlert message="webhook creado" />
                        )}
                    </Box>
                </Scrollbar>
            </Drawer>
        </>
    );
};
