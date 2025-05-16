import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AssignedSensorsView } from 'src/sections/assigned-sensors/view/assigned-sensors-view';

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Your Sensors - ${CONFIG.appName}`}</title>
            </Helmet>

            <AssignedSensorsView />
        </>
    );
}
