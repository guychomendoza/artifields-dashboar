import {useState} from "react";

import Box from "@mui/material/Box";
import {useMediaQuery} from "@mui/material";

import {ChatView} from "./components/chat-view";
import {ContactsList} from "./components/contact-list";
import {DashboardContent} from "../../layouts/dashboard";

export function WhatsappView() {
    const [selectedContact, setSelectedContact] = useState<string|null>(null);
    const isDesktop = useMediaQuery('(min-width:900px)');

    const handleContactSelect = (contact: string) => {
        setSelectedContact(contact);
    };

    const handleBackClick = () => {
        setSelectedContact(null);
    };

    return (
        <DashboardContent>
            <Box sx={{
                display: 'flex',
            }}>
                <Box sx={{
                    display: isDesktop || !selectedContact ? 'block' : 'none',
                    width: isDesktop ? '30%' : '100%',
                    borderRight: 1,
                    borderColor: 'divider'
                }}>
                    <ContactsList onContactSelect={handleContactSelect} />
                </Box>
                <Box sx={{
                    display: isDesktop || selectedContact ? 'block' : 'none',
                    width: isDesktop ? '70%' : '100%',
                    height: '100%'
                }}>
                    <ChatView
                        selectedContact={selectedContact}
                        onBackClick={!isDesktop ? handleBackClick : undefined}
                    />
                </Box>
            </Box>
        </DashboardContent>
    );
}