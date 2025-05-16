'use client';

import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Global } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { useAuth } from '../../context/AuthContext';
import {Scrollbar} from "../../components/scrollbar";
import { getUserRanches } from '../../api-requests/ranches/user-ranches';

const drawerBleeding = 56;

const StyledBox = styled('div')(() => ({
    backgroundColor: '#fff',
    boxShadow: '0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)',
}));

const Puller = styled('div')(() => ({
    width: 30,
    height: 6,
    backgroundColor: '#637381',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

export const UserRanchDrawer = () => {
    const { userData } = useAuth();

    const { data: userRanches } = useQuery({
        queryKey: ["user-ranchs", userData?.id],
        queryFn: () => getUserRanches(userData?.id),
        enabled: !!userData?.id,
    });

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const isMobile = useMediaQuery('(max-width:600px)');

    if (!isMobile || !userRanches?.length) {
        return null;
    }

    return (
        <>
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(60% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <StyledBox
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                >
                    <Puller />
                    <Typography sx={{ p: 2, color: 'text.secondary' }}>Ranchos</Typography>
                </StyledBox>
                <Box
                    sx={{
                        px: 2,
                        pb: 2,
                        height: '100%',
                        overflow: 'auto',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <Scrollbar>
                        <List>
                            {userRanches.map((ranch) => (
                                    <ListItem key={crypto.randomUUID()}>
                                        <Link
                                            to={`/ranch/${ranch.id}?name=${ranch.name}`}
                                            style={{ textDecoration: 'inherit', color: 'inherit' }}
                                        >
                                            {ranch.name}
                                        </Link>
                                    </ListItem>
                                ))}
                        </List>
                    </Scrollbar>
                </Box>
            </SwipeableDrawer>
        </>
    );
};
