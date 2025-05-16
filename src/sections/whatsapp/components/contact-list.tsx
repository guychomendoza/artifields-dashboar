import {format} from "date-fns";
import {useQuery} from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import {ScrollableContent} from "./scrollable-content";
import {ErrorAlert} from "../../../layouts/alert/error-alert";
import {ColumnLoading} from "../../../layouts/loading/column-loading";
import {getAllLatestMessageResponses} from "../../../api-requests/whatsapp/admin-messages";

type ContactsListProps = {
    onContactSelect: (contact: string) => void;
}

export const ContactsList = ({ onContactSelect }: ContactsListProps) => {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["whatsapp-messages"],
        queryFn: getAllLatestMessageResponses,
    })

    if (isError) {
        return (
            <ErrorAlert message={error.message} />
        )
    }

    if (isLoading) {
        return (
            <ColumnLoading />
        )
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 150px)',
        }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar >
                    <Typography variant="h6">Messages</Typography>
                </Toolbar>
            </AppBar>
            <ScrollableContent>
                <Stack spacing={1} sx={{ p: 2 }}>
                    {data?.data.map((contact) => (
                        <Card
                            key={crypto.randomUUID()}
                            elevation={0}
                            sx={{
                                p: 2,
                                cursor: 'pointer',
                                position: "relative",
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                            onClick={() => onContactSelect(contact.phoneNumber)}
                        >
                            <Typography variant="subtitle1">{contact.phoneNumber}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {contact.message}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    alignSelf: 'flex-end',
                                    color: 'text.secondary'
                                }}
                            >
                                {contact.latestCreatedAt
                                    ? format(new Date(contact.latestCreatedAt), "MMM d, yyyy, h:mm a")
                                    : ""}
                            </Typography>
                        </Card>
                    ))}
                </Stack>
            </ScrollableContent>
        </Box>
    );
};