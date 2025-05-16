import { Map } from "@vis.gl/react-google-maps";

import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

import { useMultiplePolygonMarkerManager } from '../../../../hooks/use-multiple-drawing-manager';

type AreaMapProps = {
    onSendFunction: (markerPosition: google.maps.LatLngLiteral | null, polygon: google.maps.LatLngLiteral[][]) => void;
    isLoading: boolean;
    isMobile: boolean;
};

export const AreaMap = ({ onSendFunction, isLoading, isMobile }: AreaMapProps) => {
    const { polygonsCoordinates, markerPosition } = useMultiplePolygonMarkerManager();

    return (
        <Box>
            <Box
                sx={{
                    borderRadius: 1,
                    overflow: "clip",
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
                    onClick={() => {
                        onSendFunction(markerPosition, polygonsCoordinates);
                    }}
                    loading={isLoading}
                    disabled={isLoading}
                    fullWidth
                    sx={{
                        width: isMobile ? '100%' : "fit-content",
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: isMobile ? 2 : 0,
                        position: isMobile ? 'relative' : 'absolute',
                        top: isMobile ? 'auto' : 26,
                        right: isMobile ? 'auto' : 32,
                    }}
                >
                    Crear cluster
                </LoadingButton>
        </Box>
    );
};