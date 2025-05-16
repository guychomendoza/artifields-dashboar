import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { IotSensorView } from 'src/sections/iot/view.tsx';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`IOT Details - ${CONFIG.appName}`}</title>
            </Helmet>

            <IotSensorView />
        </>
    );
}
