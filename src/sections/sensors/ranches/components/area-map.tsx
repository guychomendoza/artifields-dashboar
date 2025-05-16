import { Map } from '@vis.gl/react-google-maps';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { useMultiplePolygonMarkerManager } from '../../../../hooks/use-multiple-drawing-manager';

type AreaMapProps = {
    onSendFunction: (
        markerPosition: google.maps.LatLngLiteral | null,
        polygon: google.maps.LatLngLiteral[][]
    ) => void;
    isLoading: boolean;
};

export const AreaMap = ({ onSendFunction, isLoading }: AreaMapProps) => {
    const { polygonsCoordinates, markerPosition } = useMultiplePolygonMarkerManager();

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
                    controlSize={25}
                    style={{ height: 500 }}
                />
            </Box>

            <LoadingButton
                variant="contained"
                fullWidth
                sx={{ mb: 2, mt: 1 }}
                onClick={() => {
                    onSendFunction(markerPosition, polygonsCoordinates);
                }}
                loading={isLoading}
                disabled={isLoading}
            >
                Crear rancho
            </LoadingButton>
        </>
    );
};
