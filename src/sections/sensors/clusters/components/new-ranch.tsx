import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AreaMap } from './area-map';
import { Scrollbar } from '../../../../components/scrollbar';
import { ErrorAlert } from '../../../../layouts/alert/error-alert';
import { ReactMap } from '../../../../layouts/components/react-map';
import { SuccessAlert } from '../../../../layouts/alert/success-alert';
import { createNewRanch } from '../../../../api-requests/ranches/admin-ranches';

type NewRanchProps = {
    refetchRanchesWithSensors: () => void;
};

export const NewRanch = ({ refetchRanchesWithSensors }: NewRanchProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const mutation = useMutation({
        mutationKey: ['createNewRanch', isOpen],
        mutationFn: ({
            ranchName,
            lat,
            long,
            areaCoordinates,
        }: {
            ranchName: string;
            lat: number;
            long: number;
            areaCoordinates: google.maps.LatLngLiteral[][];
        }) => createNewRanch(ranchName, lat, long, areaCoordinates),
        onSuccess: () => {
            refetchRanchesWithSensors();
            setName('');
        },
    });

    const onCreateNewRanch = (
        markerPosition: google.maps.LatLngLiteral | null,
        polygon: google.maps.LatLngLiteral[][]
    ) => {
        if (!markerPosition || polygon.length === 0 || !name) return;
        mutation.mutate({
            ranchName: name,
            lat: markerPosition.lat,
            long: markerPosition.lng,
            areaCoordinates: polygon,
        });
    };

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                size="small"
                sx={{ mt: isMobile ? 1 : 0, ml: 'auto' }}
                onClick={() => setIsOpen(true)}
            >
                Crear Rancho
            </Button>

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
                            },
                        }}
                    >
                        <Typography variant="subtitle1">Crear un nuevo rancho</Typography>

                        {mutation.isError && (
                            <Box sx={{ my: 2 }}>
                                <ErrorAlert message={`${mutation.error}`} />
                            </Box>
                        )}

                        {mutation.isSuccess && (
                            <Box sx={{ my: 2 }}>
                                <SuccessAlert message="Rancho creado" />
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            size="small"
                            label="Nombre"
                            sx={{ mt: 2 }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Typography variant="caption" sx={{ mt: 3, mb: 1, display: 'block' }}>
                            Selecciona la ubicación del rancho y el su área
                        </Typography>

                        <ReactMap>
                            <AreaMap
                                isLoading={mutation.isPending}
                                onSendFunction={onCreateNewRanch}
                                isMobile={isMobile}
                            />
                        </ReactMap>
                    </Box>
                </Scrollbar>
            </Drawer>
        </>
    );
};
