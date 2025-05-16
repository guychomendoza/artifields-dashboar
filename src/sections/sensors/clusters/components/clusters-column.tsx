import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import { Column } from './column';
import { NewCluster } from './new-cluster';
import { EditCluster } from './edit-cluster';
import { Iconify } from '../../../../components/iconify';
import { ErrorAlert } from '../../../../layouts/alert/error-alert';
import { RowLoading } from '../../../../layouts/loading/row-loading';
import {
    deleteCluster,
    getClustersAndSensorsByRanchId,
} from '../../../../api-requests/ranches/admin-clusters';

import type {
    RanchWithSensors,
    ClustersAndSensorsByRanchId,
} from '../../../../api-requests/ranches/schema';

type ClustersColumnProps = {
    onItemClick: (item: any) => void;
    onBack?: () => void;
    showBackButton?: boolean;
    selectedRanch: RanchWithSensors | null;
    selectedCluster: ClustersAndSensorsByRanchId | null;
};

export const ClustersColumn = ({
    onBack,
    showBackButton,
    onItemClick,
    selectedRanch,
    selectedCluster,
}: ClustersColumnProps) => {
    const [clusterToEdit, setClusterToEdit] = useState<ClustersAndSensorsByRanchId | null>(null);
    const [isEditClusterDrawerOpen, setIsEditClusterDrawerOpen] = useState(false);

    const onCloseEditClusterDrawer = () => {
        setIsEditClusterDrawerOpen(false);
        setClusterToEdit(null);
    };

    const { data, refetch, isError, error, isLoading } = useQuery({
        queryKey: ['clusters-by-ranch', selectedRanch?.id],
        queryFn: () => {
            if (!selectedRanch?.id) return [];
            return getClustersAndSensorsByRanchId(selectedRanch?.id);
        },
        enabled: !!selectedRanch?.id,
    });

    const mutation = useMutation({
        mutationFn: (cluster: { clusterTodeleteId: number }) =>
            deleteCluster(cluster.clusterTodeleteId),
        onSuccess: async (_, variables) => {
            refetch();
            if (selectedCluster?.cluster.id === variables.clusterTodeleteId) {
                onItemClick(null);
            }
        },
    });

    const refetchClusters = async () => {
        const { data: refetchedData } = await refetch();
        const newSelectedCluster = refetchedData?.find((cluster) => cluster.cluster.id === selectedCluster?.cluster.id);
        if (newSelectedCluster) {
            onItemClick(newSelectedCluster);
        }
    }

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
                    {showBackButton && (
                        <IconButton onClick={onBack} edge="start" sx={{ mr: 1 }}>
                            <Iconify icon="solar:arrow-left-line-duotone" />
                        </IconButton>
                    )}

                    <Typography variant="h6" component="div">
                        Clusters
                    </Typography>

                    <NewCluster refetchClusters={refetch} />
                </Box>

                {isError && <ErrorAlert message={String(error)} />}

                {(!isError && isLoading) && <RowLoading />}

                {!isError && (
                    <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                        {data?.map((item) => (
                            <ListItemButton
                                key={item.cluster.id}
                                onClick={() => onItemClick(item)}
                                sx={{
                                    backgroundColor:
                                        selectedCluster &&
                                        selectedCluster.cluster.id === item.cluster.id
                                            ? 'rgba(0, 0, 0, 0.04)'
                                            : 'none',
                                }}
                            >
                                <ListItemText primary={item.cluster.name} />
                                <ListItemSecondaryAction
                                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                                >
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            mutation.mutate({
                                                clusterTodeleteId: item.cluster.id,
                                            });
                                        }}
                                        disabled={mutation.isPending}
                                    >
                                        <Iconify icon="solar:trash-bin-2-bold-duotone" />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setClusterToEdit(item);
                                            setIsEditClusterDrawerOpen(true);
                                        }}
                                    >
                                        <Iconify icon="solar:pen-bold-duotone" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Column>

            {clusterToEdit ? (
                <EditCluster
                    selectedCluster={selectedCluster}
                    onItemClick={onItemClick}
                    refetchClusters={refetchClusters}
                    isOpen={isEditClusterDrawerOpen}
                    onCloseDrawer={onCloseEditClusterDrawer}
                    cluster={clusterToEdit}
                />
            ) : null}
        </>
    );
};
