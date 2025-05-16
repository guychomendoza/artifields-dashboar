import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {WebhookView} from "../sections/webhooks/webhook-view";


// ----------------------------------------------------------------------

export default function Webhooks() {
    return (
        <>
            <Helmet>
                <title> {`Weebhooks - ${CONFIG.appName}`}</title>
            </Helmet>

            <WebhookView />
        </>
    );
}
