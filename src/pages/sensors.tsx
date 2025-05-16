import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SensorsView } from 'src/sections/sensors/sensors-view';

// ----------------------------------------------------------------------

export default function SensorsPage() {
    return (
        <>
            <Helmet>
                <title> {`Sensors - ${CONFIG.appName}`}</title>
            </Helmet>

            <SensorsView />
        </>
    );
}
