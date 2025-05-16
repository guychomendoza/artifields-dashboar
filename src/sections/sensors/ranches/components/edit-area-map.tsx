import {useEffect} from "react";
import {Map} from "@vis.gl/react-google-maps";

import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

import {useDrawingManager} from "../../../../hooks/use-drawing-manager";
import { useMultiplePolygonMarkerManager } from '../../../../hooks/use-multiple-drawing-manager';

type AreaMapProps = {
    onSendFunction: (markerPosition: google.maps.LatLngLiteral | null, polygon: google.maps.LatLngLiteral[][] ) => void;
    isLoading: boolean;
    marker: google.maps.LatLngLiteral | null;
    polygon: google.maps.LatLngLiteral[][] | null;
}

export const EditAreaMap = ({
    onSendFunction,
    isLoading,
    marker,
    polygon,
}: AreaMapProps) => {
    const {
        markerPosition,
        polygonsCoordinates,
        setMarkerFromCoordinates,
        addMultiplePolygonsFromCoordinates,
    } = useMultiplePolygonMarkerManager();

    useEffect(() => {
        if (!marker) return;
        setMarkerFromCoordinates(marker);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marker]);

    useEffect(() => {
        if (!polygon) return;
        if (polygonsCoordinates.length === 0) {
            addMultiplePolygonsFromCoordinates(polygon);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [polygon]);

    return (
        <>
            <Box
                sx={{
                    borderRadius: 1,
                    overflow: "clip"
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
                Actualizar Rancho
            </LoadingButton>
        </>
    )

}