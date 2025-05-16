import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {LogsView} from "../sections/logs/logs-view";


// ----------------------------------------------------------------------

export default function Cms() {
    return (
        <>
            <Helmet>
                <title> {`Logs - ${CONFIG.appName}`}</title>
            </Helmet>

            <LogsView />
        </>
    );
}
