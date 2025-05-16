import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {RanchesView} from "../sections/ranches/ranches-view";

// ----------------------------------------------------------------------

export default function RanchesPage() {
    return (
        <>
            <Helmet>
                <title> {`Ranchos - ${CONFIG.appName}`}</title>
            </Helmet>

            <RanchesView />
        </>
    );
}
