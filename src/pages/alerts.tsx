import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {AlertsView} from "../sections/alerts/alerts-view";


export default function Alerts() {
    return (
        <>
            <Helmet>
                <title> {`Alertas - ${CONFIG.appName}`}</title>
            </Helmet>

            <AlertsView />
        </>
    );
}
