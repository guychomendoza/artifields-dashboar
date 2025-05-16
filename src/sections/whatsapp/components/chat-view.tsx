import {Fragment} from "react";
import {format} from "date-fns";
import ReactMarkdown from "react-markdown";
import {useQuery} from "@tanstack/react-query";

import Box from "@mui/material/Box"
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import {Iconify} from "../../../components/iconify";
import {ScrollableContent} from "./scrollable-content";
import {ErrorAlert} from "../../../layouts/alert/error-alert";
import {ColumnLoading} from "../../../layouts/loading/column-loading";
import {getAllPhoneConversation} from "../../../api-requests/whatsapp/admin-messages";

type ChatViewProps = {
    selectedContact: string | null;
    onBackClick: (() => void) | undefined;
}

export const ChatView = ({
    selectedContact,
    onBackClick
}: ChatViewProps) => {
    const { data, isError, error, isLoading } = useQuery({
        queryKey: [`whatsapp-messages-${selectedContact}`],
        queryFn: () => getAllPhoneConversation(selectedContact || ""),
        enabled: !!selectedContact,
    })

    if (isError) {
        return (
            <ErrorAlert message={error.message} />
        )
    }
    
    if (isLoading) {
        return (
            <ColumnLoading numberOfColumns={10} />
        )
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 150px)',
        }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    {onBackClick && (
                        <IconButton
                            edge="start"
                            sx={{ mr: 1 }}
                            onClick={onBackClick}
                        >
                            <Iconify icon="solar:alt-arrow-left-line-duotone" width={30} />
                        </IconButton>
                    )}
                    <Typography variant="h6">
                        {selectedContact || 'Select a contact'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <ScrollableContent>
                {selectedContact ? (
                    <Stack spacing={1} sx={{ p: 2 }}>
                        {data?.data.map((message) => (
                            <Fragment key={crypto.randomUUID()}>
                                <Card
                                    sx={{
                                        p: 2,
                                        maxWidth: '80%',
                                        alignSelf:'flex-start',
                                    }}
                                >
                                    <Typography variant="body1">{message.message}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {message.createdAt
                                            ? format(new Date(message.createdAt), "MMM d, yyyy, h:mm a")
                                            : ""}
                                    </Typography>
                                </Card>

                                <Card
                                    sx={{
                                        p: 2,
                                        maxWidth: '80%',
                                        alignSelf: 'flex-end'
                                    }}
                                >
                                    <ReactMarkdown>{message.response}</ReactMarkdown>
                                    <Typography variant="caption" color="text.secondary">
                                        {message.createdAt
                                            ? format(new Date(message.createdAt), "MMM d, yyyy, h:mm a")
                                            : ""}
                                    </Typography>
                                </Card>
                            </Fragment>
                        ))}
                    </Stack>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                    }}>
                        <Typography color="text.secondary">
                            Selecciona un contacto para ver las conversaciones
                        </Typography>
                    </Box>
                )}
            </ScrollableContent>
        </Box>
    );
};