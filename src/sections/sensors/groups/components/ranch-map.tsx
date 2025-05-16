import { Map } from '@vis.gl/react-google-maps';

import LoadingButton from '@mui/lab/LoadingButton';

import { useDrawingManager } from 'src/hooks/use-drawing-manager';

type RanchMapProps = {
    onSendCoordinates: (coordinates: google.maps.LatLngLiteral[]) => void;
    isPending: boolean;
}

export const RanchMap = ({ onSendCoordinates, isPending }: RanchMapProps) => {
    const { polygonCoordinates } = useDrawingManager();

    return (
        <>
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

            <LoadingButton
                variant="contained"
                disabled={isPending}
                loading={isPending}
                sx={{ mt: 1 }}
                fullWidth
                onClick={() => onSendCoordinates(polygonCoordinates)}
            >
                Asignar coordenadas
            </LoadingButton>
        </>
    );
};