import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SensorsReportView } from 'src/sections/sensors-report/view';

export default function SensorsReport() {
    return (
        <>
            <Helmet>
                <title> {`Reportes de sensores - ${CONFIG.appName}`}</title>
            </Helmet>

            <SensorsReportView />
        </>
    );
}
