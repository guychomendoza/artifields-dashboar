import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import { Column } from './column';
import { NewRanch } from './new-ranch';
import { EditRanch } from './edit-ranch';
import { Iconify } from '../../../../components/iconify';
import {ErrorAlert} from "../../../../layouts/alert/error-alert";
import {RowLoading} from "../../../../layouts/loading/row-loading";
import { getAllRanchesWithSensors } from '../../../../api-requests/ranches/admin-ranches';

import type {
    RanchWithSensors,
    RanchWithoutSensors,
} from '../../../../api-requests/ranches/schema';

type RanchesColumnProps = {
    onItemClick: (item: RanchWithSensors) => void;
    selectedRanch: RanchWithSensors | null;
};

export const RanchesColumn = ({ onItemClick, selectedRanch }: RanchesColumnProps) => {
    const [isEditRanchDrawerOpen, setIsEditRanchDrawerOpen] = useState(false);
    const [ranchToEdit, setRanchToEdit] = useState<RanchWithoutSensors | null>(null);

    const onCloseEditRanchDrawer = () => {
        setIsEditRanchDrawerOpen(false);
        setRanchToEdit(null);
    };

    const { data, refetch, isLoading, isError, error } = useQuery({
        queryKey: ['all-ranches-with-sensors'],
        queryFn: getAllRanchesWithSensors,
    });

    return (
        <>
            <Column>
                <Box
                    sx={{
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        height: 65,
                    }}
                >
                    <Typography variant="h6" component="div">
                        Ranchos
                    </Typography>

                    <NewRanch refetchRanchesWithSensors={refetch} />
                </Box>

                {isError && <ErrorAlert message={String(error)} />}

                {isLoading && <RowLoading />}

                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {data?.map((item) => (
                        <ListItemButton
                            key={item.id}
                            onClick={() => onItemClick(item)}
                            sx={{
                                backgroundColor:
                                    selectedRanch && selectedRanch.id === item.id
                                        ? 'rgba(0, 0, 0, 0.04)'
                                        : 'none',
                            }}
                        >
                            <ListItemText primary={item.name} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRanchToEdit(item);
                                        setIsEditRanchDrawerOpen(true);
                                    }}
                                >
                                    <Iconify icon="solar:pen-bold-duotone" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    ))}
                </List>
            </Column>

            {ranchToEdit ? (
                <EditRanch
                    ranch={ranchToEdit}
                    refetchRanchesWithSensors={refetch}
                    isOpen={isEditRanchDrawerOpen}
                    onCloseDrawer={onCloseEditRanchDrawer}
                />
            ) : null}
        </>
    );
};
