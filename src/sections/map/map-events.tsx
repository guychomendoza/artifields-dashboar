import { useMap } from 'react-leaflet';

export const MapEvents = ({
    setFullscreen,
    isFullscreen,
}: {
    setFullscreen: (value: boolean) => void;
    isFullscreen: boolean;
}) => {
    const map = useMap();

    map.on('resize', (e) => {
        if (e.newSize.y === 480 && !isFullscreen) {
            setFullscreen(false);
            return;
        }
        if (e.newSize.y > 480 && isFullscreen) return;
        setFullscreen(e.newSize.y > 480);
    });

    return null;
};
