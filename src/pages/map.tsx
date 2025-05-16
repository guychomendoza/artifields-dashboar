import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MapView } from 'src/sections/map/view/map-view';

// ----------------------------------------------------------------------

export default function Map() {
    return (
        <>
            <Helmet>
                <title> {`Mapas - ${CONFIG.appName}`}</title>
            </Helmet>

            <MapView />
        </>
    );
}
