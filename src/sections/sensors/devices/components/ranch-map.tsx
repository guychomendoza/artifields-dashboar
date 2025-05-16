import { Map } from '@vis.gl/react-google-maps';
import {useMutation} from "@tanstack/react-query";

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { useDrawingManager } from 'src/hooks/use-drawing-manager';

import {Iconify} from "../../../../components/iconify";
import {assignAreaToSensor} from "../../../../api-requests/admin/sensors";

type RanchMapProps = {
    deviceId: string;
};

export const RanchMap = ({
    deviceId,
}: RanchMapProps) => {
    const { polygonCoordinates } = useDrawingManager();
    const mutation = useMutation({
        mutationFn: (sensorInfo: {
            deviceId: string, coordinates: google.maps.LatLngLiteral[]
        }) => assignAreaToSensor(sensorInfo.deviceId, sensorInfo.coordinates)
    });

    return (
        <>
            <Box
                sx={{
                    borderRadius: 1,
                    overflow: 'clip',
                }}
            >
                <Map
                    streetViewControl={false}
                    defaultZoom={5}
                    defaultCenter={{
                        lat: 23.6345,
                        lng: -102.5528,
                    }}
                    mapTypeId="satellite"
                    gestureHandling="greedy"
                    mapId="f1b7b1b3b1b3b1b3"
                    zoomControl={false}
                    style={{ height: 400 }}
                />
            </Box>

            {
                mutation.isSuccess ? (
                    <Alert
                        severity="success"
                        icon={<Iconify icon="solar:check-read-line-duotone" />}
                        sx={{mt: 1}}
                    >
                        Área asignada correctamente
                    </Alert>
                ) : null
            }

            {
                mutation.isError ? (
                    <Alert
                        severity="error"
                        icon={<Iconify icon="solar:shield-warning-bold-duotone" />}
                        sx={{mt: 1}}
                    >
                        {mutation.error.message}
                    </Alert>
                ) : null
            }

            <LoadingButton
                variant="contained"
                disabled={mutation.isPending}
                loading={mutation.isPending}
                fullWidth
                sx={{mt: 1}}
                onClick={() => mutation.mutate({ deviceId, coordinates: polygonCoordinates})}
            >
                Asignar area
            </LoadingButton>
        </>
    );
};
