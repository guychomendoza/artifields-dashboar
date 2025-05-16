import { Map } from '@vis.gl/react-google-maps';

import { RanchesMapContent } from './ranches-map-content';

import type { ClustersAndSensors } from '../../../api-requests/ranches/schema';

type RanchesSensorsMapProps = {
    clustersAndSensors: ClustersAndSensors
};

export const RanchesSensorsMap = ({ clustersAndSensors }: RanchesSensorsMapProps) => (
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
        zoomControl
        zoomControlOptions={{
            position: google.maps.ControlPosition.RIGHT_TOP,
        }}
        style={{ height: '100%' }}
    >
        <RanchesMapContent clustersAndSensors={clustersAndSensors} />
    </Map>
);
