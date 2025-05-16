import {useState} from "react";
import {useQuery, keepPreviousData} from '@tanstack/react-query';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import {WebhookItem} from "./webhook-item";
import {EditWebhook} from "./edit-webhook";
import {WebhookFilters} from "./webhook-filters";
import {CreateNewWebhook} from "./create-new-webhook";
import {ErrorAlert} from "../../../layouts/alert/error-alert";
import {WebhookData} from "../../../api-requests/webhookts/schema";
import {TableLoading} from "../../../layouts/loading/table-loading";
import {getFilteredWebhooks} from "../../../api-requests/webhookts/admin-webhooks";

export const WebhooksTable = () => {
    const [model, setModel] = useState("");
    const [networkServer, setNetworkServer] = useState("");
    const [url, setUrl] = useState("");
    const [selectedWebhook, setSelectedWebhook] = useState<WebhookData|null>(null);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["webhooks", model, networkServer, url],
        queryFn: () => getFilteredWebhooks({ modelFilter: model, serverFilter: networkServer, urlFilter: url }),
        placeholderData: keepPreviousData
    })

    if (isLoading) {
        return <TableLoading />;
    }

    if (isError) {
        return <ErrorAlert message={error.message} />;
    }

    if (!data) {
        return <ErrorAlert message="Sin Datos" />;
    }

    return (
        <>
            <CreateNewWebhook refetchWebhooks={refetch} />
            <Card sx={{mt: 1}}>
                <Box sx={{p: 1}}>
                    <WebhookFilters
                        setModelFilter={setModel}
                        setNetworkServerFilter={setNetworkServer}
                        setUrlFilter={setUrl}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Modelo</TableCell>
                                <TableCell>Servidor de red</TableCell>
                                <TableCell>Acciones</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                    Url
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data?.data.map((webhook, idx) => (
                                    <WebhookItem
                                        key={webhook.id}
                                        id={webhook.id}
                                        model={webhook.model}
                                        url={webhook.url}
                                        networkServer={webhook.networkServer}
                                        refetchWebhooks={refetch}
                                        setSelectedWebhook={setSelectedWebhook}
                                        idx={idx}
                                    />
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {
                selectedWebhook ? (
                    <EditWebhook
                        refetchWebhooks={refetch}
                        onClose={() => setSelectedWebhook(null)}
                        isOpen
                        webhook={selectedWebhook}
                    />
                ) : null
            }
        </>
        )
}