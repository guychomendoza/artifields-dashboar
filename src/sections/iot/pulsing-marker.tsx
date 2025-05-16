import { AdvancedMarker } from '@vis.gl/react-google-maps';

export const PulsingMarker = ({ position }: { position: { lat: number; lng: number } }) => (
    <AdvancedMarker position={position}>
        <div className="marker-container">
            <div className="pulse-ring" />
            <div className="pulse-dot" />
            <div className="marker-dot" />
            <div className="marker-label">Device Location</div>
        </div>
    </AdvancedMarker>
);
